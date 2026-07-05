import { useState } from "react";
import { Calendar, ChevronDown, Search, X } from "lucide-react";

interface TransactionsFilterBarProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: string | null) => void;
  statusCounts: Record<string, number>;
}

const STATUSES = ["All Statuses", "paid", "pending", "failed"];

export function TransactionsFilterBar({
  onSearch,
  onStatusFilter,
  statusCounts,
}: TransactionsFilterBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [statusOpen, setStatusOpen] = useState(false);

  function handleSearchChange(value: string) {
    setSearchValue(value);
    onSearch(value);
  }

  function handleStatusSelect(status: string) {
    setActiveStatus(status);
    setStatusOpen(false);
    onStatusFilter(status === "All Statuses" ? null : status);
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
      {/* Date range — shows current month */}
      <button
        type="button"
        className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <Calendar size={14} />
        <span className="hidden sm:inline">
          {new Date().toLocaleString("default", { month: "short", year: "numeric" })}
        </span>
        <span className="sm:hidden">This Month</span>
      </button>

      {/* Status dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setStatusOpen(!statusOpen)}
          className="flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2 text-sm text-muted hover:text-foreground transition-colors w-full sm:w-auto"
        >
          {activeStatus}
          {activeStatus !== "All Statuses" && (
            <span className="text-xs text-primary ml-1">
              ({statusCounts[activeStatus] ?? 0})
            </span>
          )}
          <ChevronDown size={14} />
        </button>

        {statusOpen && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-tile border border-border-ui rounded-xl shadow-lg z-50 py-1">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusSelect(status)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  activeStatus === status
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted hover:bg-input hover:text-foreground"
                }`}
              >
                {status}
                {status !== "All Statuses" && statusCounts[status] ? (
                  <span className="ml-2 text-xs opacity-60">
                    ({statusCounts[status]})
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 min-w-0 flex items-center gap-2 bg-input border border-border-ui rounded-input px-3 py-2">
        <Search size={14} className="text-muted shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by batch ID..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted min-w-0"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="text-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}