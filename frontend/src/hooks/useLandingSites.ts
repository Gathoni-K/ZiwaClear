import { useQuery } from "@tanstack/react-query";
import { api } from "../api/config";

export function useLandingSites() {
  return useQuery({
    queryKey: ["landing-sites"],
    queryFn: api.landingSites.getAll,
    refetchInterval: 4_000,
  });
}