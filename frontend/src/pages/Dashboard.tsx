import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Droplet, Zap, Cloud, Scale } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";
import { BatchDetailPanel } from "../components/BatchDetailPanel";
import { BeachDetailSidebar } from "../components/BeachDetailSidebar";
import { SimulationPanel } from "../components/SimulationPanel";
import { MetricCard } from "../components/MetricCard";
import { TransactionsTable } from "../components/TransactionsTable";
import { ProjectHealthMonitor } from "../components/ProjectHealthMonitor";
import { useBatches } from "../hooks/useBatches";
import { useClaimBatch } from "../hooks/useClaimBatch";
import { useActiveBeach } from "../context/ActiveBeachContext";
import { useLandingSites } from "../hooks/useLandingSites";
import { useImpactMetrics } from "../hooks/useImpactMetrics";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: batches } = useBatches();
  const { data: sites } = useLandingSites();
  const claimMutation = useClaimBatch();
  const { setActiveBeach } = useActiveBeach();
  const { rawCumulative, isLoading: metricsLoading } = useImpactMetrics();

  const selectedBatch = batches?.find((b) => b.id === selectedBatchId) ?? null;

  const alertSites = Array.isArray(sites)
    ? sites.filter((s) => s.riskLevel !== "normal")
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

  const impactCards = [
    {
      id: "active-mass",
      icon: Scale,
      label: "Total Active Mass",
      value: `${Math.round(rawCumulative.biogasGeneratedM3 / 0.0224).toLocaleString()} kg`,
      description: "Quality-adjusted viable organic matter",
    },
    {
      id: "biogas",
      icon: Zap,
      label: "Biogas Produced",
      value: `${Math.round(rawCumulative.biogasGeneratedM3).toLocaleString()} m³`,
      description: "Sustainable energy yield",
    },
    {
      id: "carbon",
      icon: Cloud,
      label: "CO₂ Avoided",
      value: `${Math.round(rawCumulative.co2eAvoidedKg).toLocaleString()} kg`,
      description: "Methane emissions diverted",
    },
    {
      id: "surface",
      icon: Droplet,
      label: "Restored Surface",
      value: `${Math.round(rawCumulative.surfaceRestoredM2).toLocaleString()} m²`,
      description: "Water area cleared",
    },
  ];

  const recentTransactions = useMemo(() => {
    const collected = batches?.filter((b) => b.status === "collected") ?? [];
    return collected.slice(0, 5).map((b) => ({
      id: b.id,
      batchCode: b.batchCode ?? b.id.slice(0, 8).toUpperCase(),
      date: b.collectedAt ?? b.updatedAt,
      type: "Biomass Collection",
      typeIcon: ArrowUpRight,
      assetClass: b.materialType ?? "Hyacinth Biomass",
      status: "paid" as const,
      amountUsd: b.quantityKg * (9 / 150),
    }));
  }, [batches]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col relative">
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-3 left-3 z-[1001] bg-tile border border-border-ui rounded-lg px-3 py-1.5 text-xs font-medium text-muted"
      >
        {sidebarOpen ? "Hide List" : "Show Batches"}
      </button>

      <div className="flex-1 flex flex-col lg:flex-row relative">
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

        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative h-[60vh] w-full shrink-0">
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

          <div className="flex flex-col gap-6 p-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metricsLoading
                ? [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-tile bg-tile border border-border-ui p-5 animate-pulse"
                    >
                      <div className="h-10 w-10 bg-border-ui rounded-lg" />
                      <div className="h-4 w-1/2 bg-border-ui rounded mt-4" />
                      <div className="h-6 w-2/3 bg-border-ui rounded mt-1" />
                    </div>
                  ))
                : impactCards.map((m) => <MetricCard key={m.id} {...m} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransactionsTable
                  transactions={recentTransactions}
                  totalCount={recentTransactions.length}
                />
              </div>
              <div>
                <ProjectHealthMonitor />
              </div>
            </div>

            <SimulationPanel />
          </div>
        </div>

        <BeachDetailSidebar />
      </div>
    </div>
  );
}

export default Dashboard;