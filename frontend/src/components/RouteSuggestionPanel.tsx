import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { RouteSuggestion } from "../types/logistics";

// Default Kisumu coordinates for stops without real lat/lng
const DEFAULT_CENTER: [number, number] = [-0.0917, 34.768];

// Approximate coordinates for well-known Lake Victoria locations
const LOCATION_COORDS: Record<string, [number, number]> = {
  "dunga": [-0.1411, 34.7368],
  "kisumu": [-0.0917, 34.7680],
  "homa bay": [-0.5273, 34.4571],
  "usenge": [-0.0677, 34.0558],
  "kendu bay": [-0.3695, 34.6502],
  "mbita": [-0.4310, 34.2080],
  "winam": [-0.1000, 34.7500],
};

function guessCoords(label: string): [number, number] {
  const lower = label.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (lower.includes(key)) return coords;
  }
  // Spread stops around Kisumu if no match
  const randomOffset = () => (Math.random() - 0.5) * 0.5;
  return [
    DEFAULT_CENTER[0] + randomOffset(),
    DEFAULT_CENTER[1] + randomOffset(),
  ];
}

function FitBounds({ stops }: { stops: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length === 0) return;
    if (stops.length === 1) {
      map.setView(stops[0], 10);
    } else {
      const bounds = L.latLngBounds(stops.map((s) => L.latLng(s[0], s[1])));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, stops]);
  return null;
}

interface RouteSuggestionPanelProps {
  route: RouteSuggestion;
}

const STOP_ICON = L.divIcon({
  className: "",
  html: `<div style="width:8px;height:8px;background:#2DD4BF;border:1.5px solid white;border-radius:50%"></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

export function RouteSuggestionPanel({ route }: RouteSuggestionPanelProps) {
  const stopCoords: [number, number][] = route.stops.map((s) => guessCoords(s.label));
  const routeLine: [number, number][] = stopCoords.length > 1 ? stopCoords : [];

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

      {/* Real mini map */}
      <div className="h-32 rounded-input overflow-hidden border border-border-ui mt-3">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={8}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <FitBounds stops={stopCoords} />
          {stopCoords.map((pos, i) => (
            <Marker key={i} position={pos} icon={STOP_ICON} />
          ))}
          {routeLine.length > 1 && (
            <Polyline positions={routeLine} color="#2DD4BF" weight={2} opacity={0.7} />
          )}
        </MapContainer>
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