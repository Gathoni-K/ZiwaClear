import type { Batch } from "../types/batch";
import { timeAgo } from "../lib/timeAgo";

interface BatchCardProps {
  batch: Batch;
  /** Label for the action button**/
  actionLabel?: string;
  onAction?: (batch: Batch) => void;
  /** Whether this card is the currently selected batch (highlights it). */
  isSelected?: boolean;
  /** Called when the card itself (not the action button) is clicked. */
  onSelect?: (batch: Batch) => void;
}

const STATUS_STYLES: Record<Batch["status"], string> = {
  available: "bg-primary/10 text-primary",
  claimed: "bg-secondary/10 text-secondary",
  delivered: "bg-muted/10 text-muted",
};

const STATUS_LABELS: Record<Batch["status"], string> = {
  available: "Available",
  claimed: "Claimed",
  delivered: "Delivered",
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
      className={`rounded-tile bg-input border p-4 transition-colors ${
        isSelected
          ? "border-primary ring-2 ring-primary/40"
          : "border-border-ui"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-primary">
          {batch.weightKg.toLocaleString()} kg
        </span>
        <span className="text-xs text-muted">{timeAgo(batch.collectedAt)}</span>
      </div>

      <p className="text-sm font-medium mt-1">{batch.locationName}</p>

      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-tertiary">
          ★ {batch.verificationRating}/5 Certified
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
            e.stopPropagation(); // don't trigger card selection too
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