import { useQuery } from "@tanstack/react-query";
import { fetchBatches } from "../api/batches";
import type { Batch } from "../types/batch";

export function useBatches() {
  return useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const raw = await fetchBatches();
      return raw.map((b: any) => ({
        ...b,
        weightKg: b.quantityKg,
        verificationRating: b.qualityRating ?? 0,
        collectedAt: b.collectedAt ?? b.createdAt,
      }));
    },
    refetchInterval: 20_000,
  });
}