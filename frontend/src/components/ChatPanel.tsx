import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "../types/chat";
import { ChatBubble } from "./ChatBubble";
import { streamChatResponse } from "../lib/chatStream";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        "Hi! I'm the ZiwaClear AI Assistant. Ask me about available batches, impact metrics, or payments.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
    };

    const assistantId = generateId();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInput("");
    setIsStreaming(true);

    try {
      // Send all messages so the AI has full conversation context
      const allMessages = [...messages, userMessage];
      
      await streamChatResponse(allMessages, (chunkSoFar) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: chunkSoFar } : m
          )
        );
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't reach the AI service. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-border-ui">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about batches, impact, payments..."
          disabled={isStreaming}
          className="flex-1 bg-input border border-border-ui rounded-pill px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          aria-label="Send message"
          className="w-9 h-9 rounded-full bg-primary text-background flex items-center justify-center
                     hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}