import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/config";
import type { ImpactCard, BackendTrendPoint, RawCumulativeValues } from "../types/impact";

interface ImpactApiResponse {
  success: boolean;
  data: ImpactCard[];
  message?: string;
}

interface TrendApiResponse {
  success: boolean;
  data: BackendTrendPoint[];
  message?: string;
}

async function fetchImpactCards(): Promise<ImpactCard[]> {
  const res = await fetch(`${API_BASE_URL}/api/batches/impact`);
  if (!res.ok) throw new Error("Failed to fetch impact metrics");
  const json: ImpactApiResponse = await res.json();
  if (!json.success) throw new Error(json.message ?? "Impact fetch failed");
  return json.data;
}

async function fetchImpactTrend(): Promise<BackendTrendPoint[]> {
  const res = await fetch(`${API_BASE_URL}/api/batches/impact/trend`);
  if (!res.ok) throw new Error("Failed to fetch impact trend");
  const json: TrendApiResponse = await res.json();
  if (!json.success) throw new Error(json.message ?? "Trend fetch failed");
  return json.data;
}

function parseNumericPrefix(formatted: string): number {
  const cleaned = formatted.replace(/,/g, "").match(/[\d.]+/);
  return cleaned ? parseFloat(cleaned[0]) : 0;
}

function deriveRawCumulative(cards: ImpactCard[]): RawCumulativeValues {
  const surface = cards.find((c) => c.id === "surface-restored");
  const biogas = cards.find((c) => c.id === "biogas-generated");
  const carbon = cards.find((c) => c.id === "carbon-offset");

  const surfaceRestoredM2 = surface ? parseNumericPrefix(surface.value) : 0;
  const biogasGeneratedM3 = biogas ? parseNumericPrefix(biogas.value) : 0;
  const co2eAvoidedTonnes = carbon ? parseNumericPrefix(carbon.value) : 0;

  return {
    surfaceRestoredM2,
    biogasGeneratedM3,
    co2eAvoidedKg: co2eAvoidedTonnes * 1000,
    co2eAvoidedTonnes,
  };
}

export interface UseImpactMetricsResult {
  cards: ImpactCard[];
  rawCumulative: RawCumulativeValues;
  trend: BackendTrendPoint[];
  isLoading: boolean;
  error: Error | null;
}

const EMPTY_RAW: RawCumulativeValues = {
  surfaceRestoredM2: 0,
  biogasGeneratedM3: 0,
  co2eAvoidedKg: 0,
  co2eAvoidedTonnes: 0,
};

export function useImpactMetrics(): UseImpactMetricsResult {
  const cardsQuery = useQuery<ImpactCard[], Error>({
    queryKey: ["impact", "cards"],
    queryFn: fetchImpactCards,
    refetchInterval: 30_000,
  });

  const trendQuery = useQuery<BackendTrendPoint[], Error>({
    queryKey: ["impact", "trend"],
    queryFn: fetchImpactTrend,
    refetchInterval: 30_000,
  });

  const cards = cardsQuery.data ?? [];
  const trend = trendQuery.data ?? [];
  const rawCumulative = cards.length > 0 ? deriveRawCumulative(cards) : EMPTY_RAW;

  return {
    cards,
    rawCumulative,
    trend,
    isLoading: cardsQuery.isLoading || trendQuery.isLoading,
    error: cardsQuery.error ?? trendQuery.error ?? null,
  };
}
