import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Claimed Batches", to: "/dashboard/claimed-batches" },
  { label: "Transactions", to: "/dashboard/transactions" },
  { label: "Impact", to: "/dashboard/impact" },
];

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-ui bg-tile">
      <h1 className="text-xl font-bold text-primary">ZiwaClear</h1>

      <nav className="flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted hover:text-foreground"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}