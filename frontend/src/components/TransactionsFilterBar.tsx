import { Calendar, ChevronDown, Search } from "lucide-react";

export function TransactionsFilterBar() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
      <button
        type="button"
        className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <Calendar size={14} />
        <span className="hidden sm:inline">Jan 1, 2024 – Mar 31, 2024</span>
        <span className="sm:hidden">Date Range</span>
      </button>

      <button
        type="button"
        className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        All Statuses
        <ChevronDown size={14} />
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2">
        <Search size={14} className="text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search by batch ID, recipient, or hash..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted min-w-0"
        />
      </div>
    </div>
  );
}