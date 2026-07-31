/**
 * ZiwaClear — Demo Scenario Seed
 * ================================
 * DEMO / SEED DATA ONLY. There is no funded pilot deployment; nothing in
 * this file represents real harvester, buyer, or BMU activity. It exists so
 * the submission demo can run the real detect -> predict -> alert -> act ->
 * acknowledge loop live against realistic-looking inputs instead of being
 * narrated over static slides.
 *
 * What this does, in order:
 *  1. Upserts the two pilot landing sites (Dunga, Usenge) using the same
 *     real coordinates already used for their `beaches` rows in db/seed.ts,
 *     now with BMU leader + county health officer + water officer contacts
 *     so every recipient tier in the alert pipeline has someone to notify.
 *  2. Inserts a short history of coverage readings per site so
 *     CoverageTrendService has real "rising_fast" / "falling" data to derive
 *     a trend from, rather than defaulting to "flat".
 *  3. Feeds a handful of realistic SMS samples (English, Swahili, and Sheng,
 *     using real local units — "gunia", "fuso") through the REAL
 *     smsService.processIncomingSMS pipeline, to prove the parser handles
 *     messy real input, not just clean English test strings.
 *  4. Runs ONE full scripted scenario end-to-end through the real services
 *     (landingSiteService.evaluateCoverage -> risk scoring -> alertService
 *     dispatch -> alertService.handleAcknowledgment) so the demo recording
 *     can show: a bloom detected, risk escalated to emergency, alerts fired
 *     to BMU leader + county health officer, a harvest response lowering
 *     coverage, and a BMU leader acknowledgment closing the loop.
 *
 * Run with: npx tsx src/db/seeds/seedDemoScenario.ts
 * Requires: DATABASE_URL set and `db/seed.ts` already run once so the
 * Dunga/Usenge `beaches` rows and a mock harvester exist (this script does
 * not duplicate that seeding — see db/seed.ts).
 *
 * Idempotency: landing sites are upserted by name (onConflictDoNothing +
 * a follow-up update), so re-running this script is safe.
 */
import { db } from "../index";
import { landingSites, landingSiteMonitoring } from "../schema";
import { eq } from "drizzle-orm";
import { smsService } from "../../services/smsService";
import { landingSiteService } from "../../services/landingSiteService";
import { alertService } from "../../services/alertService";

const PILOT_SITES = [
    {
        name: "Dunga",
        // Same coordinates as the "Dunga" beach in db/seed.ts.
        latitude: "-0.1481",
        longitude: "34.7336",
        bmuLeaderPhone: "+254700000001",
        countyHealthOfficerPhone: "+254700000101",
        waterOfficerPhone: "+254700000201",
        isBlockingWaterPoint: true, // Dunga's landing is adjacent to a community intake point.
        startingCoverage: 20,
    },
    {
        name: "Usenge",
        // Same coordinates as the "Usenge" beach in db/seed.ts.
        latitude: "-0.0631",
        longitude: "34.0322",
        bmuLeaderPhone: "+254700000002",
        countyHealthOfficerPhone: "+254700000102",
        waterOfficerPhone: null,
        isBlockingWaterPoint: false,
        startingCoverage: 42,
    },
];

// Realistic, messy field SMS — mixed English/Swahili/Sheng, local units.
// These exercise the real LLM-backed parser (services/sms/smsParser.ts) end
// to end. If OPEN_API_KEY / LLM_MODEL isn't configured in this environment,
// smsParser falls back to services/sms/parser/parserFallback.ts, which is
// itself real code (regex-based), not a stub — see that file.
const SAMPLE_SMS_MESSAGES: { text: string; from: string }[] = [
    { text: "Niko na 100kg Dunga", from: "+254711000001" }, // clean English/number baseline
    { text: "Tuko na magunia 5 kavu huko Usenge", from: "+254711000002" }, // Swahili, "gunia" unit
    { text: "Fuso moja imejaa, beach imeziba kabisa, Dunga", from: "+254711000003" }, // Sheng-inflected, "fuso" unit
    { text: "boti imejaa Dunga, imeziba njia ya wavuvi sana leo", from: "+254711000004" }, // Swahili, navigation blockage
    { text: "2 sacks dry hyacinth at Usenge, quality poa", from: "+254711000005" }, // English/Sheng mix ("poa")
];

async function upsertLandingSite(site: typeof PILOT_SITES[number]) {
    const [existing] = await db.select().from(landingSites).where(eq(landingSites.name, site.name));

    if (existing) {
        await db.update(landingSites).set({
            latitude: site.latitude,
            longitude: site.longitude,
            bmuLeaderPhone: site.bmuLeaderPhone,
            countyHealthOfficerPhone: site.countyHealthOfficerPhone,
            waterOfficerPhone: site.waterOfficerPhone,
            isBlockingWaterPoint: site.isBlockingWaterPoint,
        }).where(eq(landingSites.id, existing.id));
        return existing.id;
    }

    const [created] = await db.insert(landingSites).values({
        name: site.name,
        latitude: site.latitude,
        longitude: site.longitude,
        bmuLeaderPhone: site.bmuLeaderPhone,
        countyHealthOfficerPhone: site.countyHealthOfficerPhone,
        waterOfficerPhone: site.waterOfficerPhone,
        isBlockingWaterPoint: site.isBlockingWaterPoint,
        coveragePercentage: site.startingCoverage,
    }).returning();

    if (!created) throw new Error(`Failed to create landing site: ${site.name}`);
    return created.id;
}

async function seedCoverageHistory(siteId: number, readings: number[]) {
    // Spread readings across the last few days so CoverageTrendService's
    // days-since-last-reading math produces a real, non-"flat" rate.
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < readings.length; i++) {
        const coverage = readings[i];
        if (coverage === undefined) continue;
        const daysAgo = readings.length - 1 - i;
        await db.insert(landingSiteMonitoring).values({
            siteId: siteId.toString(),
            coveragePercentage: coverage,
            dominantQualityGrade: coverage > 60 ? "PREMIUM" : coverage > 35 ? "STANDARD" : "MUDDY",
            recordedAt: new Date(now - daysAgo * dayMs),
        });
    }
}

async function main() {
    console.log("=== ZiwaClear demo scenario seed (NOT production data) ===");

    console.log("\n[1/4] Upserting pilot landing sites (Dunga, Usenge)...");
    const siteIds: Record<string, number> = {};
    for (const site of PILOT_SITES) {
        const id = await upsertLandingSite(site);
        siteIds[site.name] = id;
        console.log(`  - ${site.name} -> id ${id}`);
    }

    console.log("\n[2/4] Seeding coverage history (crosses watch/warning/emergency boundaries)...");
    const dungaId = siteIds["Dunga"];
    const usengeId = siteIds["Usenge"];
    if (dungaId === undefined || usengeId === undefined) {
        throw new Error("Expected both Dunga and Usenge landing sites to be upserted above");
    }
    // Dunga: rising fast, walking straight through watch -> warning -> emergency.
    await seedCoverageHistory(dungaId, [20, 38, 65]);
    // Usenge: sits in the "watch" band, roughly flat.
    await seedCoverageHistory(usengeId, [40, 41, 42]);

    console.log("\n[3/4] Feeding realistic multilingual SMS samples through the real parser...");
    for (const sample of SAMPLE_SMS_MESSAGES) {
        try {
            const result = await smsService.processIncomingSMS(sample.text, sample.from);
            console.log(`  - "${sample.text}" -> parsed: ${result.success}, batch: ${result.batch?.id ?? "none"}`);
        } catch (err: any) {
            console.log(`  - "${sample.text}" -> skipped (${err.message})`);
        }
    }

    console.log("\n[4/4] Running the full Detect -> Predict -> Alert -> Act -> Acknowledge loop for Dunga...");
    console.log("  Detect+Predict: reporting a fresh 82% coverage reading at Dunga...");
    const detectResult = await landingSiteService.evaluateCoverage(dungaId, 82, "PREMIUM");
    console.log(`  -> riskLevel: ${detectResult.site.riskLevel}, alerts dispatched: ${detectResult.alerts.length}`);
    detectResult.alerts.forEach((a: any) => console.log(`     - ${a.recipientRole} (${a.recipientPhone}): "${a.message}"`));

    console.log("  Act: BMU leader dispatches harvesters, coverage drops to 30% on next reading...");
    const actResult = await landingSiteService.evaluateCoverage(dungaId, 30, "STANDARD");
    console.log(`  -> riskLevel now: ${actResult.site.riskLevel}`);

    console.log("  Acknowledge: BMU leader replies RECEIVED to the original emergency alert...");
    const dungaSite = PILOT_SITES[0];
    if (!dungaSite) throw new Error("Expected Dunga in PILOT_SITES");
    const ack = await alertService.handleAcknowledgment("RECEIVED", dungaSite.bmuLeaderPhone);
    console.log(`  -> matched: ${ack.matched}, alertId: ${ack.alertId ?? "n/a"}`);

    console.log("\nDone. This data is for the submission demo only — see README for the 'demo/seed data' notice.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Demo scenario seed failed:", err);
    process.exit(1);
});
