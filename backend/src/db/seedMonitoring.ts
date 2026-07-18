import { db } from "./index";
import { landingSiteMonitoring } from "./schema/landingSiteMonitoring";

async function main() {
    try {
        console.log("Seeding landing site monitoring data...");

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

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
