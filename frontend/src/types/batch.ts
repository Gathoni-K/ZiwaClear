export interface Batch {
  id: string;
  weightKg: number;
  locationName: string;
  latitude: number;
  longitude: number;
  verificationRating: number; // out of 5
  status: "available" | "claimed" | "delivered";
  collectedAt: string; // ISO timestamp
}