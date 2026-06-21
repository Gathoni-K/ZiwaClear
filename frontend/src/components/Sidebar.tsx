import { useBatches } from "../hooks/useBatches";
import { timeAgo } from "../lib/timeAgo";

export function Sidebar() {
  const { data: batches, isLoading, isError } = useBatches();

  return (
    <aside className="w-[340px] h-full overflow-y-auto bg-tile border-r border-border-ui p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Available Biomass</h2>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
          LIVE
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-tile bg-input border border-border-ui p-4 animate-pulse"
            >
              <div className="h-4 w-1/2 bg-border-ui rounded mb-2" />
              <div className="h-3 w-2/3 bg-border-ui rounded mb-3" />
              <div className="h-8 w-full bg-border-ui rounded-pill" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Couldn't load batches. Showing mock data once the backend is live.
        </p>
      )}

      {batches && (
        <div className="flex flex-col gap-3 mt-2">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="rounded-tile bg-input border border-border-ui p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-primary">
                  {batch.weightKg.toLocaleString()} kg
                </span>
                <span className="text-xs text-muted">
                  {timeAgo(batch.collectedAt)}
                </span>
              </div>
              <p className="text-sm font-medium mt-1">{batch.locationName}</p>
              <p className="text-xs text-tertiary mt-1">
                ★ {batch.verificationRating}/5 Certified
              </p>
              <button
                type="button"
                className="w-full mt-3 py-2 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Reserve Batch
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}