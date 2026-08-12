import { useEffect, useState } from "react";
import { X, MapPin, Clock, Star, Zap, Leaf, Droplets, Loader2 } from "lucide-react";
import type { Batch } from "../types/batch";
import { timeAgo } from "../lib/timeAgo";
import { api } from "../api/config";

interface YieldPredictions {
  biogasM3: number;
  co2eKg: number;
  surfaceAreaM2: number;
  fertilizerKgN: number;
}

interface BatchDetailPanelProps {
  batch: Batch;
  onClose: () => void;
  onReserve: (batchId: string) => void;
}

export function BatchDetailPanel({ batch, onClose, onReserve }: BatchDetailPanelProps) {
  const [yields, setYields] = useState<YieldPredictions | null>(null);
  const [loadingYields, setLoadingYields] = useState(true);

  useEffect(() => {
    let active = true;

    // Reset to loading state asynchronously to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (!active) return;
      setYields(null);
      setLoadingYields(true);
    });

    api.batches.getById(batch.id)
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
  }, [batch.id]);

  return (
    <div className="absolute top-2 right-2 md:top-4 md:right-4 w-[calc(100%-16px)] max-w-[320px] rounded-tile bg-tile border border-border-ui shadow-lg p-4 md:p-5 z-[1000]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-base md:text-lg truncate mr-2">{batch.locationName}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close batch details"
          className="text-muted hover:text-foreground transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main quantity */}
      <p className="text-xl md:text-2xl font-bold text-primary mt-2">
        {batch.quantityKg.toLocaleString()} kg
      </p>

      {/* Metadata */}
      <div className="flex flex-col gap-2 mt-3 text-xs md:text-sm text-muted">
        {batch.latitude != null && batch.longitude != null && (
          <span className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{batch.latitude.toFixed(4)}, {batch.longitude.toFixed(4)}</span>
          </span>
        )}
        <span className="flex items-center gap-2">
          <Clock size={14} />
          Posted {timeAgo(batch.collectedAt ?? batch.createdAt)}
        </span>
        {batch.qualityRating != null && (
          <span className="flex items-center gap-2">
            <Star size={14} />
            {batch.qualityRating}/5 Certified
          </span>
        )}
      </div>

      {/* Yield Predictions */}
      <div className="mt-4 border-t border-border-ui pt-4">
        <p className="text-[10px] uppercase tracking-widest text-muted mb-3">
          Estimated Yield
        </p>

        {loadingYields ? (
          <div className="flex items-center gap-2 text-xs text-muted">
            <Loader2 size={14} className="animate-spin" />
            Calculating yields...
          </div>
        ) : yields ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-2 text-center">
              <Zap size={14} className="text-primary mb-1" />
              <p className="text-sm font-bold text-primary">{yields.biogasM3.toFixed(1)}</p>
              <p className="text-[10px] text-muted leading-tight">m³ Biogas</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-emerald-500/10 rounded-lg p-2 text-center">
              <Leaf size={14} className="text-emerald-400 mb-1" />
              <p className="text-sm font-bold text-emerald-400">{yields.co2eKg.toFixed(0)}</p>
              <p className="text-[10px] text-muted leading-tight">kg CO₂e</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-sky-500/10 rounded-lg p-2 text-center">
              <Droplets size={14} className="text-sky-400 mb-1" />
              <p className="text-sm font-bold text-sky-400">{yields.surfaceAreaM2.toFixed(0)}</p>
              <p className="text-[10px] text-muted leading-tight">m² Restored</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted">Yield data unavailable.</p>
        )}
      </div>

      {/* Reserve button */}
      <button
        type="button"
        onClick={() => onReserve(batch.id)}
        className="w-full mt-4 py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
      >
        Reserve Batch
      </button>
    </div>
  );
}