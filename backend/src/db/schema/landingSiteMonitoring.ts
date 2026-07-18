import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const landingSiteMonitoring = pgTable("landing_site_monitoring", {
    id: serial("id").primaryKey(),
    siteId: varchar("site_id", { length: 255 }).notNull(),
    coveragePercentage: integer("coverage_percentage").notNull(),
    dominantQualityGrade: varchar("dominant_quality_grade", { length: 50 }).notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull()
});
