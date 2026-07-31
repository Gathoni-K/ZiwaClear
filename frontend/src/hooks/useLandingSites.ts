import { useQuery } from "@tanstack/react-query";
import { api } from "../api/config";

export interface LandingSite {
  id: number;
  name: string;
  bmuLeaderPhone: string;
  coveragePercentage: number;
  dominantQualityGrade: string;
  operationalStatus: string;
  riskLevel: "normal" | "watch" | "warning" | "emergency";
  latitude: string | null;
  longitude: string | null;
  updatedAt: string;
}

export function useLandingSites() {
  return useQuery<LandingSite[]>({
    queryKey: ["landing-sites"],
    queryFn: async () => {
      const json = await api.landingSites.getAll();
      // Backend returns { success, data }. Older code here read the raw
      // response directly, so Array.isArray(sites) was always false and
      // every consumer's "no sites" fallback silently fired — the alert
      // sidebar and simulation panel's site dropdown never actually
      // populated. Unwrapping here fixes that for every consumer at once.
      return Array.isArray(json) ? json : json.data ?? [];
    },
    refetchInterval: 4_000,
  });
}