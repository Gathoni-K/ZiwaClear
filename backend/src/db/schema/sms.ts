import { pgTable, text, boolean, timestamp, jsonb, integer, uuid, varchar, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { batches } from "./batches";
import { beaches } from "./beaches";

export const sms = pgTable("sms", {
    id: uuid("id").primaryKey().defaultRandom(),
    rawMessage: text("raw_message").notNull(),
    senderPhone: varchar("sender_phone", { length: 20 }).notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    parsedData: jsonb("parsed_data"),
    parsedSuccessfully: boolean("parsed_successfully").default(false).notNull(),
    parseError: text("parse_error"),
    batchId: uuid("batch_id").references(() => batches.id),
    beachId: integer("beach_id").references(() => beaches.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    pgPolicy("Allow public read access to SMS", {
        for: "select",
        to: "anon",
        using: sql`true`,
    }),
    pgPolicy("Allow authenticated insert", {
        for: "insert",
        to: "authenticated",
        withCheck: sql`true`,
    }),
]);