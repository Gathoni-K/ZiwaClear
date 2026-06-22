import type { Batch } from "../types/batch";

// Coordinates for the real collection zones mentioned in the project README
const LOCATIONS = [
  { name: "Dunga Beach", lat: -0.1192, lng: 34.7383 },
  { name: "Usenge", lat: -0.0167, lng: 34.1333 },
  { name: "Kendu Bay", lat: -0.3667, lng: 34.6333 },
];

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60_000).toISOString();
}

export const MOCK_BATCHES: Batch[] = [
  {
    id: "batch-001",
    weightKg: 500,
    locationName: LOCATIONS[0].name,
    latitude: LOCATIONS[0].lat,
    longitude: LOCATIONS[0].lng,
    verificationRating: 4.9,
    status: "available",
    collectedAt: minutesAgo(2),
  },
  {
    id: "batch-002",
    weightKg: 1200,
    locationName: "Entebbe Port Facility",
    latitude: 0.0512,
    longitude: 32.4637,
    verificationRating: 4.8,
    status: "available",
    collectedAt: minutesAgo(14),
  },
  {
    id: "batch-003",
    weightKg: 250,
    locationName: LOCATIONS[1].name,
    latitude: LOCATIONS[1].lat,
    longitude: LOCATIONS[1].lng,
    verificationRating: 4.6,
    status: "available",
    collectedAt: minutesAgo(60),
  },
  {
    id: "batch-004",
    weightKg: 800,
    locationName: LOCATIONS[2].name,
    latitude: LOCATIONS[2].lat,
    longitude: LOCATIONS[2].lng,
    verificationRating: 4.7,
    status: "available",
    collectedAt: minutesAgo(35),
  },
  {
    id: "batch-005",
    weightKg: 1240,
    locationName: "Kisumu Lakefront Sector B",
    latitude: -0.0917,
    longitude: 34.768,
    verificationRating: 4.8,
    status: "claimed",
    collectedAt: minutesAgo(180),
    batchCode: "ZM-992-K5M",
    materialType: "Verified PET-G",
    region: "Kisumu, Kenya",
    expiresAt: hoursFromNow(48),
  },
  {
    id: "batch-006",
    weightKg: 850,
    locationName: "Homa Bay Shoreline A",
    latitude: -0.5273,
    longitude: 34.4571,
    verificationRating: 4.5,
    status: "claimed",
    collectedAt: minutesAgo(240),
    batchCode: "ZM-441-HBY",
    materialType: "HDPE Mixed",
    region: "Homa Bay, Kenya",
    expiresAt: hoursFromNow(72),
  },
];