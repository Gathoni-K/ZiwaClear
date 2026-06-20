import { MapContainer, TileLayer } from "react-leaflet";
import "../lib/leafletIconFix";

// Kisumu, Kenya 
const KISUMU_CENTER: [number, number] = [-0.0917, 34.768];
const DEFAULT_ZOOM = 12;

export function DashboardMap() {
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
    </MapContainer>
  );
}