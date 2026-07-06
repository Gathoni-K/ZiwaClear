import { useQuery } from "@tanstack/react-query";
import { Waves, TreePine, Fish,} from "lucide-react";
import { ImpactHero } from "../components/ImpactHero";
import { MetricCard } from "../components/MetricCard";
import { MethaneTrendCard } from "../components/MethaneTrendCard";
import { SocialImpactCard } from "../components/SocialImpactCard";
import { ProjectHealthMonitor } from "../components/ProjectHealthMonitor";
import { KeyMilestones } from "../components/KeyMilestones";
import { AppSideNav } from "../components/AppSideNav";
import { api } from "../api/config";
import type { ImpactMetric } from "../types/impact";
import {
  MOCK_BIOGAS_TREND,
  MOCK_SOCIAL_IMPACT_METRIC,
  MOCK_MILESTONES,
  MOCK_AUDIT_PROGRESS_PERCENT,
} from "../api/mockImpact";

function Impact() {
  const { data: impact, isLoading } = useQuery({
    queryKey: ["impact"],
    queryFn: async () => {
      const res = await api.batches.getImpact();
      return res.data ?? res;
    },
    refetchInterval: 30_000,
  });

  const liveMetrics: ImpactMetric[] = impact
    ? [
        {
          id: "1",
          icon: Waves,
          label: "Surface Restored",
          value: `${impact.lakeAreaClearedM2?.toLocaleString() ?? "0"} m²`,
          description: "Lake area cleared of hyacinth",
          trend: "up",
        },
        {
          id: "2",
          icon: TreePine,
          label: "Carbon Offset",
          value: `${impact.co2eAvoidedTonnes?.toLocaleString() ?? "0"} tCO₂e`,
          description: "Methane emissions avoided",
          badge: "Certified",
        },
        {
          id: "3",
          icon: Fish,
          label: "Biomass Harvested",
          value: `${impact.totalTonnes?.toLocaleString() ?? "0"} tonnes`,
          description: "Total water hyacinth removed from the lake",
        },
      ]
    : [];

  // Methane card with live total
  const methaneTotal = impact
    ? `${(impact.co2eAvoidedTonnes * 1000).toLocaleString()} m³`
    : "0 m³";

  // Social impact with live jobs count
  const socialImpact: ImpactMetric = {
    ...MOCK_SOCIAL_IMPACT_METRIC,
    value: impact?.greenJobs?.toLocaleString() ?? MOCK_SOCIAL_IMPACT_METRIC.value,
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        <ImpactHero />

        {/* Row 1: metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-tile bg-tile border border-border-ui p-5 animate-pulse"
                >
                  <div className="h-10 w-10 bg-border-ui rounded-lg" />
                  <div className="h-4 w-1/2 bg-border-ui rounded mt-4" />
                  <div className="h-6 w-2/3 bg-border-ui rounded mt-1" />
                </div>
              ))
            : liveMetrics.map((metric) => (
                <MetricCard key={metric.id} {...metric} />
              ))}
        </div>

        {/* Row 2: methane trend + social impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="lg:col-span-2">
            <MethaneTrendCard
              title="Methane Avoided"
              subtitle="Climbing trend of biomethane captured from harvested hyacinth"
              data={MOCK_BIOGAS_TREND}
              totalLabel="Total Methane Avoided"
              totalValue={methaneTotal}
              barColor="#2DD4BF"
            />
          </div>
          <SocialImpactCard {...socialImpact} />
        </div>

        {/* Row 3: project health + milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="lg:col-span-2">
            <ProjectHealthMonitor />
          </div>
          <KeyMilestones
            milestones={MOCK_MILESTONES}
            auditProgressPercent={MOCK_AUDIT_PROGRESS_PERCENT}
          />
        </div>
      </div>
    </div>
  );
}

export default Impact;