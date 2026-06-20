import { pgTable, serial, text, integer, decimal, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { harvesters } from "./harvesters";

export const biomassBatches = pgTable("biomass_batches", {
    id: serial("id").primaryKey(),
    harvesterId: integer("harvester_id").references(() => harvesters.id).notNull(),
    weightKg: decimal("weight_kg").notNull(),
    locationCoordinates: text("location_coordinates"),
    status: text("status").default("available").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    pgPolicy("Allow public read access to batches", {
        for: "select",
        to: "anon",
        using: sql`true`,
    })
]);