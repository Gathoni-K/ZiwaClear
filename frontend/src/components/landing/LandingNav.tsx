import { useState } from "react";
import { Link, useLocation} from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { UserMenu } from "../UserMenu";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const isDashboard = pathname.startsWith("/dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = isDashboard
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/dashboard/claimed-batches", label: "Claimed Batches" },
        { to: "/dashboard/transactions", label: "Transactions" },
        { to: "/dashboard/impact", label: "Impact" },
      ]
    : [
        { to: "#crisis", label: "The Crisis" },
        { to: "#solution", label: "Our Solution" },
        { to: "#vision", label: "Future Vision" },
      ];

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 relative">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary shrink-0">
        <img src="/logo.png" alt="ZiwaClear Logo" className="rounded-full object-cover" width="36" height="36" />
        <span className="hidden sm:inline">ZiwaClear</span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-muted">
        {navLinks.map(({ to, label }) =>
          to.startsWith("#") ? (
            <a key={to} href={to} className="hover:text-foreground transition-colors">
              {label}
            </a>
          ) : (
            <Link key={to} to={to} className="hover:text-foreground transition-colors">
              {label}
            </Link>
          )
        )}
      </nav>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <UserMenu />
          ) : isDashboard ? (
            <Link
              to="/login"
              className="text-sm font-semibold border border-primary text-primary px-4 py-2 rounded-pill hover:bg-primary/10 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold border border-primary text-primary px-4 py-2 rounded-pill hover:bg-primary/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold bg-primary text-background px-4 py-2 rounded-pill hover:bg-primary-hover transition-colors"
              >
                Join Marketplace
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-tile border-b border-border-ui z-50 md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map(({ to, label }) =>
              to.startsWith("#") ? (
                <a
                  key={to}
                  href={to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted py-2 hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted py-2 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              )
            )}
            <hr className="border-border-ui my-2" />
            {isAuthenticated ? (
              <div className="py-2"><UserMenu /></div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-center border border-primary text-primary px-4 py-2 rounded-pill hover:bg-primary/10 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}