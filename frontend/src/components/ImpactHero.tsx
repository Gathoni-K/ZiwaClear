import { useState } from "react";
import { ShieldCheck, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import lakeHero from "../assets/lake-hero.jpg";
import { api } from "../api/config";

export function ImpactHero() {
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  async function handleViewReport() {
    try {
      const res = await api.batches.getImpact();
      // Open impact data in a new tab as formatted JSON
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<pre>${JSON.stringify(res, null, 2)}</pre>`);
      }
    } catch {
      alert("Could not load report. Please try again.");
    }
  }

  async function handleDownloadESG() {
    setDownloading(true);
    setDownloadDone(false);

    try {
      const impact = await api.batches.getImpact();
      const csv = [
        "Metric,Value,Unit",
        `Total Batches,${impact.data?.totalBatches ?? "N/A"},count`,
        `Total Quantity,${impact.data?.totalQuantityKg ?? "N/A"},kg`,
        `Methane Avoided,${impact.data?.methaneAvoided ?? "N/A"},tCO₂e`,
        `Lake Area Restored,${impact.data?.lakeAreaRestored ?? "N/A"},m²`,
        `Green Jobs,${impact.data?.greenJobs ?? "N/A"},jobs`,
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ziwaclear-esg-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    } catch {
      alert("Could not download ESG data. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

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
            onClick={handleViewReport}
            className="flex items-center gap-2 bg-primary text-background font-semibold text-xs md:text-sm px-4 py-2.5 rounded-pill hover:bg-primary-hover transition-colors w-full sm:w-auto justify-center"
          >
            View Detailed Report <ArrowRight size={14} className="md:size-[16px]" />
          </button>
          <button
            type="button"
            onClick={handleDownloadESG}
            disabled={downloading}
            className="flex items-center gap-2 bg-white/10 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-pill hover:bg-white/15 transition-colors border border-white/20 w-full sm:w-auto justify-center disabled:opacity-60"
          >
            {downloadDone ? (
              <>
                <CheckCircle2 size={14} className="md:size-[16px]" /> Downloaded
              </>
            ) : downloading ? (
              "Downloading..."
            ) : (
              <>
                Download ESG Data <Download size={14} className="md:size-[16px]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}