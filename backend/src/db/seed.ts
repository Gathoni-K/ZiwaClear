import { db } from "./index";
import { harvesters, batches } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
    const [mockHarvester] = await db.insert(harvesters).values({
        phoneNumber: "+254712345678",
        name: "John Omondi",
        location: "Dunga Beach",
    }).onConflictDoUpdate({
        target: harvesters.phoneNumber,
        set: { name: "John Omondi", location: "Dunga Beach" }
    }).returning();

    if (!mockHarvester) {
        throw new Error("Failed to create mock harvester for seeding.");
    }

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
        },
        {
            quantityKg: 90.3,
            locationName: "Usenge",
            latitude: -0.0512,
            longitude: 34.6012,
            harvesterPhone: mockHarvester.phoneNumber,
            harvesterName: mockHarvester.name,
            status: "available",
        },
        {
            quantityKg: 60.0,
            locationName: "Kendu Bay",
            latitude: -0.2831,
            longitude: 34.3412,
            harvesterPhone: mockHarvester.phoneNumber,
            harvesterName: mockHarvester.name,
            status: "collected",
        },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
