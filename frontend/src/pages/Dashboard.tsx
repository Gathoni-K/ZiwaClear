import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { useBatches } from "../hooks/useBatches";

function Dashboard() {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const { data: batches } = useBatches(); // shares the same cached request

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

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
            onReserve={(b) => console.log("Reserve clicked:", b.id)}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;