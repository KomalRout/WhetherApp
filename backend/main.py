from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import asyncio
import json
import uuid

from ai import run_agent, run_agent_stream, QuotaExceededError
from memory_store import store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://komalrout.github.io"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Background task to evict stale sessions every 10 min
@app.on_event("startup")
async def start_eviction():
    async def evict_loop():
        while True:
            await asyncio.sleep(600)
            store.evict_stale()
    asyncio.create_task(evict_loop())


class ChatRequest(BaseModel):
    query: str                    # kept your original field name
    session_id: str | None = None


# ── Simple endpoint (replaces your original /api/chat/) ───────────────────────

@app.post("/api/chat/")
async def chat(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())
    history = store.get_history(session_id)

    # single call — agent handles geocode + weather + response internally
    try:
        reply = await run_agent(history, req.query)

        store.add_message(session_id, "user", req.query)
        store.add_message(session_id, "assistant", reply)

        return {
            "reply": reply,
            "session_id": session_id,   # return so React can persist it
        }
    except QuotaExceededError:
        return JSONResponse(
            status_code=429,
            content={"error": "quota_exceeded"}
        )


# ── Streaming endpoint (shows tool calls live in React) ───────────────────────

@app.post("/api/chat/stream/")
async def chat_stream(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())
    history = store.get_history(session_id)

    try:
        async def event_stream():
            yield f"data: {json.dumps({'type': 'session', 'session_id': session_id})}\n\n"
            async for event in run_agent_stream(history, req.query, session_id):
                yield f"data: {json.dumps(event)}\n\n"

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={"X-Accel-Buffering": "no"},
        )
    except QuotaExceededError:
        return JSONResponse(
            status_code=429,
            content={"error": "quota_exceeded"}
        )


# ── Session management ─────────────────────────────────────────────────────────

@app.get("/api/history/{session_id}")
async def get_history(session_id: str):
    return {"history": store.get_history(session_id), "session_id": session_id}


@app.delete("/api/history/{session_id}")
async def clear_history(session_id: str):
    store.clear(session_id)
    return {"cleared": True, "session_id": session_id}