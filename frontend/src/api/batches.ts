import type { Batch } from "../types/batch";
import { MOCK_BATCHES } from "./mockBatches";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/batches
 *
 * Until the backend is live, this returns mock data after a short
 * simulated delay (so loading states can be tested honestly).
 *
 * Once a real backend exists, set VITE_API_BASE_URL in your .env file
 * (e.g. VITE_API_BASE_URL=http://localhost:3000) and this will
 * automatically switch to hitting the real endpoint — no other code
 * needs to change.
 */
export async function fetchBatches(): Promise<Batch[]> {
  if (!API_BASE_URL) {
    await delay(600);
    return MOCK_BATCHES;
  }

  const response = await fetch(`${API_BASE_URL}/api/batches`);

  if (!response.ok) {
    throw new Error(`Failed to fetch batches: ${response.status}`);
  }

  return response.json();
}