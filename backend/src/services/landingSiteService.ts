import { eq } from "drizzle-orm";
import { db } from "../db";
import { landingSites } from "../db/schema";
import { smsClient } from "../utils/africasTalking";

export class LandingSiteService {
    public async evaluateCoverage(siteId: number, coveragePercentage: number, dominantQualityGrade: string) {
        let operationalStatus = "SAFE";
        let smsAlertPayload = null;

        if (coveragePercentage > 60) {
            operationalStatus = "RED_ALERT";
        } else if (coveragePercentage >= 35) {
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

            // Dispatch the alert to the BMU leader's phone via Africa's Talking.
            // Non-fatal: a send failure is logged but does not roll back the
            // coverage update that already succeeded.
            if (site.bmuLeaderPhone) {
                try {
                    await smsClient.send({
                        to: [site.bmuLeaderPhone],
                        message: smsAlertPayload,
                        from: process.env.AT_SHORTCODE || "5862",
                    });
                } catch (smsError) {
                    console.error("[LandingSiteService] Failed to send RED_ALERT SMS to BMU leader:", smsError);
                }
            }
        }

        return {
            site,
            smsAlertPayload
        };
    }
}

export const landingSiteService = new LandingSiteService();
