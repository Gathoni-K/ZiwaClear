import { Outlet, useLocation } from "react-router-dom";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";
import { AIChatWidget } from "../components/AIChatWidget";
import { ChatWidgetProvider } from "../context/ChatWidgetContext";
import { ActiveBeachProvider } from "../context/ActiveBeachContext";
import { ToastContainer } from "../components/Toast";

export function Layout() {
  const { pathname } = useLocation();
  const isMainDashboard = pathname === "/dashboard";

  return (
    <ChatWidgetProvider>
      <ActiveBeachProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <LandingNav />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          {!isMainDashboard && <LandingFooter />}
          <AIChatWidget />
        </div>
        <ToastContainer />
      </ActiveBeachProvider>
    </ChatWidgetProvider>
  );
}