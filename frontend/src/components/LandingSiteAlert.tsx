import { AlertTriangle } from "lucide-react";

export type RiskLevel = "normal" | "watch" | "warning" | "emergency";

interface LandingSiteAlertProps {
  siteName: string;
  coveragePercentage: number;
  riskLevel: RiskLevel;
}

const RISK_STYLES: Record<RiskLevel, { label: string; bg: string; text: string }> = {
  normal: { label: "Safe", bg: "bg-green-500/10 border-green-500/30", text: "text-green-400" },
  watch: { label: "Watch", bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" },
  warning: { label: "Warning", bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400" },
  emergency: { label: "Emergency", bg: "bg-red-500/10 border-red-500/30", text: "text-red-400" },
};

export function LandingSiteAlert({
  siteName,
  coveragePercentage,
  riskLevel,
}: LandingSiteAlertProps) {
  // Only surface watch tier and above — "normal" never renders a card here.
  if (riskLevel === "normal") return null;

  const { label, bg, text } = RISK_STYLES[riskLevel];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${bg} mx-4 mt-3`}>
      <AlertTriangle size={16} className={`${text} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-xs font-bold ${text}`}>{label} — {coveragePercentage}% coverage</p>
        <p className="text-xs text-muted mt-0.5">
          {riskLevel === "watch"
            ? <>Monitoring <span className="font-semibold text-foreground">{siteName}</span> for a rising bloom.</>
            : <>Alert dispatched to <span className="font-semibold text-foreground">{siteName}</span>'s BMU leader{riskLevel === "emergency" ? " and county health officer" : ""}.</>}
        </p>
      </div>
    </div>
  );
}