import type { RouteSuggestion } from "../types/logistics";

interface RouteSuggestionPanelProps {
  route: RouteSuggestion;
}

export function RouteSuggestionPanel({ route }: RouteSuggestionPanelProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Route Suggestion</h3>
        {route.optimized && (
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
            Optimized
          </span>
        )}
      </div>

      {/* Map placeholder */}
      <div className="h-32 rounded-input bg-input border border-border-ui mt-3 flex items-center justify-center">
        <span className="text-xs text-muted">Map preview</span>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-muted">Total Route Distance</span>
        <span className="font-bold">{route.totalDistanceKm} km</span>
      </div>

      <ol className="mt-4 flex flex-col gap-3">
        {route.stops.map((stop, index) => (
          <li key={stop.label} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-background text-xs font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <span className="text-sm">{stop.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}