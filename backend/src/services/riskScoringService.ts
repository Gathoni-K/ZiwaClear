import { CoverageTrend } from "./coverageTrendService";

export type RiskLevel = "normal" | "watch" | "warning" | "emergency";

export interface RiskScoringInputs {
    coverage: number;
    coverageTrend: CoverageTrend;
    tempAnomaly: number;
    rainfall: number;
}

export class RiskScoringService {
    public calculateRiskLevel({ coverage, coverageTrend, tempAnomaly, rainfall }: RiskScoringInputs): RiskLevel {
        if (coverage >= 80 || (coverage >= 60 && (tempAnomaly >= 1.5 || rainfall >= 20))) {
            return "emergency";
        }

        if (coverage >= 60 || (coverage >= 40 && rainfall >= 10) || (coverage >= 40 && coverageTrend === "rising_fast")) {
            return "warning";
        }

        if (coverage >= 35 || tempAnomaly >= 1.0 || coverageTrend === "rising_fast") {
            return "watch";
        }

        return "normal";
    }
}

export const riskScoringService = new RiskScoringService();
