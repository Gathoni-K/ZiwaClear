import type { LucideIcon } from "lucide-react";

export type TransactionStatus = "paid" | "pending" | "failed";

export interface Transaction {
  id: string;
  batchCode: string;
  date: string; // ISO timestamp
  type: string; // e.g. "Bulk Biomass Purchase"
  typeIcon: LucideIcon;
  assetClass: string; // e.g. "BIO-CHAR GRADE A"
  status: TransactionStatus;
  amountUsd: number;
}

export interface TransactionSummary {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend?: string;
}