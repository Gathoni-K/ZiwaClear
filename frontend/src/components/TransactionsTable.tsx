import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "../types/transactions";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatDate } from "../lib/formatDate";

interface TransactionsTableProps {
  transactions: Transaction[];
  totalCount: number;
}

export function TransactionsTable({
  transactions,
  totalCount,
}: TransactionsTableProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border-ui">
              <th className="px-5 py-3 font-medium">Date &amp; ID</th>
              <th className="px-5 py-3 font-medium">Transaction Type</th>
              <th className="px-5 py-3 font-medium">Asset Class</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">
                Amount (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const Icon = txn.typeIcon;
              return (
                <tr
                  key={txn.id}
                  className="border-b border-border-ui last:border-0 hover:bg-input/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold">{formatDate(txn.date)}</p>
                    <p className="text-xs text-muted">#{txn.batchCode}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2">
                      <Icon size={16} className="text-muted" />
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-secondary border border-secondary/30 bg-secondary/10 px-2 py-1 rounded-md">
                      {txn.assetClass}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <TransactionStatusBadge status={txn.status} />
                  </td>
                  <td className="px-5 py-4 text-right font-semibold">
                    $
                    {txn.amountUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border-ui text-sm text-muted">
        <span>
          Showing {transactions.length} of {totalCount} transactions
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-input transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === 1
                  ? "bg-primary text-background"
                  : "hover:bg-input"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-input transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}