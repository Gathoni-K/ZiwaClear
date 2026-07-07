import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { useBatches } from "../hooks/useBatches";
import { useClaimBatch } from "../hooks/useClaimBatch";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: batches } = useBatches();
  const claimMutation = useClaimBatch();

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

  function handleReserve(batchId: string) {
    // 1. Close the detail panel immediately
    setSelectedBatchId(null);
    // 2. Optimistic update the status to "claimed"
    claimMutation.mutate(batchId);
    // 3. Redirect to Claimed Batches page
    navigate("/dashboard/claimed-batches");
  }

  return (
    <div className="flex flex-col lg:flex-row h-full relative">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-3 left-3 z-[1001] bg-tile border border-border-ui rounded-lg px-3 py-1.5 text-xs font-medium text-muted"
      >
        {sidebarOpen ? "Hide List" : "Show Batches"}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 fixed lg:relative z-[1000] lg:z-auto top-0 left-0 h-full lg:h-auto lg:w-[340px] lg:shrink-0`}
      >
        <Sidebar
          selectedBatchId={selectedBatchId}
          onSelectBatch={(id) => {
            setSelectedBatchId(id);
            setSidebarOpen(false);
          }}
          onReserve={handleReserve}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative h-[60vh] lg:h-auto">
        <DashboardMap
          selectedBatchId={selectedBatchId}
          onSelectBatch={setSelectedBatchId}
        />

        {selectedBatch && (
          <BatchDetailPanel
            batch={selectedBatch}
            onClose={() => setSelectedBatchId(null)}
            onReserve={handleReserve}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;