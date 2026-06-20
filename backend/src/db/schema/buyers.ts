import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, pgPolicy } from "drizzle-orm/pg-core";

export const buyers = pgTable("buyers", {
    id: serial("id").primaryKey(),
    companyName: text("company_name").notNull(),
    contactEmail: text("contact_email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    pgPolicy("Lock down buyers layer", {
        for: "all",
        to: "anon",
        using: sql`false`,
    })
]);