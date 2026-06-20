import { pgTable, serial, text, boolean, decimal } from "drizzle-orm/pg-core";

export const beaches = pgTable("beaches", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    county: text("county").notNull(),
    lake: text("lake").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    landmark: text("landmark"),
    landingSiteType: text("landing_site_type"),
    facilities: text("facilities").array(),
});
