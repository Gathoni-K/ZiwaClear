import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ImpactMetric } from "../types/impact";
import type { BackendTrendPoint as BiogasTrendPoint } from "../types/impact";

interface BiogasCardProps extends ImpactMetric {
  trendData: BiogasTrendPoint[];
}

// Matches --color-primary in index.css. Recharts needs a concrete color
// value (CSS vars in SVG attributes aren't reliably supported everywhere).
const PRIMARY = "#2DD4BF";

export function BiogasCard({
  icon: Icon,
  label,
  value,
  description,
  trendData,
}: BiogasCardProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <span className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
          <Icon size={18} />
        </span>
        <p className="text-xs uppercase tracking-wide text-muted mt-4">
          {label}
        </p>
        <p className="text-3xl font-bold text-primary mt-1">{value}</p>
        <p className="text-sm text-muted mt-2">{description}</p>
      </div>

      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="biogasFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.4} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} />
            <Tooltip
              formatter={(val) => [`${Number(val).toLocaleString()} m³`, "Biogas"]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid var(--border-ui)",
              }}
            />
            <Area
              type="monotone"
              dataKey="biogasGeneratedM3"
              stroke={PRIMARY}
              strokeWidth={2}
              fill="url(#biogasFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}