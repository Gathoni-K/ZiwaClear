import { db } from "./index";
import { harvesters, biomassBatches } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
    const [mockHarvester] = await db.insert(harvesters).values({
        phoneNumber: "+254712345678",
        name: "John Omondi",
        location: "Dunga Beach",
    }).onConflictDoUpdate({
        target: harvesters.phoneNumber,
        set: { name: "John Omondi", location: "Dunga Beach" }
    }).returning({ id: harvesters.id });

    if (!mockHarvester) {
        throw new Error("Failed to create mock harvester for seeding.");
    }

    await db.delete(biomassBatches).where(eq(biomassBatches.harvesterId, mockHarvester.id));

    await db.insert(biomassBatches).values([
        {
            harvesterId: mockHarvester.id,
            weightKg: "45.5",
            locationCoordinates: "-0.1432,34.7391",
            status: "available",
        },
        {
            harvesterId: mockHarvester.id,
            weightKg: "120.0",
            locationCoordinates: "-0.1032,34.7521",
            status: "available",
        },
        {
            harvesterId: mockHarvester.id,
            weightKg: "75.2",
            locationCoordinates: "-0.1194,34.7314",
            status: "claimed",
        },
        {
            harvesterId: mockHarvester.id,
            weightKg: "90.3",
            locationCoordinates: "-0.0512,34.6012",
            status: "available",
        },
        {
            harvesterId: mockHarvester.id,
            weightKg: "60.0",
            locationCoordinates: "-0.2831,34.3412",
            status: "paid",
        },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});