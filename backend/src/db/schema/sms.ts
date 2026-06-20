import { pgTable, text, boolean, timestamp, jsonb, integer, decimal, uuid, varchar } from "drizzle-orm/pg-core";
import { batches } from "./batches";
import { beaches } from "./beaches";

export const sms = pgTable("sms", {
    id: uuid("id").primaryKey().defaultRandom(),
    rawMessage: text("raw_message").notNull(),
    senderPhone: varchar("sender_phone", { length: 20 }).notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    parsedData: jsonb("parsed_data"),
    parsedSuccessfully: boolean("parsed_successfully").default(false).notNull(),
    parseAttempts: integer("parse_attempts").default(0).notNull(),
    parseError: text("parse_error"),
    batchId: uuid("batch_id").references(() => batches.id),
    beachId: integer("beach_id").references(() => beaches.id),
    processed: boolean("processed").default(false).notNull(),
    confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
