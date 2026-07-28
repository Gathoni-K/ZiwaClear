import { pgTable, serial, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";

export const landingSites = pgTable("landing_sites", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    bmuLeaderPhone: varchar("bmu_leader_phone", { length: 20 }).notNull(),
    coveragePercentage: integer("coverage_percentage").notNull().default(0),
    dominantQualityGrade: varchar("dominant_quality_grade", { length: 20 }).notNull().default("STANDARD"),
    operationalStatus: varchar("operational_status", { length: 20 }).notNull().default("SAFE"),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
