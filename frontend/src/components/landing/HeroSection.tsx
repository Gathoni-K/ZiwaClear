import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";


const heroImg = '/src/assets/heroImg.webp';

export function HeroSection() {
  return (
    <section className="px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
      {/* Left: text */}
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Restoring Lake Victoria
        </span>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Turning an Ecological{" "}
          <span className="text-primary">Crisis</span>
          <br />
          into Climate{" "}
          <span className="text-primary">Value.</span>
        </h1>

        <p className="text-muted mt-5 max-w-sm leading-relaxed">
          ZiwaClear is a high-fidelity marketplace connecting biomass
          harvesters with industrial buyers, transforming invasive water
          hyacinth into sustainable biogas and fertilizer.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-5 py-3 rounded-pill hover:bg-primary-hover transition-colors"
          >
            Access Marketplace <ArrowRight size={16} />
          </Link>
          <a
            href="#crisis"
            className="text-sm font-semibold px-5 py-3 rounded-pill border border-border-ui hover:bg-input transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Right: image + floating badge */}
      <div className="relative">
        <div className="rounded-2xl overflow-hidden border border-border-ui bg-[#0A2A38] min-h-[320px] flex items-center justify-center">
          {
              <img src={heroImg} alt="Lake Victoria" className="w-full h-full object-cover" />
          }
          <div className="w-full h-[320px] bg-gradient-to-br from-[#0B3D4C] via-[#082030] to-[#020617] flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 opacity-60">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-primary/60 animate-ping"
                  style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2s" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Impact Tracker badge */}
        <div className="absolute bottom-4 right-4 bg-tile/95 backdrop-blur border border-border-ui rounded-xl px-4 py-3 shadow-lg">
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Impact Tracker
          </p>
          <p className="text-2xl font-bold text-primary">420 Tons</p>
          <p className="text-xs text-muted">Biomass Harvested This Month</p>
        </div>
      </div>
    </section>
  );
}