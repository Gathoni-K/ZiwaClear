import { useBatches } from "../hooks/useBatches";
import { BatchCard } from "../components/BatchCard";

function ClaimedBatches() {
  const { data: batches, isLoading } = useBatches();

  const claimed = batches?.filter((b) => b.status === "claimed");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Claimed Batches</h1>

      {isLoading && <p className="text-muted">Loading...</p>}

      {claimed && claimed.length === 0 && (
        <p className="text-muted">You haven't claimed any batches yet.</p>
      )}

      <div className="flex flex-col gap-3 max-w-md">
        {claimed?.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>
    </div>
  );
}

export default ClaimedBatches;