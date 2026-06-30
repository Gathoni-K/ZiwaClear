import type { LucideIcon } from "lucide-react";

export interface CrisisStat {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface EcosystemFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
}

export interface VisionItem {
  label: string;
  title: string;
  description: string;
  status: "current" | "upcoming";
}