import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Satellite, Zap, ChevronDown } from "lucide-react";
import { api } from "../api/config";
import { useLandingSites } from "../hooks/useLandingSites";
import { toast } from "./Toast";

const QUALITY_GRADES = ["PREMIUM", "STANDARD", "MUDDY"] as const;

export function SimulationPanel() {
  const { data: sites } = useLandingSites();
  const queryClient = useQueryClient();

  const [siteId, setSiteId] = useState<string>("");
  const [coverage, setCoverage] = useState(50);
  const [quality, setQuality] = useState<string>("STANDARD");
  const [isInjecting, setIsInjecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const siteList = Array.isArray(sites) ? sites : [];

  async function handleInject() {
    if (!siteId) {
      toast("Please select a landing site first.", "error");
      return;
    }

    setIsInjecting(true);
    try {
      const result = await api.batches.simulateCoverage(Number(siteId), coverage, quality);
      toast("Satellite data payload injected successfully!", "success");

      // Refresh landing sites data so the alert system reacts instantly
      queryClient.invalidateQueries({ queryKey: ["landing-sites"] });

      if (result.data?.smsAlertPayload) {
        console.log("SMS Alert triggered:", result.data.smsAlertPayload);
      }
    } catch (error) {
      toast("Failed to inject payload. Is the backend running?", "error");
    } finally {
      setIsInjecting(false);
    }
  }

  function coverageLabel(pct: number): string {
    if (pct <= 35) return "🟢 Safe";
    if (pct <= 60) return "🟡 Monitor";
    return "🔴 Alert";
  }

  return (
    <div className="fixed bottom-24 left-4 z-[1002]">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary text-background font-semibold text-xs px-4 py-2.5 rounded-pill shadow-lg hover:bg-primary-hover transition-colors"
      >
        <Satellite size={14} />
        Simulation Panel
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-3 w-[300px] rounded-tile bg-tile border border-border-ui shadow-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              Payload Injector
            </h3>
            <span className="text-[10px] text-muted uppercase tracking-widest">Simulation</span>
          </div>

          {/* Site selector */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted block mb-1.5">
              Landing Site
            </label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full bg-input border border-border-ui rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">-- Select a site --</option>
              {siteList.map((site: any) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.coveragePercentage}%)
                </option>
              ))}
            </select>
          </div>

          {/* Coverage slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted">
                Coverage %
              </label>
              <span className="text-xs font-bold text-primary">
                {coverage}% — {coverageLabel(coverage)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              className="w-full accent-primary h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>0%</span>
              <span className="text-yellow-400">35%</span>
              <span className="text-red-400">60%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quality selector */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted block mb-1.5">
              Quality Grade
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full bg-input border border-border-ui rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {QUALITY_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Inject button */}
          <button
            type="button"
            onClick={handleInject}
            disabled={isInjecting || !siteId}
            className="w-full py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Satellite size={14} />
            {isInjecting ? "Injecting..." : "Inject Satellite Data Payload"}
          </button>
        </div>
      )}
    </div>
  );
}