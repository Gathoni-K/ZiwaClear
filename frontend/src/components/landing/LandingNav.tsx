import { Link } from "react-router-dom";
import { Waves } from "lucide-react";

export function LandingNav() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-ui">
      <span className="flex items-center gap-2 font-bold text-lg text-primary">
        <Waves size={20} /> ZiwaClear
      </span>
      <Link
        to="/dashboard"
        className="text-sm font-semibold bg-primary text-background px-4 py-2 rounded-pill hover:bg-primary-hover transition-colors"
      >
        Investor Dashboard
      </Link>
    </header>
  );
}