import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { useBatches } from "../hooks/useBatches";
import { API_BASE_URL } from "../api/config";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const { data: batches } = useBatches();

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

  async function handleReserve(batch: { id: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/${batch.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId: "00000000-0000-0000-0000-000000000001" })
      });

      if (!response.ok) {
        throw new Error("Failed to reserve batch");
      }

      navigate("/claimed-batches");
    } catch (error) {
      alert("Could not reserve the batch. Please try again.");
    }
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

