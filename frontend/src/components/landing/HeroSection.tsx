import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "../../assets/heroImg.webp";
import { useAuth } from "../../context/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
      {/* Left: text */}
      <div className="order-1">
         <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Turning an Ecological{" "}
          <span className="text-primary">Crisis</span>
          <br />
          into Climate{" "}
          <span className="text-primary">Value.</span>
        </h1>

        <p className="text-muted mt-4 md:mt-5 max-w-sm leading-relaxed text-sm md:text-base">
          ZiwaClear is a high-fidelity marketplace connecting biomass
          harvesters with industrial buyers, transforming invasive water
          hyacinth into sustainable biogas and fertilizer.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 md:mt-8">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-5 py-3 rounded-pill hover:bg-primary-hover transition-colors w-full sm:w-auto justify-center"
          >
            Access Marketplace <ArrowRight size={16} />
          </Link>
          <a
            href="#crisis"
            className="text-sm font-semibold px-5 py-3 rounded-pill border border-border-ui hover:bg-input transition-colors w-full sm:w-auto text-center"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Right: image + floating badge */}
      <div className="relative order-2">
        <div className="rounded-2xl overflow-hidden border border-border-ui bg-[#0A2A38] min-h-[220px] md:min-h-[320px]">
          <img src={heroImg} alt="Lake Victoria" className="w-full h-full object-cover" />
        </div>

        {/* Floating Impact Tracker badge */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-tile/95 backdrop-blur border border-border-ui rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg">
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Impact Tracker
          </p>
          <p className="text-lg md:text-2xl font-bold text-primary">420 Tons</p>
          <p className="text-[10px] md:text-xs text-muted">Biomass Harvested This Month</p>
        </div>
      </div>
    </section>
  );
}