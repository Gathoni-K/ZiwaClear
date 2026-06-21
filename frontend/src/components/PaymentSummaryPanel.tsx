import { Smartphone, ChevronRight, ShieldCheck } from "lucide-react";
import type { PaymentSummary } from "../types/logistics";

interface PaymentSummaryPanelProps {
  summary: PaymentSummary;
  onCompleteTransaction?: () => void;
}

export function PaymentSummaryPanel({
  summary,
  onCompleteTransaction,
}: PaymentSummaryPanelProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5">
      <h3 className="font-bold mb-3">Payment Summary</h3>

      <div className="flex flex-col gap-2">
        {summary.lineItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted">{item.label}</span>
            <span>KES {item.amountKes.toLocaleString()}.00</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-ui">
        <span className="font-bold">Total Amount</span>
        <span className="text-2xl font-bold text-primary">
          KES {summary.totalKes.toLocaleString()}.00
        </span>
      </div>

      <button
        type="button"
        className="w-full mt-4 flex items-center justify-between rounded-input bg-[#0F9D58]/10 border border-[#0F9D58]/30 px-4 py-3 hover:bg-[#0F9D58]/15 transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-md bg-[#0F9D58] text-white flex items-center justify-center">
            <Smartphone size={18} />
          </span>
          <span className="text-left">
            <span className="block text-[10px] uppercase tracking-wide text-muted">
              Pay via Paybill
            </span>
            <span className="block font-bold">{summary.mpesaPaybill}</span>
            <span className="block text-[10px] text-muted">
              Account: {summary.mpesaAccount}
            </span>
          </span>
        </span>
        <ChevronRight size={18} className="text-muted" />
      </button>

      <button
        type="button"
        onClick={onCompleteTransaction}
        className="w-full mt-3 py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
      >
        Complete Transaction
      </button>

      <p className="flex items-center gap-1 justify-center text-xs text-muted mt-3 text-center">
        <ShieldCheck size={14} />
        Secured by ZiwaClear Escrow. Funds released upon collection
        verification.
      </p>
    </div>
  );
}