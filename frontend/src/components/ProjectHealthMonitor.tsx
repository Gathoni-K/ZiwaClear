import { RefreshCw, MoreVertical } from "lucide-react";

export function ProjectHealthMonitor() {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold">Project Health Monitor</h3>
          <p className="text-sm text-muted">
            Active monitoring of Winam Gulf operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Refresh"
            className="w-8 h-8 rounded-md bg-input border border-border-ui flex items-center justify-center hover:bg-border-ui/50 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="w-8 h-8 rounded-md bg-input border border-border-ui flex items-center justify-center hover:bg-border-ui/50 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      <div className="relative mt-4 h-48 rounded-input bg-input border border-border-ui overflow-hidden">
        <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-primary bg-background/80 px-2 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Harvester Alpha: Live
        </span>

        {/* Live position indicator — swap for a real Leaflet map later */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </span>
      </div>
    </div>
  );
}