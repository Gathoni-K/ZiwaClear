import { pgTable, uuid, text, real, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { batches } from "./batches";
import { buyers } from "./buyers";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batches.id).notNull(),
  buyerId: uuid("buyer_id").references(() => buyers.id).notNull(),
  payoutAmount: real("payout_amount").notNull(),
  mpesaReceiptNumber: text("mpesa_receipt_number"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  pgPolicy("Lock down transaction financials", {
    for: "all",
    to: "anon",
    using: sql`false`,
  }),
]);