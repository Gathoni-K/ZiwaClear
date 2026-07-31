import { pgTable, serial, varchar, integer, timestamp, jsonb, text } from "drizzle-orm/pg-core";
import { landingSites } from "./landingSites";

// One row per (site, recipient) alert dispatch, so time-to-response can be
// measured per recipient rather than only per site. CAP-compatible in shape
// (event type, severity, area, timestamp, recommended action) without
// building full CAP/XML, per the brief.
export const alerts = pgTable("alerts", {
    id: serial("id").primaryKey(),
    siteId: integer("site_id").notNull().references(() => landingSites.id),

    eventType: varchar("event_type", { length: 40 }).notNull(), // e.g. "hyacinth_bloom"
    severity: varchar("severity", { length: 20 }).notNull(),    // watch | warning | emergency
    area: varchar("area", { length: 255 }).notNull(),           // site name at time of alert
    recommendedAction: text("recommended_action").notNull(),

    recipientRole: varchar("recipient_role", { length: 30 }).notNull(), // bmu_leader | county_health_officer | water_officer
    recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
    message: text("message").notNull(),

    // Full structured payload as sent/logged, kept for audit + future CAP/XML export.
    payload: jsonb("payload"),

    status: varchar("status", { length: 20 }).notNull().default("sent"), // sent | acknowledged | cleared
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});
