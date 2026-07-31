import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { landingSiteMonitoring } from "../db/schema/landingSiteMonitoring";

export type CoverageTrend = "rising_fast" | "rising_slow" | "flat" | "falling";

export class CoverageTrendService {
    public async getTrend(siteId: number | string): Promise<CoverageTrend> {
        const readings = await db.select()
            .from(landingSiteMonitoring)
            .where(eq(landingSiteMonitoring.siteId, siteId.toString()))
            .orderBy(desc(landingSiteMonitoring.recordedAt))
            .limit(3);

        if (readings.length < 2) {
            return "flat";
        }

        const newest = readings[0];
        const oldest = readings[readings.length - 1];

        if (!newest || !oldest) {
            return "flat";
        }

        const timeDiffMs = newest.recordedAt.getTime() - oldest.recordedAt.getTime();
        const daysDiff = timeDiffMs / (1000 * 60 * 60 * 24);

        if (daysDiff === 0) {
            return "flat"; // To avoid division by zero
        }

        const coverageDiff = newest.coveragePercentage - oldest.coveragePercentage;
        const ratePerDay = coverageDiff / daysDiff;

        if (ratePerDay > 5) return "rising_fast";
        if (ratePerDay >= 1) return "rising_slow";
        if (ratePerDay > -1) return "flat";
        return "falling";
    }

    public async recordCoverage(siteId: number | string, coveragePercentage: number, dominantQualityGrade: string) {
        await db.insert(landingSiteMonitoring).values({
            siteId: siteId.toString(),
            coveragePercentage,
            dominantQualityGrade,
            recordedAt: new Date()
        });
    }
}

export const coverageTrendService = new CoverageTrendService();
