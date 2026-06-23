import { useBatches } from "../hooks/useBatches";
import { ClaimedBatchCard } from "../components/ClaimedBatchCard";
import { RouteSuggestionPanel } from "../components/RouteSuggestionPanel";
import { PaymentSummaryPanel } from "../components/PaymentSummaryPanel";
import { AppSideNav } from "../components/AppSideNav";
import { MOCK_ROUTE, MOCK_PAYMENT_SUMMARY } from "../api/mockLogistics";
import { API_BASE_URL } from "../api/config";

function ClaimedBatches() {
  const { data: batches, isLoading, refetch } = useBatches() as any;
  const claimed = batches?.filter((b: any) => b.status === "claimed");

  async function handleConfirmCollection(batch: { id: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/${batch.id}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to confirm collection");
      }

      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Could not confirm collection. Please try again.");
    }
  }

  async function handleCompleteTransaction() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to complete transaction");
      }

      alert("Transaction completed successfully!");

      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Could not complete the transaction. Please try again.");
    }
  }

  return (
    <div className="flex h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold">Claimed Batches</h1>
        <p className="text-muted mt-1">
          Manage your active plastic collection commitments and logistics.
        </p>

        <div className="flex gap-6 mt-6 items-start">
          <div className="flex-1 flex flex-col gap-4">
            {isLoading && <p className="text-muted">Loading...</p>}

            {claimed && claimed.length === 0 && (
              <p className="text-muted">
                You haven't claimed any batches yet.
              </p>
            )}

            {claimed?.map((batch: any) => (
              <ClaimedBatchCard
                key={batch.id}
                batch={batch}
                onConfirmCollection={handleConfirmCollection}
              />
            ))}
          </div>

          <div className="w-[340px] flex flex-col gap-4 shrink-0">
            <RouteSuggestionPanel route={MOCK_ROUTE} />
            <PaymentSummaryPanel
              summary={MOCK_PAYMENT_SUMMARY}
              onCompleteTransaction={handleCompleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimedBatches;