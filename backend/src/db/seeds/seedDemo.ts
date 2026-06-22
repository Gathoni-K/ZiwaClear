import { db } from "../index";
import { buyers, batches } from "../schema";
import { eq } from "drizzle-orm";

const DEMO_BUYER_ID = "00000000-0000-0000-0000-000000000001";

const demoBatches = [
    {
        quantityKg: 250,
        locationName: "Dunga",
        latitude: -0.1481,
        longitude: 34.7336,
        harvesterPhone: "+254700000001",
    },
    {
        quantityKg: 500,
        locationName: "Usenge",
        latitude: -0.0631,
        longitude: 34.0322,
        harvesterPhone: "+254700000002",
    },
    {
        quantityKg: 150,
        locationName: "Kendu Bay",
        latitude: -0.3667,
        longitude: 34.6500,
        harvesterPhone: "+254700000003",
    },
];

export async function seedDemo() {
    console.log("Seeding demo data...");

    await db.insert(buyers).values({
        id: DEMO_BUYER_ID,
        companyName: "Demo Biogas Ltd",
        contactEmail: "demo@biogas.co.ke",
    }).onConflictDoNothing();

    for (const batch of demoBatches) {
        const [existing] = await db.select().from(batches).where(eq(batches.harvesterPhone, batch.harvesterPhone));
        if (existing) continue;

        await db.insert(batches).values({
            quantityKg: batch.quantityKg,
            locationName: batch.locationName,
            latitude: batch.latitude,
            longitude: batch.longitude,
            harvesterPhone: batch.harvesterPhone,
            status: "available",
        });
    }

    console.log("Demo data seeded successfully");
}

seedDemo()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Demo seed failed:", err);
        process.exit(1);
    });
