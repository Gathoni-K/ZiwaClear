import { X, MapPin, Clock, Star } from "lucide-react";
import type { Batch } from "../types/batch";
import { timeAgo } from "../lib/timeAgo";

interface BatchDetailPanelProps {
  batch: Batch;
  onClose: () => void;
  onReserve?: (batch: Batch) => void;
}

export function BatchDetailPanel({
  batch,
  onClose,
  onReserve,
}: BatchDetailPanelProps) {
  return (
    <div className="absolute top-4 right-4 w-[300px] rounded-tile bg-tile border border-border-ui shadow-lg p-5 z-[1000]">
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-lg">{batch.locationName}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close batch details"
          className="text-muted hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-2xl font-bold text-primary mt-2">
        {batch.quantityKg.toLocaleString()} kg
      </p>

      <div className="flex flex-col gap-2 mt-3 text-sm text-muted">
        <span className="flex items-center gap-2">
          <MapPin size={14} /> {batch.latitude?.toFixed(4) ?? "—"},{" "}
          {batch.longitude?.toFixed(4) ?? "—"}
        </span>
        <span className="flex items-center gap-2">
          <Clock size={14} /> Posted {timeAgo(batch.createdAt)}
        </span>
        <span className="flex items-center gap-2">
          <Star size={14} /> {batch.qualityRating ?? "—"}/5 Certified
        </span>
      </div>

      <button
        type="button"
        onClick={() => onReserve?.(batch)}
        className="w-full mt-4 py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
      >
        Reserve Batch
      </button>
    </div>
  );
}