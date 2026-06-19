import { pgTable, serial, text, boolean, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const smsLogs = pgTable("sms_logs", {
    id: serial("id").primaryKey(),
    senderPhone: text("sender_phone").notNull(),
    rawMessage: text("raw_message").notNull(),
    parsedSuccessfully: boolean("parsed_successfully").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    pgPolicy("Lock down sms logs completely", {
        for: "all",
        to: "anon",
        using: sql`false`,
    })
]);