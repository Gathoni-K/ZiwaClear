import { useQuery } from "@tanstack/react-query";
import { api } from "../api/config";

export function useLandingSiteMetrics() {
  return useQuery({
    queryKey: ["landing-sites", "metrics"],
    queryFn: async () => {
      const json = await api.landingSites.getMetrics();
      return json.data ?? json;
    },
    refetchInterval: 4_000,
  });
}