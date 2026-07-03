import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { UserMenu } from "../UserMenu";
import { useAuth } from "../../context/AuthContext";

export function LandingNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
        <img src="/logo.png" alt="ZiwaClear Logo" className="rounded-full object-cover" width="36" height="36" />
        ZiwaClear
      </Link>

      {isDashboard ? (
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/dashboard/claimed-batches" className="hover:text-foreground transition-colors">
            Claimed Batches
          </Link>
          <Link to="/dashboard/transactions" className="hover:text-foreground transition-colors">
            Transactions
          </Link>
          <Link to="/dashboard/impact" className="hover:text-foreground transition-colors">
            Impact
          </Link>
        </nav>
      ) : (
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#crisis" className="hover:text-foreground transition-colors">
            The Crisis
          </a>
          <a href="#solution" className="hover:text-foreground transition-colors">
            Our Solution
          </a>
          <a href="#vision" className="hover:text-foreground transition-colors">
            Future Vision
          </a>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isAuthenticated ? (
          <UserMenu />
        ) : isDashboard ? (
          <Link
            to="/login"
            className="text-sm font-semibold border border-primary text-primary px-5 py-2 rounded-pill hover:bg-primary/10 transition-colors"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold border border-primary text-primary px-5 py-2 rounded-pill hover:bg-primary/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold bg-primary text-background px-5 py-2 rounded-pill hover:bg-primary-hover transition-colors"
            >
              Join Marketplace
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}