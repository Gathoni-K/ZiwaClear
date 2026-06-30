import { Link } from "react-router-dom";
import { Waves, Mail, Phone } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Marketplace",
    links: ["Browse Batches", "Submit Yield", "Logistics"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Impact", "Contact"],
  },
];

export function LandingFooter() {
  return (
    <footer className="px-6 py-10 border-t border-border-ui">
      <h2 className="text-xl font-bold text-center">Questions? Reach out.</h2>
      <p className="text-sm text-muted text-center mt-1 max-w-xs mx-auto">
        Our team is ready to provide the technical documentation and
        partnership details you need.
      </p>

      <div className="flex flex-col items-center gap-2 mt-4 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <Mail size={14} /> hello@ziwaclear.com
        </span>
        <span className="flex items-center gap-2 text-muted">
          <Phone size={14} /> +254 700 123 456
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10 max-w-xs mx-auto">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-wide text-muted mb-2">
              {col.title}
            </p>
            <ul className="flex flex-col gap-1.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 mt-10 pt-6 border-t border-border-ui text-xs text-muted">
        <span className="flex items-center gap-2 font-bold text-primary text-sm">
          <Waves size={16} /> ZiwaClear
        </span>
        <span>© 2024 ZiwaClear. All rights reserved.</span>
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Investor Dashboard
        </Link>
      </div>
    </footer>
  );
}