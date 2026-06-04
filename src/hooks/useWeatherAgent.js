import { useState, useCallback, useRef } from "react";

const API = "https://weather-app-6upu.onrender.com";

export function useWeatherAgent() {
  const [messages, setMessages] = useState([]);
  const [agentSteps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(null);

  const send = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setSteps([]);
      setLoading(true);

      try {
        const res = await fetch(`${API}/api/chat/stream/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text, session_id: sessionId.current }),
        });

        // Handle HTTP-level errors (429 quota, 500 server error, etc.)
        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: null,
              error: "quota_exceeded",
            },
          ]);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { done: streamDone, value } = await reader.read();
          done = streamDone;
          if (!value) continue;

          const lines = decoder.decode(value, { stream: true }).split("\n");

          for (const line of lines) {
            // skip non-data lines
            if (!line.startsWith("data: ")) continue;

            try {
              const event = JSON.parse(line.slice(6)); // parse first

              if (event.type === "session") {
                sessionId.current = event.session_id;
              }

              if (event.type === "tool_call") {
                setSteps((s) => [...s, { ...event, status: "calling" }]);
              }

              if (event.type === "tool_result") {
                setSteps((s) =>
                  s.map((step) =>
                    step.tool === event.tool && step.status === "calling"
                      ? { ...step, status: event.ok ? "done" : "error" }
                      : step,
                  ),
                );
              }

              if (event.type === "answer") {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: event.content },
                ]);
                setLoading(false);
              }

              // Handle agent-level errors streamed from backend
              if (event.type === "error") {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: null,
                    error: event.code ?? "unknown",
                  },
                ]);
                setLoading(false);
                return;
              }
            } catch {
              // silently skip malformed SSE lines
            }
          }
        }
      } catch (err) {
        // Network error or thrown HTTP error
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: null,
            error: "unknown",
          },
        ]);
        setLoading(false);
      }
    },
    [loading],
  );

  const reset = useCallback(async () => {
    if (sessionId.current) {
      await fetch(`${API}/api/history/${sessionId.current}`, {
        method: "DELETE",
      }).catch(() => {});
      sessionId.current = null;
    }
    setMessages([]);
    setSteps([]);
  }, []);

  return { messages, agentSteps, loading, send, reset };
}
