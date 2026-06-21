import { useBatches } from "../hooks/useBatches";
import { BatchCard } from "./BatchCard";

interface SidebarProps {
  selectedBatchId: string | null;
  onSelectBatch: (id: string) => void;
}

export function Sidebar({ selectedBatchId, onSelectBatch }: SidebarProps) {
  const { data: batches, isLoading, isError } = useBatches();
  const availableBatches = batches?.filter((b) => b.status === "available");

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

      {availableBatches && availableBatches.length === 0 && (
        <p className="text-sm text-muted">No available batches right now.</p>
      )}

      {availableBatches && availableBatches.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          {availableBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              actionLabel="Reserve Batch"
              onAction={(b) => console.log("Reserve clicked:", b.id)}
              isSelected={batch.id === selectedBatchId}
              onSelect={(b) => onSelectBatch(b.id)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}