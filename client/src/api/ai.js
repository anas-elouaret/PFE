import apiClient from "./client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = API_BASE.endsWith("/api")
  ? API_BASE
  : `${API_BASE.replace(/\/+$/, "")}/api`;

export async function sendChatMessage(messages) {
  const { data } = await apiClient.post("/chat", { messages });
  return data;
}

/**
 * Sends a chat message and streams the response via Server-Sent Events.
 * @param {Array} messages - Conversation history [{ role, content }]
 * @param {Function} onChunk - Called with each text delta
 * @param {Function} onDone - Called with { link } when stream completes
 * @param {Function} onError - Called with error data
 */
export async function sendChatMessageStream(messages, onChunk, onDone, onError) {
  try {
    const response = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      onError(errorData);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const payload = line.slice(6);
        if (payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);
          if (parsed.type === "chunk") {
            onChunk(parsed.text);
          } else if (parsed.type === "done") {
            onDone(parsed.link || null);
          } else if (parsed.type === "error") {
            onError(parsed);
          }
        } catch {
          // skip unparseable lines
        }
      }
    }
  } catch (err) {
    onError({ message: err.message });
  }
}
