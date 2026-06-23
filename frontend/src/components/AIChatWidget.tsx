import { Bot, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { useChatWidget } from "../context/ChatWidgetContext";

export function AIChatWidget() {
  const { isOpen, toggle, close } = useChatWidget();

  return (
    <div className="fixed bottom-6 right-6 z-[1100] flex flex-col items-end gap-3 pointer-events-none">
      {/* Slide-up panel */}
      <div
        className={`w-[340px] h-[460px] rounded-tile bg-tile border border-border-ui shadow-2xl overflow-hidden
                    origin-bottom-right transition-all duration-200
                    ${isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-ui">
          <span className="font-bold text-sm">ZiwaClear AI Assistant</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="h-[calc(100%-49px)]">
          <ChatPanel />
        </div>
      </div>

      {/* Trigger button — always clickable even though the wrapper above it is not */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        className="pointer-events-auto flex items-center gap-2 bg-primary text-background font-semibold text-sm px-4 py-3
                   rounded-pill shadow-lg hover:bg-primary-hover transition-colors"
      >
        {isOpen ? <X size={18} /> : <Bot size={18} />}
        {!isOpen && "Ask AI Assistant"}
      </button>
    </div>
  );
}