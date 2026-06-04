# memory_store.py
from collections import deque, defaultdict
from datetime import datetime, timedelta
import threading

TTL_MINUTES = 30
MAX_MESSAGES = 20  # per session

class MemoryStore:
    def __init__(self):
        self._sessions: dict[str, deque] = defaultdict(lambda: deque(maxlen=MAX_MESSAGES))
        self._timestamps: dict[str, datetime] = {}
        self._lock = threading.Lock()

    def add_message(self, session_id: str, role: str, content: str):
        with self._lock:
            self._sessions[session_id].append({"role": role, "content": content})
            self._timestamps[session_id] = datetime.utcnow()

    def get_history(self, session_id: str) -> list:
        with self._lock:
            return list(self._sessions.get(session_id, []))

    def clear(self, session_id: str):
        with self._lock:
            self._sessions.pop(session_id, None)
            self._timestamps.pop(session_id, None)

    def evict_stale(self):
        """Removes sessions inactive for more than TTL_MINUTES."""
        cutoff = datetime.utcnow() - timedelta(minutes=TTL_MINUTES)
        with self._lock:
            stale = [sid for sid, ts in self._timestamps.items() if ts < cutoff]
            for sid in stale:
                del self._sessions[sid]
                del self._timestamps[sid]

# single instance imported everywhere
store = MemoryStore()