import { NavLink } from "react-router-dom";
import { LayoutGrid, Package, Receipt, Leaf, Bot, ShieldCheck } from "lucide-react";
import { useChatWidget } from "../context/ChatWidgetContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Claimed Batches", to: "/dashboard/claimed-batches", icon: Package },
  { label: "Transactions", to: "/dashboard/transactions", icon: Receipt },
  { label: "Impact", to: "/dashboard/impact", icon: Leaf },
];

export function AppSideNav() {
  const { open } = useChatWidget();

  return (
    <aside className="w-[220px] h-full shrink-0 bg-tile border-r border-border-ui p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="rounded-tile bg-input border border-border-ui p-3">
        <span className="inline-flex text-[10px] font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
          Premium Tier
        </span>
        <p className="font-bold mt-2">Institutional Investor</p>
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
          onClick={open}
          className="flex items-center gap-3 px-3 py-2 rounded-input text-sm font-medium text-muted
                     hover:bg-input hover:text-foreground transition-colors text-left"
        >
          <Bot size={16} />
          AI Assistant
        </button>
      </nav>
    </aside>
  );
}