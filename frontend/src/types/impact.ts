import type { LucideIcon } from "lucide-react";

export interface ImpactMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  trend?: string;
  badge?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: "complete" | "pending";
}

export interface ImpactCard {
  id: "surface-restored" | "biogas-generated" | "carbon-offset";
  label: string;
  value: string;
  description: string;
}

export interface BackendTrendPoint {
  month: string;
  surfaceRestoredM2: number;
  biogasGeneratedM3: number;
  co2eAvoidedKg: number;
}

export interface RawCumulativeValues {
  surfaceRestoredM2: number;
  biogasGeneratedM3: number;
  co2eAvoidedKg: number;
  co2eAvoidedTonnes: number;
}
