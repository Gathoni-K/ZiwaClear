import type { TransactionSummary } from "../types/transactions";

export function TransactionStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}: TransactionSummary) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <Icon size={16} className="text-primary" />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p
        className={`text-xs mt-1 ${
          trend ? "text-primary font-semibold" : "text-muted"
        }`}
      >
        {trend && "↗ "}
        {subtext}
      </p>
    </div>
  );
}