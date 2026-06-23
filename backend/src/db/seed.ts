import { db } from "./index"; // Adjust if your db connection is elsewhere
import { beaches as beachesTable, buyers, harvesters, batches } from "./schema";
import { eq } from "drizzle-orm";

const DEMO_BUYER_ID = "00000000-0000-0000-0000-000000000001";

const beachData = [
    { name: "Dunga", county: "Kisumu", lake: "Lake Victoria", latitude: -0.1481, longitude: 34.7336, isActive: true },
    { name: "Usenge", county: "Siaya", lake: "Lake Victoria", latitude: -0.0631, longitude: 34.0322, isActive: true },
    { name: "Kendu Bay", county: "Homa Bay", lake: "Lake Victoria", latitude: -0.3667, longitude: 34.6500, isActive: true },
    { name: "Homa Bay", county: "Homa Bay", lake: "Lake Victoria", latitude: -0.5167, longitude: 34.4500, isActive: true },
    { name: "Muhuru Bay", county: "Migori", lake: "Lake Victoria", latitude: -0.7000, longitude: 34.0667, isActive: true },
];

const demoBatches = [
    { quantityKg: 250, locationName: "Dunga", latitude: -0.1481, longitude: 34.7336, harvesterPhone: "+254700000001" },
    { quantityKg: 500, locationName: "Usenge", latitude: -0.0631, longitude: 34.0322, harvesterPhone: "+254700000002" },
    { quantityKg: 150, locationName: "Kendu Bay", latitude: -0.3667, longitude: 34.6500, harvesterPhone: "+254700000003" },
];

async function seedAll() {
    try {
        console.log("Starting unified database seeding process...");

        console.log("Seeding beaches...");
        for (const beach of beachData) {
            await db.insert(beachesTable).values({
                name: beach.name,
                county: beach.county,
                lake: beach.lake,
                latitude: beach.latitude.toString(),
                longitude: beach.longitude.toString(),
                isActive: beach.isActive,
            }).onConflictDoNothing();
        }

        console.log("Seeding demo buyer...");
        await db.insert(buyers).values({
            id: DEMO_BUYER_ID,
            companyName: "Demo Biogas Ltd",
            contactEmail: "demo@biogas.co.ke",
        }).onConflictDoNothing();

        console.log("Seeding mock harvester...");
        const [mockHarvester] = await db.insert(harvesters).values({
            phoneNumber: "+254712345678",
            name: "John Omondi",
            location: "Dunga Beach",
        }).onConflictDoUpdate({
            target: harvesters.phoneNumber,
            set: { name: "John Omondi", location: "Dunga Beach" }
        }).returning();

        console.log("Seeding core demo batches...");
        for (const batch of demoBatches) {
            const [existing] = await db.select().from(batches).where(eq(batches.harvesterPhone, batch.harvesterPhone));
            if (!existing) {
                await db.insert(batches).values({
                    quantityKg: batch.quantityKg,
                    locationName: batch.locationName,
                    latitude: batch.latitude,
                    longitude: batch.longitude,
                    harvesterPhone: batch.harvesterPhone,
                    status: "available",
                });
            }
        }

        console.log("Seeding operational workflow batches...");
        if (mockHarvester) {
            await db.delete(batches).where(eq(batches.harvesterPhone, mockHarvester.phoneNumber));
            await db.insert(batches).values([
                {
                    quantityKg: 45.5,
                    locationName: "Dunga",
                    latitude: -0.1432,
                    longitude: 34.7391,
                    harvesterPhone: mockHarvester.phoneNumber,
                    harvesterName: mockHarvester.name,
                    status: "available",
                },
                {
                    quantityKg: 120.0,
                    locationName: "Dunga",
                    latitude: -0.1032,
                    longitude: 34.7521,
                    harvesterPhone: mockHarvester.phoneNumber,
                    harvesterName: mockHarvester.name,
                    status: "available",
                },
                {
                    quantityKg: 75.2,
                    locationName: "Dunga",
                    latitude: -0.1194,
                    longitude: 34.7314,
                    harvesterPhone: mockHarvester.phoneNumber,
                    harvesterName: mockHarvester.name,
                    status: "claimed",
                    buyerId: DEMO_BUYER_ID,
                }
            ]);
        }

        console.log("All seeding operations completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Global seed execution failed:", error);
        process.exit(1);
    }
}

seedAll();