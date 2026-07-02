import { Link } from "react-router-dom";

export function LandingNav() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
      <span className="flex items-center gap-2 font-bold text-lg text-primary">
        <img src="/logo.png" alt="ZiwaClear Logo" width="32" height="32" /> ZiwaClear
      </span>

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

      <Link
        to="/dashboard"
        className="text-sm font-semibold bg-primary text-background px-5 py-2 rounded-pill hover:bg-primary-hover transition-colors"
      >
        Join Marketplace
      </Link>
    </header>
  );
}