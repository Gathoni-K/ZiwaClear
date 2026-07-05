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
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full text-xs md:text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-[10px] md:text-xs uppercase tracking-wide text-muted border-b border-border-ui">
              <th className="px-3 md:px-5 py-3 font-medium">Date &amp; ID</th>
              <th className="px-3 md:px-5 py-3 font-medium hidden sm:table-cell">Type</th>
              <th className="px-3 md:px-5 py-3 font-medium">Asset</th>
              <th className="px-3 md:px-5 py-3 font-medium">Status</th>
              <th className="px-3 md:px-5 py-3 font-medium text-right">
                Amount
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
                  <td className="px-3 md:px-5 py-3 md:py-4">
                    <p className="font-semibold">{formatDate(txn.date)}</p>
                    <p className="text-[10px] md:text-xs text-muted">#{txn.batchCode}</p>
                  </td>
                  <td className="px-3 md:px-5 py-3 md:py-4 hidden sm:table-cell">
                    <span className="flex items-center gap-1 md:gap-2">
                      <Icon size={14} className="text-muted" />
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-3 md:px-5 py-3 md:py-4">
                    <span className="text-[10px] md:text-xs font-semibold text-secondary border border-secondary/30 bg-secondary/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
                      {txn.assetClass}
                    </span>
                  </td>
                  <td className="px-3 md:px-5 py-3 md:py-4">
                    <TransactionStatusBadge status={txn.status} />
                  </td>
                  <td className="px-3 md:px-5 py-3 md:py-4 text-right font-semibold">
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

      {/* Pagination — only show when there are multiple pages */}
      {totalCount > 10 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 md:px-5 py-3 border-t border-border-ui text-xs md:text-sm text-muted">
          <span>
            Showing {transactions.length} of {totalCount} transactions
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              className="w-7 h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center hover:bg-input transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`w-7 h-7 md:w-8 md:h-8 rounded-md text-xs md:text-sm font-medium transition-colors ${
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
              className="w-7 h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center hover:bg-input transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}