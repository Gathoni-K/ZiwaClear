import { RefreshCw, MoreVertical } from "lucide-react";

export function ProjectHealthMonitor() {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-sm md:text-base">Project Health Monitor</h3>
          <p className="text-xs md:text-sm text-muted">
            Active monitoring of Winam Gulf operations
          </p>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            aria-label="Refresh"
            className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-input border border-border-ui flex items-center justify-center hover:bg-border-ui/50 transition-colors"
          >
            <RefreshCw size={12} className="md:size-14" />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-input border border-border-ui flex items-center justify-center hover:bg-border-ui/50 transition-colors"
          >
            <MoreVertical size={12} className="md:size-14" />
          </button>
        </div>
      </div>

      <div className="relative mt-4 h-36 md:h-48 rounded-input bg-input border border-border-ui overflow-hidden">
        <span className="absolute top-2 md:top-3 left-2 md:left-3 flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-primary bg-background/80 px-2 py-1 rounded-full">
          <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-primary" />
          </span>
          Harvester Alpha: Live
        </span>

        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="relative flex h-2 w-2 md:h-3 md:w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-primary" />
          </span>
        </span>
      </div>
    </div>
  );
}