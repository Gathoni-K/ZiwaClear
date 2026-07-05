import { ShieldCheck, ArrowRight, Download } from "lucide-react";
import lakeHero from "../assets/lake-hero.jpg";

export function ImpactHero() {
  return (
    <div
      className="relative rounded-tile overflow-hidden p-6 md:p-8 min-h-[200px] md:min-h-[260px] flex flex-col justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${lakeHero})` }}
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold text-primary bg-primary/15 px-2 md:px-3 py-1 rounded-full">
          <ShieldCheck size={12} className="md:size-[14px]" /> Impact Verified 2024
        </span>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-3 md:mt-4">
          Our Impact on <span className="text-primary">Lake Victoria</span>
        </h1>

        <p className="text-white/80 mt-2 max-w-md text-sm md:text-base">
          Restoring ecosystems through precision-engineered water hyacinth
          harvesting and conversion technologies.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 mt-4 md:mt-5">
          <button
            type="button"
            className="flex items-center gap-2 bg-primary text-background font-semibold text-xs md:text-sm px-4 py-2.5 rounded-pill hover:bg-primary-hover transition-colors w-full sm:w-auto justify-center"
          >
            View Detailed Report <ArrowRight size={14} className="md:size-[16px]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-white/10 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-pill hover:bg-white/15 transition-colors border border-white/20 w-full sm:w-auto justify-center"
          >
            Download ESG Data <Download size={14} className="md:size-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
}