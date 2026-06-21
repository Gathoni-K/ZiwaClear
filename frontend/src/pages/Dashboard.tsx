import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";

function Dashboard() {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

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
      </div>
    </div>
  );
}

export default Dashboard;