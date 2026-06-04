import { useState, useCallback, useRef } from "react";

const API = "http://localhost:8000";

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

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value, { stream: true }).split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "session")
                sessionId.current = event.session_id;
              if (event.type === "tool_call")
                setSteps((s) => [...s, { ...event, status: "calling" }]);
              if (event.type === "tool_result")
                setSteps((s) =>
                  s.map((step) =>
                    step.tool === event.tool && step.status === "calling"
                      ? { ...step, status: event.ok ? "done" : "error" }
                      : step,
                  ),
                );
              if (event.type === "answer") {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: event.content },
                ]);
                setLoading(false);
              }
            } catch {}
          }
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't reach the weather service. Please try again.",
            error: true,
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
