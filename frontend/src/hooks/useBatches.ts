import { useQuery } from "@tanstack/react-query";
import { fetchBatches } from "../api/batches";

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
    refetchInterval: 30_000, // poll every 30s to mimic "LIVE" updates
  });
}