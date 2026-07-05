import { ImpactHero } from "../components/ImpactHero";
import { MetricCard } from "../components/MetricCard";
import { MethaneTrendCard } from "../components/MethaneTrendCard";
import { SocialImpactCard } from "../components/SocialImpactCard";
import { ProjectHealthMonitor } from "../components/ProjectHealthMonitor";
import { KeyMilestones } from "../components/KeyMilestones";
import { AppSideNav } from "../components/AppSideNav";
import {
  MOCK_IMPACT_METRICS,
  MOCK_BIOGAS_TREND,
  MOCK_SOCIAL_IMPACT_METRIC,
  MOCK_MILESTONES,
  MOCK_AUDIT_PROGRESS_PERCENT,
} from "../api/mockImpact";

function Impact() {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        <ImpactHero />

        {/* Row 1: metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {MOCK_IMPACT_METRICS.map((metric) => (
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
              totalValue="85,000 m³"
              barColor="#2DD4BF"
            />
          </div>
          <SocialImpactCard {...MOCK_SOCIAL_IMPACT_METRIC} />
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