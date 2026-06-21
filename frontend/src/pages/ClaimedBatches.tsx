import { useBatches } from "../hooks/useBatches";
import { ClaimedBatchCard } from "../components/ClaimedBatchCard";
import { RouteSuggestionPanel } from "../components/RouteSuggestionPanel";
import { PaymentSummaryPanel } from "../components/PaymentSummaryPanel";
import { AppSideNav } from "../components/AppSideNav";
import { MOCK_ROUTE, MOCK_PAYMENT_SUMMARY } from "../api/mockLogistics";

function ClaimedBatches() {
  const { data: batches, isLoading } = useBatches();
  const claimed = batches?.filter((b) => b.status === "claimed");

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

            {claimed?.map((batch) => (
              <ClaimedBatchCard
                key={batch.id}
                batch={batch}
                onConfirmCollection={(b) =>
                  console.log("Confirm collection:", b.id)
                }
              />
            ))}
          </div>

          <div className="w-[340px] flex flex-col gap-4 shrink-0">
            <RouteSuggestionPanel route={MOCK_ROUTE} />
            <PaymentSummaryPanel
              summary={MOCK_PAYMENT_SUMMARY}
              onCompleteTransaction={() =>
                console.log("Complete transaction clicked")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimedBatches;