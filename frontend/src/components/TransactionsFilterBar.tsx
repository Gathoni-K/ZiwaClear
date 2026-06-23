import { Calendar, ChevronDown, Search } from "lucide-react";

export function TransactionsFilterBar() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <Calendar size={14} />
        Jan 1, 2024 – Mar 31, 2024
      </button>

      <button
        type="button"
        className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        All Statuses
        <ChevronDown size={14} />
      </button>

      <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2">
        <Search size={14} className="text-muted" />
        <input
          type="text"
          placeholder="Search by batch ID, recipient, or hash..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}