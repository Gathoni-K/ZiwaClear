import { Outlet } from "react-router-dom";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";
import { AIChatWidget } from "../components/AIChatWidget";
import { ChatWidgetProvider } from "../context/ChatWidgetContext";

export function Layout() {
  return (
    <ChatWidgetProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <LandingNav />
        <main className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </main>
        <LandingFooter />
        <AIChatWidget />
      </div>
    </ChatWidgetProvider>
  );
}