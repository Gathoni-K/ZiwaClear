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
    weightKg: 650,
    locationName: "Dunga Beach",
    latitude: -0.1192,
    longitude: 34.7383,
    verificationRating: 4.7,
    status: "claimed",
    collectedAt: minutesAgo(180),
  },
  {
    id: "batch-006",
    weightKg: 900,
    locationName: "Kendu Bay",
    latitude: -0.3667,
    longitude: 34.6333,
    verificationRating: 4.5,
    status: "claimed",
    collectedAt: minutesAgo(240),
  },
];