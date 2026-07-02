import type { Batch } from "../types/batch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export async function fetchBatches(): Promise<Batch[]> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set");
  }
  const response = await fetch(`${API_BASE_URL}/api/batches`);
  if (!response.ok) {
    throw new Error(`Failed to fetch batches: ${response.status}`);
  }
  const json = await response.json();
  return json.data;
}