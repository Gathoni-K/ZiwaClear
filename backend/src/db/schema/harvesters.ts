import { pgTable, serial, text, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const harvesters = pgTable("harvesters", {
    id: serial("id").primaryKey(),
    phoneNumber: text("phone_number").notNull().unique(),
    name: text("name"),
    location: text("location"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    pgPolicy("Lock down harvester information", {
        for: "all",
        to: "anon",
        using: sql`false`,
    })
]);