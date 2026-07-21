import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { BeachDetailSidebar } from "../components/BeachDetailSidebar";
import { useBatches } from "../hooks/useBatches";
import { useClaimBatch } from "../hooks/useClaimBatch";
import { useActiveBeach } from "../context/ActiveBeachContext";
import { useLandingSites } from "../hooks/useLandingSites";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: batches } = useBatches();
  const { data: sites } = useLandingSites();
  const claimMutation = useClaimBatch();
  const { setActiveBeach } = useActiveBeach();

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

 
  const alertSites = Array.isArray(sites)
    ? sites.filter((s: any) => s.coveragePercentage > 60)
    : [];

  function handleSelectBatch(id: string) {
    setSelectedBatchId(id);
    const batch = batches?.find((b) => b.id === id) ?? null;
    setActiveBeach(batch);
  }

  function handleReserve(batchId: string) {
    setSelectedBatchId(null);
    setActiveBeach(null);
    claimMutation.mutate(batchId);
    navigate("/dashboard/claimed-batches");
  }

  return (
    <div className="flex flex-col lg:flex-row h-full relative">
      
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-3 left-3 z-[1001] bg-tile border border-border-ui rounded-lg px-3 py-1.5 text-xs font-medium text-muted"
      >
        {sidebarOpen ? "Hide List" : "Show Batches"}
      </button>

     
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 fixed lg:relative z-[1000] lg:z-auto top-0 left-0 h-full lg:h-auto lg:w-[340px] lg:shrink-0`}
      >
        <Sidebar
          selectedBatchId={selectedBatchId}
          onSelectBatch={(id) => {
            handleSelectBatch(id);
            setSidebarOpen(false);
          }}
          onReserve={handleReserve}
          alertSites={alertSites}
        />
      </div>

     
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <DashboardMap
          selectedBatchId={selectedBatchId}
          onSelectBatch={handleSelectBatch}
        />

        {selectedBatch && (
          <BatchDetailPanel
            batch={selectedBatch}
            onClose={() => {
              setSelectedBatchId(null);
              setActiveBeach(null);
            }}
            onReserve={handleReserve}
          />
        )}
      </div>

      
      <BeachDetailSidebar />
    </div>
  );
}

export default Dashboard;