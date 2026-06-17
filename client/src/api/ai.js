import apiClient from "./client";

export async function sendChatMessage(messages) {
  const { data } = await apiClient.post("/chat", { messages });
  return data;
}
