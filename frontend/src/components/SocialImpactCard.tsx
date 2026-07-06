import type { ImpactMetric } from "../types/impact";

export function SocialImpactCard({
  icon: Icon,
  label,
  value,
  description,
}: ImpactMetric) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-4 md:p-5 flex flex-col">
      <span className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary text-background flex items-center justify-center">
        <Icon size={16} className="md:size-[18px]" />
      </span>
      <p className="text-[10px] md:text-xs uppercase tracking-wide text-primary font-semibold mt-3 md:mt-4">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs md:text-sm text-muted mt-2">{description}</p>
    </div>
  );
}