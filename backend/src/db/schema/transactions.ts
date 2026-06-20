import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, decimal, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { biomassBatches } from "./biomassBatches";
import { buyers } from "./buyers";


export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").references(() => biomassBatches.id).notNull(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  payoutAmount: decimal("payout_amount").notNull(),
  mpesaReceiptNumber: text("mpesa_receipt_number"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  pgPolicy("Lock down transaction financials", {
    for: "all",
    to: "anon",
    using: sql`false`,
  })
]);