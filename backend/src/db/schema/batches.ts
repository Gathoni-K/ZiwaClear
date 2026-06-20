import { pgTable, text, serial, integer, timestamp, jsonb, date, uuid, varchar } from "drizzle-orm/pg-core";
import { beaches } from "./beaches";

export const batches = pgTable("batches", {
    id: uuid("id").primaryKey().defaultRandom(),
    batchName: varchar("batch_name", { length: 255 }).notNull(),
    batchDate: date("batch_date").notNull(),
    beachId: integer("beach_id").references(() => beaches.id).notNull(),
    smsCount: integer("sms_count").default(0).notNull(),
    processedCount: integer("processed_count").default(0).notNull(),
    failedCount: integer("failed_count").default(0).notNull(),
    aggregatedData: jsonb("aggregated_data"),
    status: text("status", { enum: ["collecting", "processing", "completed", "failed"] }).default("collecting").notNull(),
    timeWindowStart: timestamp("time_window_start", { withTimezone: true }).notNull(),
    timeWindowEnd: timestamp("time_window_end", { withTimezone: true }).notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
