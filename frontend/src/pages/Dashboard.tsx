import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { useBatches } from "../hooks/useBatches";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const { data: batches } = useBatches(); // shares the same cached request

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

  function handleReserve(batch: { id: string }) {
    // TODO: once a real backend exists, call the reserve/claim endpoint here
    // before navigating, and show an error toast if it fails.
    console.log("Reserve clicked:", batch.id);
     console.log("BEFORE navigate, pathname:", window.location.pathname);
  navigate("/claimed-batches");
  console.log("AFTER navigate call, pathname:", window.location.pathname);
  }

  return (
    <div className="flex h-full">
      <Sidebar
        selectedBatchId={selectedBatchId}
        onSelectBatch={setSelectedBatchId}
      />
      <div className="flex-1 relative">
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