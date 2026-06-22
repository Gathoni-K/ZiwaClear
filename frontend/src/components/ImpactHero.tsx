import { ShieldCheck, ArrowRight, Download } from "lucide-react";
import lakeHero from "../assets/lake-hero.jpg"; 

export function ImpactHero() {
  return (
    <div
      className="relative rounded-tile overflow-hidden p-8 min-h-[260px] flex flex-col justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${lakeHero})` }}
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/15 px-3 py-1 rounded-full">
          <ShieldCheck size={14} /> Impact Verified 2024
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
          Our Impact on <span className="text-primary">Lake Victoria</span>
        </h1>

        <p className="text-white/80 mt-2 max-w-md">
          Restoring ecosystems through precision-engineered water hyacinth
          harvesting and conversion technologies.
        </p>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-4 py-2.5 rounded-pill hover:bg-primary-hover transition-colors"
          >
            View Detailed Report <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-2.5 rounded-pill hover:bg-white/15 transition-colors border border-white/20"
          >
            Download ESG Data <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}