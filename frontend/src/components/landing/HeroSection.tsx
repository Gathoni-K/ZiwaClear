import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "../../assets/heroImg.webp";

export function HeroSection() {
  return (
    <section className="px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
      
      <div>
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
        <div className="rounded-2xl overflow-hidden border border-border-ui bg-[#0A2A38] min-h-[320px]">
          <img src={heroImg} alt="Lake Victoria" className="w-full h-full object-cover" />
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