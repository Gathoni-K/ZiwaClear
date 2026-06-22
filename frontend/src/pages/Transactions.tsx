import { Download } from "lucide-react";
import { AppSideNav } from "../components/AppSideNav";
import { TransactionStatCard } from "../components/TransactionStatCard";
import { TransactionsFilterBar } from "../components/TransactionsFilterBar";
import { TransactionsTable } from "../components/TransactionsTable";
import {
  MOCK_TRANSACTION_SUMMARY,
  MOCK_TRANSACTIONS,
  MOCK_TOTAL_TRANSACTIONS,
} from "../api/mockTransactions";

function Transactions() {
  return (
    <div className="flex h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet &amp; Transactions</h1>
            <p className="text-muted mt-1">
              Monitor your climate investments and track biomass acquisitions
              in real-time.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-4 py-2.5 rounded-pill hover:bg-primary-hover transition-colors shrink-0"
          >
            <Download size={16} /> Export Ledger
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_TRANSACTION_SUMMARY.map((summary) => (
            <TransactionStatCard key={summary.label} {...summary} />
          ))}
        </div>

        <TransactionsFilterBar />

        <TransactionsTable
          transactions={MOCK_TRANSACTIONS}
          totalCount={MOCK_TOTAL_TRANSACTIONS}
        />
      </div>
    </div>
  );
}

export default Transactions;