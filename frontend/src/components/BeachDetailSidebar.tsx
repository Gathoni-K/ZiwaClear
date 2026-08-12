import { useEffect, useState } from "react";
import { X, MapPin, Clock, Star, User, Phone, Droplet, Zap, Leaf, Droplets, Loader2 } from "lucide-react";
import { useActiveBeach } from "../context/ActiveBeachContext";
import { timeAgo } from "../lib/timeAgo";
import { api } from "../api/config";

interface YieldPredictions {
  biogasM3: number;
  co2eKg: number;
  surfaceAreaM2: number;
  fertilizerKgN: number;
}

interface BeachDetailSidebarProps {
  onReserve?: (batchId: string) => void;
}

export function BeachDetailSidebar({ onReserve }: BeachDetailSidebarProps) {
  const { activeBeach, setActiveBeach } = useActiveBeach();
  const isOpen = activeBeach !== null;

  const [yields, setYields] = useState<YieldPredictions | null>(null);
  const [loadingYields, setLoadingYields] = useState(false);

  useEffect(() => {
    if (!activeBeach) {
      setYields(null);
      return;
    }

    let active = true;
    setYields(null);
    setLoadingYields(true);

    api.batches.getById(activeBeach.id)
      .then((res: unknown) => {
        if (!active) return;
        const data = res as { data?: { yieldPredictions?: unknown } };
        if (data?.data?.yieldPredictions) {
          setYields(data.data.yieldPredictions as YieldPredictions);
        }
      })
      .catch(() => {
        // fail silently — panel still usable without yield data
      })
      .finally(() => {
        if (active) setLoadingYields(false);
      });

    return () => { active = false; };
  }, [activeBeach?.id]);

  function handleReserve() {
    if (!activeBeach) return;
    if (onReserve) {
      onReserve(activeBeach.id);
    }
    setActiveBeach(null);
  }

  return (
    <>
      {/* Backdrop — closes panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1001] lg:hidden"
          onClick={() => setActiveBeach(null)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-tile border-l border-border-ui shadow-2xl z-[1002]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeBeach && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-ui">
              <h2 className="font-bold text-lg truncate">{activeBeach.locationName}</h2>
              <button
                type="button"
                onClick={() => setActiveBeach(null)}
                className="text-muted hover:text-foreground transition-colors shrink-0"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {/* Quantity */}
              <div className="text-center py-4 bg-input rounded-xl border border-border-ui">
                <p className="text-3xl font-bold text-primary">
                  {activeBeach.quantityKg.toLocaleString()} kg
                </p>
                <p className="text-xs text-muted mt-1">Available Biomass</p>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 text-sm">
                {activeBeach.latitude != null && activeBeach.longitude != null && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span className="text-muted">
                      {activeBeach.latitude.toFixed(4)}, {activeBeach.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary shrink-0" />
                  <span className="text-muted">
                    Posted {timeAgo(activeBeach.collectedAt ?? activeBeach.createdAt)}
                  </span>
                </div>
                {activeBeach.qualityRating != null && (
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.qualityRating}/5 Certified</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Droplet size={16} className="text-primary shrink-0" />
                  <span className="text-muted capitalize">{activeBeach.status}</span>
                </div>
                {activeBeach.harvesterName && (
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.harvesterName}</span>
                  </div>
                )}
                {activeBeach.harvesterPhone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.harvesterPhone}</span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-pill bg-input border border-border-ui w-fit">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeBeach.status === "available"
                      ? "bg-primary"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs font-medium capitalize">
                  {activeBeach.status === "claimed" ? "Dispatched" : activeBeach.status}
                </span>
              </div>

              {/* Yield Predictions */}
              <div className="border-t border-border-ui pt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-3">
                  Estimated Yield
                </p>

                {loadingYields ? (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Calculating yields...
                  </div>
                ) : yields ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 text-center">
                      <Zap size={14} className="text-primary mb-1" />
                      <p className="text-sm font-bold text-primary">{yields.biogasM3.toFixed(1)}</p>
                      <p className="text-[10px] text-muted leading-tight">m³ Biogas</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-emerald-500/10 rounded-lg p-3 text-center">
                      <Leaf size={14} className="text-emerald-400 mb-1" />
                      <p className="text-sm font-bold text-emerald-400">{yields.co2eKg.toFixed(0)}</p>
                      <p className="text-[10px] text-muted leading-tight">kg CO₂e</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-sky-500/10 rounded-lg p-3 text-center">
                      <Droplets size={14} className="text-sky-400 mb-1" />
                      <p className="text-sm font-bold text-sky-400">{yields.surfaceAreaM2.toFixed(0)}</p>
                      <p className="text-[10px] text-muted leading-tight">m² Restored</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-amber-500/10 rounded-lg p-3 text-center">
                      <Leaf size={14} className="text-amber-400 mb-1" />
                      <p className="text-sm font-bold text-amber-400">{yields.fertilizerKgN.toFixed(1)}</p>
                      <p className="text-[10px] text-muted leading-tight">kg N Fertilizer</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted">Yield data unavailable.</p>
                )}
              </div>
            </div>

            {/* Footer button */}
            <div className="px-5 py-4 border-t border-border-ui">
              <button
                type="button"
                onClick={handleReserve}
                className="w-full py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Reserve Batch
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}