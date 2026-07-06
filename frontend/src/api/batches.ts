import { api } from "./config";
import { mapBatch } from "../types/batch";
import type { Batch } from "../types/batch";

export async function fetchBatches(): Promise<Batch[]> {
  const json = await api.batches.getAll();
  const raw = Array.isArray(json) ? json : json.data ?? [];
  return raw.map(mapBatch);
}