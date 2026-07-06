import { useQuery } from "@tanstack/react-query";
import { fetchBatches } from "../api/batches";
import type { Batch } from "../types/batch";

export function useBatches() {
  return useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: fetchBatches,
    refetchInterval: 20_000,
  });
}