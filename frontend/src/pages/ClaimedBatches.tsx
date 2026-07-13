import { useState, useMemo } from "react";
import { useBatches } from "../hooks/useBatches";
import { ClaimedBatchCard } from "../components/ClaimedBatchCard";
import { RouteSuggestionPanel } from "../components/RouteSuggestionPanel";
import { PaymentSummaryPanel } from "../components/PaymentSummaryPanel";
import { AppSideNav } from "../components/AppSideNav";
import { api } from "../api/config";
import type { RouteSuggestion, PaymentSummary } from "../types/logistics";
import { toast } from "../components/Toast";

function ClaimedBatches() {
  const [activeTab, setActiveTab] = useState<"claimed" | "collected">("claimed");
  const { data: batches, isLoading, refetch } = useBatches() as any;

  const claimed = batches?.filter((b: any) => b.status === "claimed");
  const collected = batches?.filter((b: any) => b.status === "collected");
  const displayed = activeTab === "claimed" ? claimed : collected;

  // Build route from claimed batch locations
  const route: RouteSuggestion = useMemo(() => {
    if (!claimed || claimed.length === 0) {
      return { totalDistanceKm: 0, optimized: false, stops: [] };
    }

    const stops = claimed.map((b: any) => ({

      label: `${b.locationName} — ${b.quantityKg.toLocaleString()} kg`,
    }));
    // Rough distance estimate: ~25km between stops on average around Lake Victoria
    const totalDistanceKm = Math.round(stops.length * 25);
    return { totalDistanceKm, optimized: true, stops };
  }, [claimed]);

  // Build payment summary from claimed batch quantities
  const paymentSummary: PaymentSummary = useMemo(() => {
    if (!claimed || claimed.length === 0) {
      return {
        lineItems: [],
        totalKes: 0,
        mpesaPaybill: "247247",
        mpesaAccount: "ZIWACLEAR01",
      };
    }
    const totalKg = claimed.reduce((sum: number, b: any) => sum + b.quantityKg, 0);
    const pricePerKg = 9; // KES from backend getPrice endpoint
    const batchFee = totalKg * pricePerKg;
    const transportFee = Math.round(claimed.length * 600); // ~KES 600 per stop transport
    const platformFee = Math.round(batchFee * 0.05); // 5% platform fee
    const total = batchFee + transportFee + platformFee;

    return {
      lineItems: [
        { label: `${claimed.length} batch(es) — ${totalKg.toLocaleString()} kg`, amountKes: batchFee },
        { label: "Transport & Logistics", amountKes: transportFee },
        { label: "Platform Fee (5%)", amountKes: platformFee },
      ],
      totalKes: total,
      mpesaPaybill: "247247",
      mpesaAccount: "ZIWACLEAR01",
    };
  }, [claimed]);

   async function handleConfirmCollection(batch: { id: string }) {
    try {
      await api.batches.collect(batch.id);
      toast("Collection confirmed!", "success");
      refetch?.();
    } catch (error) {
      toast("Could not confirm collection. Please try again.", "error");
    }
  }

  async function handleCompleteTransaction() {
    if (!claimed || claimed.length === 0) {
      toast("No batches to complete.", "info");
      return;
    }

    try {
      for (const batch of claimed) {
        await api.batches.collect(batch.id);
      }
      toast("All batches collected successfully!", "success");
      setActiveTab("collected");
      refetch?.();
    } catch (error) {
      toast("Could not complete all transactions. Please try again.", "error");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold">Claimed Batches</h1>
        <p className="text-muted mt-1 text-sm md:text-base">
          Manage your active plastic collection commitments and logistics.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-input rounded-pill p-1 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("claimed")}
            className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${activeTab === "claimed"
                ? "bg-primary text-background"
                : "text-muted hover:text-foreground"
              }`}
          >
            Claimed
            {claimed?.length > 0 && (
              <span className="ml-1.5 text-xs">({claimed.length})</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collected")}
            className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${activeTab === "collected"
                ? "bg-primary text-background"
                : "text-muted hover:text-foreground"
              }`}
          >
            Collected
            {collected?.length > 0 && (
              <span className="ml-1.5 text-xs">({collected.length})</span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mt-4 md:mt-6 items-start">
          {/* Batch cards */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            {isLoading && <p className="text-muted">Loading...</p>}

            {!isLoading && displayed && displayed.length === 0 && (
              <p className="text-muted">
                {activeTab === "claimed"
                  ? "You haven't claimed any batches yet."
                  : "No collected batches yet."}
              </p>
            )}

            {displayed?.map((batch: any) => (
              <ClaimedBatchCard
                key={batch.id}
                batch={batch}
                onConfirmCollection={
                  activeTab === "claimed" ? handleConfirmCollection : undefined
                }
              />
            ))}
          </div>

          {/* Route + Payment panels — only show for claimed tab */}
          {activeTab === "claimed" && (
            <div className="w-full lg:w-[340px] flex flex-col gap-4 shrink-0">
              <RouteSuggestionPanel route={route} />
              <PaymentSummaryPanel
                summary={paymentSummary}
                onCompleteTransaction={handleCompleteTransaction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimedBatches;