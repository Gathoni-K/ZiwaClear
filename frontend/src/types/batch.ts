export interface Batch {
  id: string;
  quantityKg: number;
  locationName: string;
  beachId?: number;
  latitude: number | null;
  longitude: number | null;
  status: "available" | "claimed" | "collected" | "flagged";
  harvesterPhone: string;
  harvesterName?: string | null;
  buyerId?: string | null;
  qualityRating?: number | null;
  claimedAt?: string | null;
  collectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string | null;

  batchCode?: string;
  materialType?: string;
  region?: string;
  expiresAt?: string;
}

export function mapBatch(raw: Partial<Batch> & { id: string; quantityKg: number; locationName: string; harvesterPhone: string; createdAt: string; updatedAt: string; status: Batch["status"] }): Batch {
  return {
    ...raw,
    batchCode: raw.batchCode ?? `ZM-${raw.quantityKg}${raw.id.slice(0, 3).toUpperCase()}`,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    qualityRating: raw.qualityRating ?? null,
  };
}