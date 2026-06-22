import { db } from "../index";
import { beaches as beachesTable } from "../schema/beaches";
import { beaches } from "./beaches";

export async function seedBeaches() {
    console.log("Seeding beaches...");
    for (const beach of beaches) {
        await db.insert(beachesTable).values({
            name: beach.name,
            county: beach.county,
            lake: beach.lake,
            latitude: beach.latitude.toString(),
            longitude: beach.longitude.toString(),
            isActive: beach.isActive,
        }).onConflictDoNothing();
    }
}

// Run directly
seedBeaches()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    });