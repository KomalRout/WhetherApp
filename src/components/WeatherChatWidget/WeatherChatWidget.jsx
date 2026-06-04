import { useState, useRef, useEffect } from "react";
import "./weatherChatWidget.css";
import { useWeatherAgent } from "../../hooks/useWeatherAgent";

const SUGGESTIONS = [
  "🌤  What's the weather in Mumbai right now?",
  "🌧  Will it rain in Delhi this week?",
  "✈️  Compare weather: Bangalore vs Chennai",
  "⏰  Best time to go outside in Pune today?",
];

const ERROR_MESSAGES = {
  quota_exceeded: {
    icon: "⚠️",
    title: "Daily limit reached",
    body: "I've hit my free tier quota for today. Come back tomorrow and I'll be ready to help again!",
    hint: "Resets daily at midnight Pacific Time.",
  },
  api_error: {
    icon: "🔌",
    title: "Service unavailable",
    body: "Couldn't reach the weather service. Please try again in a moment.",
  },
  unknown: {
    icon: "❌",
    title: "Something went wrong",
    body: "An unexpected error occurred. Please try again.",
    hint: "If this issue persists, please contact support.",
  },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCloud = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const IconClose = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconSend = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

// ── AgentSteps component ──────────────────────────────────────────────────────
function AgentSteps({ steps }) {
  if (!steps.length) return null;
  return (
    <div className="wcw-steps">
      {steps.map((s, i) => (
        <div key={i} className={`wcw-step ${s.status}`}>
          {s.status === "calling" ? (
            <span className="wcw-step-spinner" />
          ) : (
            <span className="wcw-step-icon">
              {s.status === "done" ? "✓" : "✗"}
            </span>
          )}
          {s.status === "calling"
            ? "Fetching"
            : s.status === "done"
              ? "Got"
              : "Failed"}{" "}
          <strong>{s.tool.replace(/_/g, " ")}</strong>
          {s.input?.city ? ` · ${s.input.city}` : ""}
          {s.input?.city_a ? ` · ${s.input.city_a} & ${s.input.city_b}` : ""}
        </div>
      ))}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function WeatherChatWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const { messages, agentSteps, loading, send, reset } = useWeatherAgent();
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const hasMessages = messages.length > 0;

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentSteps, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "22px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);

  const handleToggle = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 190);
    } else {
      setOpen(true);
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    send(input.trim());
    setInput("");
    textareaRef.current.style.height = "22px";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="wcw">
      {/* Chat panel */}
      {open && (
        <div className={`wcw-panel ${closing ? "closing" : ""}`}>
          {/* Header */}
          <div className="wcw-header">
            <div className="wcw-header-avatar">🌤</div>
            <div className="wcw-header-info">
              <div className="wcw-header-name">Weather Assistant</div>
              <div className="wcw-header-status">
                <div className="wcw-status-dot" />
                {loading ? "Thinking…" : "Online · Gemini 2.0 Flash"}
              </div>
            </div>
            <div className="wcw-header-actions">
              {hasMessages && (
                <button
                  className="wcw-icon-btn"
                  onClick={reset}
                  title="Clear chat"
                >
                  <IconTrash />
                </button>
              )}
              <button
                className="wcw-icon-btn"
                onClick={handleToggle}
                title="Close"
              >
                <IconClose />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="wcw-messages">
            {!hasMessages ? (
              <div className="wcw-welcome">
                <div className="wcw-welcome-icon">🌦</div>
                <h3>Ask me anything about weather</h3>
                <p>
                  Real-time forecasts, comparisons, hourly breakdowns — powered
                  by AI.
                </p>
                <div className="wcw-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={`suggestion-${i}`}
                      className="wcw-suggestion"
                      onClick={() => {
                        send(s.replace(/^[\p{Emoji}\s]+/u, "").trim());
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={`msg-${i}`} className={`wcw-msg-row ${msg.role}`}>
                    <div className="wcw-msg-label">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </div>

                    {msg.error ? (
                      // ── Error bubble ──────────────────────────────
                      <div className="wcw-error-bubble">
                        <div className="wcw-error-icon">
                          {ERROR_MESSAGES[msg.error]?.icon ?? "❌"}
                        </div>
                        <div className="wcw-error-body">
                          <div className="wcw-error-title">
                            {ERROR_MESSAGES[msg.error]?.title}
                          </div>
                          <div className="wcw-error-text">
                            {ERROR_MESSAGES[msg.error]?.body}
                          </div>
                          <div className="wcw-error-hint">
                            {ERROR_MESSAGES.quota_exceeded.hint}
                          </div>
                          {msg.error === "quota_exceeded" && (
                            <a
                              className="wcw-error-link"
                              href="https://aistudio.google.com"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Check Gemini API billing →
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      // ── Normal bubble ─────────────────────────────
                      <div className="wcw-bubble">{msg.content}</div>
                    )}
                  </div>
                ))}

                {/* Live agent steps (shown while loading) */}
                {loading && agentSteps.length > 0 && (
                  <div className="wcw-msg-row assistant">
                    <AgentSteps steps={agentSteps} />
                  </div>
                )}

                {/* Typing indicator (before first tool call) */}
                {loading && agentSteps.length === 0 && (
                  <div className="wcw-msg-row assistant">
                    <div className="wcw-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="wcw-input-area">
            <div className="wcw-input-row">
              <textarea
                ref={textareaRef}
                className="wcw-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about weather anywhere…"
                rows={1}
                disabled={loading}
              />
              <button
                className="wcw-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                <IconSend />
              </button>
            </div>
            <div className="wcw-input-hint">↵ send · shift+↵ newline</div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className={`wcw-fab ${open ? "open" : ""}`}
        onClick={handleToggle}
      >
        {!open && <span className="wcw-fab-pulse" />}
        {open ? <IconClose /> : <IconCloud />}
      </button>
    </div>
  );
}
