import { Droplet, Zap, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImpactHero } from "../components/ImpactHero";
import { MetricCard } from "../components/MetricCard";
import { MethaneTrendCard } from "../components/MethaneTrendCard";
import { SocialImpactCard } from "../components/SocialImpactCard";
import { ProjectHealthMonitor } from "../components/ProjectHealthMonitor";
import { KeyMilestones } from "../components/KeyMilestones";
import { AppSideNav } from "../components/AppSideNav";
import { useImpactMetrics } from "../hooks/useImpactMetrics";
import type { ImpactMetric, ImpactCard } from "../types/impact";
import {
  MOCK_SOCIAL_IMPACT_METRIC,
  MOCK_MILESTONES,
  MOCK_AUDIT_PROGRESS_PERCENT,
} from "../api/mockImpact";

const CARD_ICON_MAP: Record<ImpactCard["id"], LucideIcon> = {
  "surface-restored": Droplet,
  "biogas-generated": Zap,
  "carbon-offset": Cloud,
};

function toImpactMetric(card: ImpactCard): ImpactMetric {
  return {
    id: card.id,
    icon: CARD_ICON_MAP[card.id],
    label: card.label,
    value: card.value,
    description: card.description,
  };
}

function Impact() {
  const { cards, trend, isLoading } = useImpactMetrics();

  const liveMetrics: ImpactMetric[] = cards.map(toImpactMetric);

  const biogasCard = cards.find((c) => c.id === "biogas-generated");
  const biogasTotalValue = biogasCard?.value ?? "—";

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        <ImpactHero />

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="lg:col-span-2">
            <MethaneTrendCard
              title="Biogas Generated"
              subtitle="Monthly biogas yield from claimed and collected hyacinth biomass"
              data={trend}
              totalLabel="Cumulative Biogas"
              totalValue={biogasTotalValue}
              barColor="#2DD4BF"
            />
          </div>
          <SocialImpactCard {...MOCK_SOCIAL_IMPACT_METRIC} />
        </div>

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