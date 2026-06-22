import { ShoppingCart, Gem, Building2, FileText, Leaf, Repeat } from "lucide-react";
import type { Transaction, TransactionSummary } from "../types/transactions";

export const MOCK_TRANSACTION_SUMMARY: TransactionSummary[] = [
  {
    label: "Total Capital Deployed",
    value: "$1,240,500.00",
    subtext: "+12.5% from last quarter",
    icon: FileText,
    trend: "+12.5%",
  },
  {
    label: "Biomass Purchased",
    value: "42,850 MT",
    subtext: "Verified Carbon Removal Credits",
    icon: Leaf,
  },
  {
    label: "Transactions",
    value: "186",
    subtext: "Completed in current cycle",
    icon: Repeat,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    batchCode: "ZM-89241-CX",
    date: "2024-03-12T00:00:00.000Z",
    type: "Bulk Biomass Purchase",
    typeIcon: ShoppingCart,
    assetClass: "BIO-CHAR GRADE A",
    status: "paid",
    amountUsd: 245000,
  },
  {
    id: "txn-002",
    batchCode: "ZM-89239-CX",
    date: "2024-03-10T00:00:00.000Z",
    type: "Batch Claiming Fee",
    typeIcon: Gem,
    assetClass: "SYSTEM SERVICE",
    status: "pending",
    amountUsd: 12450,
  },
  {
    id: "txn-003",
    batchCode: "ZM-89112-CX",
    date: "2024-03-05T00:00:00.000Z",
    type: "Institutional Rebalance",
    typeIcon: Building2,
    assetClass: "CREDIT OFFSET",
    status: "paid",
    amountUsd: 580000,
  },
  {
    id: "txn-004",
    batchCode: "ZM-88981-CX",
    date: "2024-02-28T00:00:00.000Z",
    type: "Bulk Biomass Purchase",
    typeIcon: ShoppingCart,
    assetClass: "AGRICULTURAL WASTE",
    status: "paid",
    amountUsd: 312000,
  },
];

export const MOCK_TOTAL_TRANSACTIONS = 186;