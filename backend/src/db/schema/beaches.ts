import { pgTable, serial, text, boolean, decimal, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const beaches = pgTable("beaches", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    county: text("county").notNull(),
    lake: text("lake").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
    pgPolicy("Allow public read access to beaches", {
        for: "select",
        to: "anon",
        using: sql`true`,
    }),
]);