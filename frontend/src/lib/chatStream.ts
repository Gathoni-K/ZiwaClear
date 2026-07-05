import type { ChatMessage } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    
    const lines = chunk.split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        if (line.startsWith("0:")) {
          const text = line.slice(2).replace(/^"|"$/g, "");
          fullText += text;
        } else if (line.startsWith("text:")) {
          fullText += line.slice(5);
        } else if (!line.startsWith("{") && !line.startsWith("[")) {
          fullText += line;
        }
      } catch {
       
      }
    }
    
    onChunk(fullText.trim());
  }
}