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
    <div className="rounded-tile bg-tile border border-border-ui p-4 md:p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon size={16} className="md:size-[18px]" />
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

      <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted mt-3 md:mt-4">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-bold text-primary mt-1">{value}</p>
      <p className="text-xs md:text-sm text-muted mt-2">{description}</p>
    </div>
  );
}