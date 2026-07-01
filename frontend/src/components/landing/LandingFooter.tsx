import { Waves, Mail, Phone, MapPin, Globe, Share2 } from "lucide-react";

const FOOTER_LINKS = {
  Marketplace: ["Harvesting Map", "Pricing Index", "Supply Tracking", "Logistics API"],
  Company: ["About ZiwaClear", "Climate Impact", "Press Kit", "Legal & Privacy"],
};

export function LandingFooter() {
  return (
    <footer>
      {/* Contact bar */}
      <div className="px-8 py-12 border-t border-border-ui text-center">
        <h2 className="text-2xl font-bold">Questions? Reach out.</h2>
        <p className="text-muted mt-2 max-w-lg mx-auto text-sm">
          Our team is ready to provide the technical documentation and
          marketplace details you need.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 mt-6 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Mail size={15} className="text-primary" />
            hello@ziwaclear.com
          </span>
          <span className="flex items-center gap-2">
            <Phone size={15} className="text-primary" />
            +254 (0) 700 123 456
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-primary" />
            Kisumu Hub, Kenya
          </span>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="border-t border-border-ui px-8 py-10 bg-tile/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <span className="flex items-center gap-2 font-bold text-primary">
              <img src="/logo.png" alt="ZiwaClear Logo" /> 
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
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
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
                  className="w-9 h-9 rounded-full border border-border-ui flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
            <div className="border border-border-ui rounded-input p-3 text-xs">
              <p className="text-muted uppercase tracking-widest text-[10px]">
                Powered by
              </p>
              <p className="font-bold text-primary mt-0.5">
                ✦ ZIWÀINSIGHT ENGINE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-ui px-8 py-4 flex items-center justify-between text-xs text-muted max-w-none">
        <span>© 2026 ZiwaClear Marketplace. All rights reserved.</span>
        <div className="flex gap-6">
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