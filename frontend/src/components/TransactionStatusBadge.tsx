import type { TransactionStatus } from "../types/transactions";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  paid: "bg-primary/15 text-primary",
  pending: "bg-tertiary/15 text-tertiary",
  failed: "bg-danger/15 text-danger",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}