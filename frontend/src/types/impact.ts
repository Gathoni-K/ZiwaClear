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
