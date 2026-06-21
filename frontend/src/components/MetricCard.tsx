import type { ImpactMetric } from "../types/impact";

export function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  badge,
}: ImpactMetric) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon size={18} />
        </span>
        {trend && (
          <span className="text-xs font-semibold text-primary">↗ {trend}</span>
        )}
        {badge && (
          <span className="text-xs font-semibold text-secondary flex items-center gap-1">
            ✓ {badge}
          </span>
        )}
      </div>

      <p className="text-xs uppercase tracking-wide text-muted mt-4">
        {label}
      </p>
      <p className="text-3xl font-bold text-primary mt-1">{value}</p>
      <p className="text-sm text-muted mt-2">{description}</p>
    </div>
  );
}