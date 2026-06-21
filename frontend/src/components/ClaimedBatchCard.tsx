import { MapPin, Clock, Truck } from "lucide-react";
import type { Batch } from "../types/batch";
import { expiresIn } from "../lib/expiresIn";

interface ClaimedBatchCardProps {
  batch: Batch;
  onConfirmCollection?: (batch: Batch) => void;
}

export function ClaimedBatchCard({
  batch,
  onConfirmCollection,
}: ClaimedBatchCardProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono text-muted uppercase tracking-wide">
          Batch ID: {batch.batchCode ?? batch.id}
        </span>
        <div className="text-right">
          <span className="text-xl font-bold text-primary">
            {batch.weightKg.toLocaleString()} kg
          </span>
          {batch.materialType && (
            <p className="text-xs text-muted uppercase tracking-wide">
              {batch.materialType}
            </p>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold mt-2">{batch.locationName}</h3>

      <div className="flex items-center gap-4 mt-2 text-sm text-muted">
        {batch.region && (
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {batch.region}
          </span>
        )}
        {batch.expiresAt && (
          <span className="flex items-center gap-1">
            <Clock size={14} /> {expiresIn(batch.expiresAt)}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onConfirmCollection?.(batch)}
        className="w-full mt-4 py-2.5 rounded-pill bg-primary text-background font-semibold text-sm
                   flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
      >
        Confirm Collection <Truck size={16} />
      </button>
    </div>
  );
}