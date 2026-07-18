import { eq } from "drizzle-orm";
import { db } from "../db";
import { landingSites } from "../db/schema";

export class LandingSiteService {
    public async evaluateCoverage(siteId: number, coveragePercentage: number, dominantQualityGrade: string) {
        let operationalStatus = "SAFE";
        let smsAlertPayload = null;

        if (coveragePercentage > 60) {
            operationalStatus = "RED_ALERT";
        } else if (coveragePercentage > 35) {
            operationalStatus = "MONITOR";
        }

        const updatedSites = await db.update(landingSites)
            .set({
                coveragePercentage,
                dominantQualityGrade,
                operationalStatus,
                updatedAt: new Date()
            })
            .where(eq(landingSites.id, siteId))
            .returning();

        const site = updatedSites[0];
        
        if (!site) {
            throw new Error("Landing site not found");
        }

        if (operationalStatus === "RED_ALERT") {
            smsAlertPayload = `ZiwaClear Alert: High-density hyacinth bloom detected at ${site.name} (${coveragePercentage}% coverage). Direct your youth harvesters to this zone today to maximize yield and lock in ${dominantQualityGrade} Payout Rates. Reply with BATCH to log harvests.`;
        }

        return {
            site,
            smsAlertPayload
        };
    }
}

export const landingSiteService = new LandingSiteService();
