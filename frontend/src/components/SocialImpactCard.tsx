import type { ImpactMetric } from "../types/impact";

export function SocialImpactCard({
  icon: Icon,
  label,
  value,
  description,
}: ImpactMetric) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5 flex flex-col">
      <span className="w-10 h-10 rounded-lg bg-primary text-background flex items-center justify-center">
        <Icon size={18} />
      </span>
      <p className="text-xs uppercase tracking-wide text-primary font-semibold mt-4">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-sm text-muted mt-2">{description}</p>
    </div>
  );
}