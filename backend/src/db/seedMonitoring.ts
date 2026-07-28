import { db } from "./index";
import { landingSiteMonitoring } from "./schema/landingSiteMonitoring";
import { landingSites } from "./schema/landingSites";

async function main() {
    try {
        await db.insert(landingSites).values([
            {
                name: "Dunga Beach",
                bmuLeaderPhone: "+254700000001",
                coveragePercentage: 78,
                dominantQualityGrade: "PREMIUM",
                operationalStatus: "RED_ALERT",
                latitude: "-0.1481",
                longitude: "34.7336"
            },
            {
                name: "Homa Bay",
                bmuLeaderPhone: "+254700000002",
                coveragePercentage: 42,
                dominantQualityGrade: "STANDARD",
                operationalStatus: "MONITOR",
                latitude: "-0.5167",
                longitude: "34.4500"
            },
            {
                name: "Mbita Point",
                bmuLeaderPhone: "+254700000003",
                coveragePercentage: 12,
                dominantQualityGrade: "MUDDY",
                operationalStatus: "SAFE",
                latitude: "-0.4333",
                longitude: "34.2000"
            },
            {
                name: "Kendu Bay",
                bmuLeaderPhone: "+254700000004",
                coveragePercentage: 65,
                dominantQualityGrade: "STANDARD",
                operationalStatus: "RED_ALERT",
                latitude: "-0.3667",
                longitude: "34.6500"
            }
        ]);

        await db.insert(landingSiteMonitoring).values([
            {
                siteId: "dunga-beach",
                coveragePercentage: 78,
                dominantQualityGrade: "PREMIUM",
                recordedAt: new Date()
            },
            {
                siteId: "homa-bay",
                coveragePercentage: 42,
                dominantQualityGrade: "STANDARD",
                recordedAt: new Date()
            },
            {
                siteId: "mbita-point",
                coveragePercentage: 12,
                dominantQualityGrade: "MUDDY",
                recordedAt: new Date()
            },
            {
                siteId: "kendu-bay",
                coveragePercentage: 65,
                dominantQualityGrade: "STANDARD",
                recordedAt: new Date()
            }
        ]);

        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

main();
