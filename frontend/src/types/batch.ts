export interface Batch {
  id: string;
  quantityKg: number;
  locationName: string;
  beachId: number | null;
  latitude: number | null;
  longitude: number | null;
  status: "available" | "claimed" | "collected" | "flagged";
  harvesterPhone: string;
  harvesterName: string | null;
  buyerId: string | null;
  qualityRating: number | null;
  claimedAt: string | null;
  collectedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}