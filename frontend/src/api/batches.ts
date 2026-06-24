import type { Batch } from "../types/batch";
import { MOCK_BATCHES } from "./mockBatches";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

type RawBatch = Omit<Batch, "weightKg" | "verificationRating"> & {
  quantityKg: number;
  qualityRating: number | null;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchBatches(): Promise<RawBatch[]> {
  if (!API_BASE_URL) {
    await delay(600);
    return MOCK_BATCHES as unknown as RawBatch[];
  }

  const response = await fetch(`${API_BASE_URL}/api/batches`);
  if (!response.ok) {
    throw new Error(`Failed to fetch batches: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}