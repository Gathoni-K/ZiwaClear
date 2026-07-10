import { Link } from "react-router-dom";
import { Waves, Mail, Phone, MapPin, Globe, Share2 } from "lucide-react";

const FOOTER_LINKS: Record<string, { label: string; to: string }[]> = {
  Marketplace: [
    { label: "Harvesting Map", to: "/dashboard" },
    { label: "Pricing Index", to: "/dashboard" },
    { label: "Supply Tracking", to: "/dashboard/claimed-batches" },
    { label: "Logistics API", to: "/dashboard/transactions" },
  ],
  Company: [
    { label: "About ZiwaClear", to: "/about" },
    { label: "Climate Impact", to: "/dashboard/impact" },
    { label: "Legal & Privacy", to: "/privacy" },
  ],
};

export function LandingFooter() {
  return (
    <footer>
      {/* Contact bar */}
      <div className="px-4 md:px-8 py-10 md:py-12 border-t border-border-ui text-center">
        <h2 className="text-xl md:text-2xl font-bold">Questions? Reach out.</h2>
        <p className="text-muted mt-2 max-w-lg mx-auto text-xs md:text-sm">
          Our team is ready to provide the technical documentation and
          marketplace details you need.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Mail size={15} className="text-primary shrink-0" />
                        <a href="mailto:ziwaclear.ke@gmail.com" className="hover:text-primary transition-colors">
              ziwaclear.ke@gmail.com
            </a>
          </span>
          <span className="flex items-center gap-2">
            <Phone size={15} className="text-primary shrink-0" />
                        <a href="tel:+254768690493" className="hover:text-primary transition-colors">
              +254 (0) 76 869 0493
            </a>
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-primary shrink-0" />
            Kisumu Hub, Kenya
          </span>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="border-t border-border-ui px-4 md:px-8 py-8 md:py-10 bg-tile/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <span className="flex items-center gap-2 font-bold text-primary">
              <img src="/logo.png" alt="ZiwaClear Logo" className="w-8 h-8 rounded-full object-cover" />
              ZiwaClear
            </span>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              The premium marketplace for climate assets and biomass restoration
              in the Great Lakes region.
            </p>
          </div>

          {/* Marketplace + Company columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-bold mb-3">{title}</p>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    {to === "#" ? (
                      <span className="text-xs md:text-sm text-muted cursor-default">
                        {label}
                      </span>
                    ) : (
                      <Link
                        to={to}
                        className="text-xs md:text-sm text-muted hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect column */}
          <div>
            <p className="text-sm font-bold mb-3">Connect</p>
            <div className="flex gap-3 mb-4">
              {[Globe, Waves, Share2].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-border-ui flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <div className="border border-border-ui rounded-input p-2 md:p-3 text-xs">
              <p className="text-muted uppercase tracking-widest text-[10px]">
                Powered by
              </p>
              <p className="font-bold text-primary mt-0.5 text-xs">
                ✦ ZIWÀINSIGHT ENGINE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-ui px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted max-w-none">
        <span>© 2026 ZiwaClear Marketplace. All rights reserved.</span>
        <div className="flex gap-4 md:gap-6">
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Data Transparency Policy
          </a>
        </div>
      </div>
    </footer>
  );
}