import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { AIChatWidget } from "../components/AIChatWidget";
import { ChatWidgetProvider } from "../context/ChatWidgetContext";

export function Layout() {
  return (
    <ChatWidgetProvider>
      <div className="h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <AIChatWidget />
      </div>
    </ChatWidgetProvider>
  );
}