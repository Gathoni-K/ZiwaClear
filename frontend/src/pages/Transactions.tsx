import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { AppSideNav } from "../components/AppSideNav";
import { TransactionStatCard } from "../components/TransactionStatCard";
import { TransactionsFilterBar } from "../components/TransactionsFilterBar";
import { TransactionsTable } from "../components/TransactionsTable";
import { useBatches } from "../hooks/useBatches";
import { api } from "../api/config";
import type { Batch } from "../types/batch";
import type { Transaction, TransactionSummary } from "../types/transactions";



function batchToTransaction(b: Batch, pricePerKg: number): Transaction {
  return {
    id: b.id,
    batchCode: b.batchCode ?? b.id.slice(0, 8).toUpperCase(),
    date: b.collectedAt ?? b.updatedAt,
    type: "Biomass Collection",
    typeIcon: ArrowUpRight,
    assetClass: b.materialType ?? "Hyacinth Biomass",
    status: "paid" as const,
    amountUsd: b.quantityKg * (pricePerKg / 150), // KES to USD approx
  };
}

function exportCSV(transactions: Transaction[]) {
  const header = "Date,Batch ID,Type,Asset Class,Status,Amount (USD)\n";
  const rows = transactions
    .map(
      (t) =>
        `${t.date},${t.batchCode},${t.type},${t.assetClass},${t.status},${t.amountUsd.toFixed(2)}`
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ziwaclear-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Transactions() {
  const { data: batches, isLoading } = useBatches();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch live price
  const { data: priceData } = useQuery({
    queryKey: ["price"],
    queryFn: async () => {
      const res = await api.batches.getPrice();
      return res.data ?? res;
    },
    refetchInterval: 60_000,
  });

  const pricePerKg = priceData?.price_kes_per_kg ?? 9;

  const collected = useMemo(
    () => batches?.filter((b) => b.status === "collected") ?? [],
    [batches]
  );

  const claimed = useMemo(
    () => batches?.filter((b) => b.status === "claimed") ?? [],
    [batches]
  );

  const allTransactions: Transaction[] = useMemo(
    () => collected.map((b) => batchToTransaction(b, pricePerKg)),
    [collected, pricePerKg]
  );

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;
    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.batchCode.toLowerCase().includes(q) ||
          t.assetClass.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allTransactions, statusFilter, searchQuery]);

  const totalInvested = allTransactions.reduce((sum, t) => sum + t.amountUsd, 0);
  const pendingPayouts = claimed.reduce((sum, b) => sum + b.quantityKg * pricePerKg, 0);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTransactions.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return counts;
  }, [allTransactions]);

  const summary: TransactionSummary[] = [
    {
      label: "Total Invested",
      value: `KES ${(totalInvested * 150).toLocaleString()}`,
      subtext: `${allTransactions.length} transactions`,
      icon: Wallet,
      trend: "+12%",
    },
    {
      label: "Active Claims",
      value: `${claimed.length} batches`,
      subtext: `${claimed.reduce((s, b) => s + b.quantityKg, 0).toLocaleString()} kg pending`,
      icon: ArrowUpRight,
    },
    {
      label: "Pending Payouts",
      value: `KES ${pendingPayouts.toLocaleString()}`,
      subtext: `@ KES ${pricePerKg}/kg`,
      icon: ArrowDownLeft,
      trend: "",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <AppSideNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Wallet &amp; Transactions</h1>
            <p className="text-muted mt-1 text-sm md:text-base">
              Monitor your climate investments and track biomass acquisitions
              in real-time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => exportCSV(filteredTransactions)}
            className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-4 py-2.5 rounded-pill hover:bg-primary-hover transition-colors shrink-0 self-start"
          >
            <Download size={16} /> Export Ledger
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {summary.map((s) => (
            <TransactionStatCard key={s.label} {...s} />
          ))}
        </div>

        <TransactionsFilterBar
          onSearch={setSearchQuery}
          onStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
        />

        <TransactionsTable
          transactions={filteredTransactions}
          totalCount={filteredTransactions.length}
        />

        {!isLoading && allTransactions.length === 0 && (
          <p className="text-muted text-center py-8">
            No completed transactions yet. Claim and collect a batch to see it here.
          </p>
        )}

        {!isLoading && allTransactions.length > 0 && filteredTransactions.length === 0 && (
          <p className="text-muted text-center py-8">
            No transactions match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default Transactions;