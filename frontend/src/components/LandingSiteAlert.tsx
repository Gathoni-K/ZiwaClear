import { AlertTriangle } from "lucide-react";

interface LandingSiteAlertProps {
  siteName: string;
  coveragePercentage: number;
}

function coverageColor(pct: number): { label: string; bg: string; text: string } {
  if (pct <= 35) return { label: "Safe", bg: "bg-green-500/10 border-green-500/30", text: "text-green-400" };
  if (pct <= 60) return { label: "Monitor", bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" };
  return { label: "Alert", bg: "bg-red-500/10 border-red-500/30", text: "text-red-400" };
}

export function LandingSiteAlert({
  siteName,
  coveragePercentage,
}: LandingSiteAlertProps) {
  const { label, bg, text } = coverageColor(coveragePercentage);

  if (coveragePercentage <= 60) return null; // only show for red alert

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${bg} mx-4 mt-3`}>
      <AlertTriangle size={16} className={`${text} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-xs font-bold ${text}`}>Action Required</p>
        <p className="text-xs text-muted mt-0.5">
          BMU Optimization Alert Dispatched to{" "}
          <span className="font-semibold text-foreground">{siteName}</span>.
        </p>
      </div>
    </div>
  );
}