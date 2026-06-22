import { ImpactHero } from "../components/ImpactHero";
import { MetricCard } from "../components/MetricCard";
import { BiogasCard } from "../components/BiogasCard";
import { SocialImpactCard } from "../components/SocialImpactCard";
import { ProjectHealthMonitor } from "../components/ProjectHealthMonitor";
import { KeyMilestones } from "../components/KeyMilestones";
import { AppSideNav } from "../components/AppSideNav";
import {
  MOCK_IMPACT_METRICS,
  MOCK_BIOGAS_METRIC,
  MOCK_BIOGAS_TREND,
  MOCK_SOCIAL_IMPACT_METRIC,
  MOCK_MILESTONES,
  MOCK_AUDIT_PROGRESS_PERCENT,
} from "../api/mockImpact";

function Impact() {
  return (
    <div className="flex h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <ImpactHero />

        {/* Row 1: mappable metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_IMPACT_METRICS.map((metric) => (
            <MetricCard key={metric.id} {...metric} />
          ))}
        </div>

        {/* Row 2: biogas (wide) + social impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <BiogasCard {...MOCK_BIOGAS_METRIC} trendData={MOCK_BIOGAS_TREND} />
          </div>
          <SocialImpactCard {...MOCK_SOCIAL_IMPACT_METRIC} />
        </div>

        {/* Row 3: project health monitor (wide) + key milestones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
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