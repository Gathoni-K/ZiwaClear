import { useQuery } from "@tanstack/react-query";
import { api } from "../api/config";

export function useLandingSiteMetrics() {
  return useQuery({
    queryKey: ["landing-sites", "metrics"],
    queryFn: api.landingSites.getMetrics,
    refetchInterval: 4_000,
  });
}