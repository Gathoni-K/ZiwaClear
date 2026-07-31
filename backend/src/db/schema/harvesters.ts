import { pgTable, uuid, text, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const harvesters = pgTable("harvesters", {
    id: uuid("id").primaryKey().defaultRandom(),
    phoneNumber: text("phone_number").notNull().unique(),
    name: text("name"),
    location: text("location"),
    status: text("status", { enum: ["pending", "verified"] }).default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    pgPolicy("Lock down harvester information", {
        for: "all",
        to: "anon",
        using: sql`false`,
    }),
]);