import { pgTable, text, integer, timestamp, uuid, varchar, real, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { beaches } from "./beaches";

export const batches = pgTable("batches", {
    id: uuid("id").primaryKey().defaultRandom(),
    quantityKg: real("quantity_kg").notNull(),
    locationName: varchar("location_name", { length: 255 }).notNull(),
    beachId: integer("beach_id").references(() => beaches.id),
    latitude: real("latitude"),
    longitude: real("longitude"),
    status: text("status", { enum: ["available", "claimed", "collected", "flagged"] }).default("available").notNull(),
    harvesterPhone: varchar("harvester_phone", { length: 20 }).notNull(),
    harvesterName: varchar("harvester_name", { length: 255 }),
    buyerId: uuid("buyer_id"),
    qualityRating: integer("quality_rating"),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    collectedAt: timestamp("collected_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    pgPolicy("Allow public read access to available batches", {
        for: "select",
        to: "anon",
        using: sql`true`,
    }),
    pgPolicy("Allow authenticated insert", {
        for: "insert",
        to: "authenticated",
        withCheck: sql`true`,
    }),
    pgPolicy("Allow authenticated update", {
        for: "update",
        to: "authenticated",
        using: sql`true`,
    }),
]);