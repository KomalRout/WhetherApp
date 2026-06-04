import asyncio
from google import genai
from google.genai import types
from geocode import geocode
from weather import get_weather, get_hourly
from gemini_client import client

MODEL = "gemini-2.5-flash"

SYSTEM = """You are a proactive weather assistant agent. You have tools to fetch real weather data.

Your behavior:
- ALWAYS fetch real data before answering — never guess weather from memory.
- For trip or activity questions, fetch weather for every relevant day and location.
- If the user mentions multiple cities, compare them.
- If they ask about timing ("best time to go"), use get_hourly_forecast.
- After fetching, synthesize a direct recommendation — don't just dump numbers.
- If conditions look severe, always check check_alerts unprompted.

Think step by step about what data you need before calling any tool."""

# ── Tool definitions (Gemini format) ──────────────────────────────────────────

TOOLS = types.Tool(function_declarations=[
    types.FunctionDeclaration(
        name="get_weather",
        description="Get current weather and 5-day forecast for a city.",
        parameters=types.Schema(
            type="OBJECT",
            properties={
                "city": types.Schema(type="STRING", description="City name e.g. 'Mumbai'"),
            },
            required=["city"],
        ),
    ),
    types.FunctionDeclaration(
        name="compare_weather",
        description="Compare weather between two cities side by side.",
        parameters=types.Schema(
            type="OBJECT",
            properties={
                "city_a": types.Schema(type="STRING"),
                "city_b": types.Schema(type="STRING"),
            },
            required=["city_a", "city_b"],
        ),
    ),
    types.FunctionDeclaration(
        name="get_hourly_forecast",
        description="Get hour-by-hour forecast for today. Use when user asks about specific times or best time to go outside.",
        parameters=types.Schema(
            type="OBJECT",
            properties={
                "city":  types.Schema(type="STRING"),
                "hours": types.Schema(type="INTEGER", description="Hours ahead, max 24"),
            },
            required=["city"],
        ),
    ),
    types.FunctionDeclaration(
        name="check_alerts",
        description="Check for severe weather alerts or warnings for a location.",
        parameters=types.Schema(
            type="OBJECT",
            properties={
                "city": types.Schema(type="STRING"),
            },
            required=["city"],
        ),
    ),
])

# ── Tool dispatcher ────────────────────────────────────────────────────────────

async def dispatch_tool(name: str, args: dict) -> dict:
    if name == "get_weather":
        coords = await geocode(args["city"])
        if not coords:
            return {"error": f"Location not found: {args['city']}"}
        data = await get_weather(coords["lat"], coords["lon"])
        data["location"] = coords["name"]
        return data

    if name == "compare_weather":
        results = {}
        for key in ("city_a", "city_b"):
            coords = await geocode(args[key])
            if coords:
                w = await get_weather(coords["lat"], coords["lon"])
                w["location"] = coords["name"]
                results[key] = w
            else:
                results[key] = {"error": f"Not found: {args[key]}"}
        return results

    if name == "get_hourly_forecast":
        coords = await geocode(args["city"])
        if not coords:
            return {"error": f"Location not found: {args['city']}"}
        return await get_hourly(coords["lat"], coords["lon"], args.get("hours", 12))

    if name == "check_alerts":
        coords = await geocode(args["city"])
        if not coords:
            return {"error": f"Location not found: {args['city']}"}
        # Open-Meteo doesn't have alerts — return a derived warning from weather data
        data = await get_weather(coords["lat"], coords["lon"])
        alerts = _derive_alerts(data)
        return {"location": coords["name"], "alerts": alerts}

    return {"error": f"Unknown tool: {name}"}


def _derive_alerts(weather: dict) -> list[str]:
    """Derive simple alerts from weather data since Open-Meteo has no alert endpoint."""
    alerts = []
    cur = weather.get("current", {})
    if cur.get("wind_speed", 0) > 60:
        alerts.append("High wind warning: wind speed exceeds 60 km/h")
    if cur.get("temp", 20) > 42:
        alerts.append("Extreme heat warning: temperature above 42°C")
    if cur.get("temp", 20) < 0:
        alerts.append("Freezing conditions: temperature below 0°C")
    for day in weather.get("forecast", []):
        if day.get("precipitation", 0) > 50:
            alerts.append(f"Heavy rainfall warning on {day['date']}: {day['precipitation']}mm expected")
    return alerts or ["No active alerts"]

# ── Agentic loop ───────────────────────────────────────────────────────────────

def _build_history(session_history: list) -> list:
    """Convert stored [{role, content}] to Gemini Content objects."""
    contents = []
    for msg in session_history:
        role = "model" if msg["role"] == "assistant" else "user"
        contents.append(types.Content(
            role=role,
            parts=[types.Part(text=msg["content"])]
        ))
    return contents

async def run_agent(session_history: list, user_message: str) -> str:
    contents = _build_history(session_history)
    contents.append(types.Content(
        role="user",
        parts=[types.Part(text=user_message)]
    ))

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM,
        tools=[TOOLS],
        temperature=0.3,
    )

    # Agentic loop
    while True:
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=config,
        )

        candidate = response.candidates[0]
        contents.append(candidate.content)  # append model turn

        # Check if any part is a function call
        tool_calls = [p for p in candidate.content.parts if p.function_call]

        if not tool_calls:
            # No tool calls — extract text and return
            return next(
                (p.text for p in candidate.content.parts if hasattr(p, "text") and p.text),
                "I couldn't generate a response."
            )

        # Execute all tool calls in parallel
        tool_results = await asyncio.gather(*[
            dispatch_tool(p.function_call.name, dict(p.function_call.args))
            for p in tool_calls
        ])

        # Build function response parts
        response_parts = [
            types.Part(function_response=types.FunctionResponse(
                name=tool_calls[i].function_call.name,
                response={"result": tool_results[i]},
            ))
            for i in range(len(tool_calls))
        ]

        # Append tool results and loop
        contents.append(types.Content(role="user", parts=response_parts))


async def run_agent_stream(session_history: list, user_message: str, session_id: str):
    from memory_store import store
    contents = _build_history(session_history)
    contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))
    config = types.GenerateContentConfig(system_instruction=SYSTEM, tools=[TOOLS], temperature=0.3)

    while True:
        response = client.models.generate_content(model=MODEL, contents=contents, config=config)
        candidate = response.candidates[0]
        contents.append(candidate.content)

        tool_calls = [p for p in candidate.content.parts if p.function_call]

        if not tool_calls:
            text = next((p.text for p in candidate.content.parts if hasattr(p, "text") and p.text), "")
            store.add_message(session_id, "user", user_message)
            store.add_message(session_id, "assistant", text)
            yield {"type": "answer", "content": text}
            return

        # Stream each tool call status to frontend
        results = []
        for i, part in enumerate(tool_calls):
            name = part.function_call.name
            args = dict(part.function_call.args)
            yield {"type": "tool_call", "tool": name, "input": args}

            result = await dispatch_tool(name, args)
            yield {"type": "tool_result", "tool": name, "ok": "error" not in result}
            results.append(result)

        response_parts = [
            types.Part(function_response=types.FunctionResponse(
                name=tool_calls[i].function_call.name,
                response={"result": results[i]},
            ))
            for i in range(len(tool_calls))
        ]
        contents.append(types.Content(role="user", parts=response_parts))
