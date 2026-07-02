import type { Batch } from "../types/batch";
import { timeAgo } from "../lib/timeAgo";

interface BatchCardProps {
  batch: Batch;
  actionLabel?: string;
  onAction?: (batch: Batch) => void;
  isSelected?: boolean;
  onSelect?: (batch: Batch) => void;
}

const STATUS_STYLES: Record<Batch["status"], string> = {
  available: "bg-primary/10 text-primary",
  claimed: "bg-secondary/10 text-secondary",
  collected: "bg-muted/10 text-muted",
  flagged: "bg-danger/10 text-danger",
};

const STATUS_LABELS: Record<Batch["status"], string> = {
  available: "Available",
  claimed: "Claimed",
  collected: "Collected",
  flagged: "Flagged",
};

export function BatchCard({
  batch,
  actionLabel,
  onAction,
  isSelected = false,
  onSelect,
}: BatchCardProps) {
  return (
    <div
      onClick={() => onSelect?.(batch)}
      className={`rounded-tile bg-input border p-4 transition-colors ${isSelected
        ? "border-primary ring-2 ring-primary/40"
        : "border-border-ui"
        } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-primary">
          {batch.quantityKg.toLocaleString()} kg
        </span>
        <span className="text-xs text-muted">
          {batch.collectedAt ? timeAgo(batch.collectedAt) : timeAgo(batch.createdAt)}
        </span>
      </div>
      <p className="text-sm font-medium mt-1">{batch.locationName}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-tertiary">
          {batch.qualityRating != null
            ? `★ ${batch.qualityRating}/5 Certified`
            : "Not yet rated"}
        </p>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[batch.status]}`}
        >
          {STATUS_LABELS[batch.status]}
        </span>
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAction?.(batch);
          }}
          className="w-full mt-3 py-2 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}