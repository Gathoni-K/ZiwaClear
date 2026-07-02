import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "../lib/leafletIconFix";
import { useBatches } from "../hooks/useBatches";
import { timeAgo } from "../lib/timeAgo";


const KISUMU_CENTER: [number, number] = [-0.0917, 34.768];
const DEFAULT_ZOOM = 9;

interface DashboardMapProps {
  selectedBatchId: string | null;
  onSelectBatch: (id: string) => void;
}

// Watches for selectedBatchId changes 
// and opens that marker's popup + pans the map to it.
function SelectedMarkerSync({
  selectedBatchId,
  markerRefs,
  positions,
}: {
  selectedBatchId: string | null;
  markerRefs: React.MutableRefObject<Map<string, LeafletMarker>>;
  positions: Map<string, [number, number]>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBatchId) return;

    const marker = markerRefs.current.get(selectedBatchId);
    const position = positions.get(selectedBatchId);

    if (marker && position) {
      map.panTo(position);
      marker.openPopup();
    }
  }, [selectedBatchId, map, markerRefs, positions]);

  return null;
}

export function DashboardMap({
  selectedBatchId,
  onSelectBatch,
}: DashboardMapProps) {
  const { data: batches } = useBatches();
  const availableBatches = batches?.filter((b) => b.status === "available");

  const markerRefs = useRef<Map<string, LeafletMarker>>(new Map());
  const positions = new Map<string, [number, number]>(
    availableBatches?.map((b) => [b.id, [b.latitude, b.longitude]]) ?? []
  );

  return (
    <MapContainer
      center={KISUMU_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SelectedMarkerSync
        selectedBatchId={selectedBatchId}
        markerRefs={markerRefs}
        positions={positions}
      />

      {availableBatches?.map((batch) => (
        <Marker
          key={batch.id}
          position={[batch.latitude, batch.longitude]}
          ref={(ref) => {
            if (ref) markerRefs.current.set(batch.id, ref);
            else markerRefs.current.delete(batch.id);
          }}
          eventHandlers={{
            click: () => onSelectBatch(batch.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{batch.quantityKg.toLocaleString()} kg</p>
              <p>{batch.locationName}</p>
              <p className="text-xs text-gray-500">
                ★ {batch.qualityRating ?? "—"}/5 · {timeAgo(batch.createdAt)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}