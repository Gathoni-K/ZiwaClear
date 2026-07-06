import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Package, Receipt, Leaf, Bot, ShieldCheck, Menu, X } from "lucide-react";
import { useChatWidget } from "../context/ChatWidgetContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Claimed Batches", to: "/dashboard/claimed-batches", icon: Package },
  { label: "Transactions", to: "/dashboard/transactions", icon: Receipt },
  { label: "Impact", to: "/dashboard/impact", icon: Leaf },
];

export function AppSideNav() {
  const { open } = useChatWidget();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="rounded-tile bg-input border border-border-ui p-3">
        <span className="inline-flex text-[10px] font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
          Premium Tier
        </span>
        <p className="font-bold mt-2 text-sm">Institutional Investor</p>
        <p className="text-xs text-muted flex items-center gap-1 mt-1">
          <ShieldCheck size={12} /> Verified Climate Partner
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-input text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-background"
                  : "text-muted hover:bg-input hover:text-foreground"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => {
            open();
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-input text-sm font-medium text-muted
                     hover:bg-input hover:text-foreground transition-colors text-left"
        >
          <Bot size={16} />
          AI Assistant
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-16 left-3 z-[1001] bg-tile border border-border-ui rounded-lg px-3 py-1.5 text-xs font-medium text-muted shadow"
      >
        {mobileOpen ? <X size={14} className="inline mr-1" /> : <Menu size={14} className="inline mr-1" />}
        Menu
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[220px] h-full shrink-0 bg-tile border-r border-border-ui p-4 flex-col gap-4 overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile overlay + sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[1000] bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 z-[1001] w-[260px] h-full bg-tile border-r border-border-ui p-4 flex flex-col gap-4 overflow-y-auto shadow-2xl">
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}