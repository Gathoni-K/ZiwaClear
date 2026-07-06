import { MetricCard } from "../components/MetricCard";
import { MethaneTrendCard } from "../components/MethaneTrendCard";
import { BiogasCard } from "../components/BiogasCard";
import { SocialImpactCard } from "../components/SocialImpactCard";
import {
  MOCK_IMPACT_METRICS,
  MOCK_BIOGAS_METRIC,
  MOCK_BIOGAS_TREND,
  MOCK_SOCIAL_IMPACT_METRIC,
} from "../api/mockImpact";

export default function PublicImpact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-8 py-20 text-center border-b border-border-ui">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-primary/10">
            Measurable Change
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Our{" "}
            <span className="text-primary">Impact</span>
          </h1>
          <p className="text-muted mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            Every kilogram of water hyacinth removed from Lake Victoria means
            cleaner water, restored fisheries, avoided methane emissions, and
            green jobs for local communities. Here's what we've achieved so far.
          </p>
        </div>
      </section>

      {/* Metric cards */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MOCK_IMPACT_METRICS.map((metric) => (
            <MetricCard key={metric.id} {...metric} />
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section className="px-8 py-16 bg-tile/20 border-t border-border-ui">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      </section>

      {/* Biogas chart */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <BiogasCard {...MOCK_BIOGAS_METRIC} trendData={MOCK_BIOGAS_TREND} />
      </section>

      {/* Bottom CTA */}
      <section className="px-8 py-16 border-t border-border-ui text-center">
        <p className="text-muted text-sm">
          All metrics calculated using peer-reviewed conversion factors.{' '}
          <span className="text-primary font-medium">Carbon-credit ready.</span>
        </p>
      </section>
    </div>
  );
}