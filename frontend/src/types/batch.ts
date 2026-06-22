export interface Batch {
  id: string;
  weightKg: number;
  locationName: string;
  latitude: number;
  longitude: number;
  verificationRating: number; // out of 5
  status: "available" | "claimed" | "delivered";
  collectedAt: string; // ISO timestamp

  /** Short display code, e.g. "ZM-992-K5M" */
  batchCode?: string;
  /** e.g. "Verified PET-G", "HDPE Mixed" */
  materialType?: string;
  region?: string;
  /** ISO timestamp for when the collection window expires */
  expiresAt?: string;
}