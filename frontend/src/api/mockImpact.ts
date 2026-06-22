import { Droplet, Cloud, Fish, Zap, Briefcase } from "lucide-react";
import type { ImpactMetric, Milestone } from "../types/impact";

export const MOCK_IMPACT_METRICS: ImpactMetric[] = [
  {
    id: "surface-restored",
    icon: Droplet,
    label: "Surface Restored",
    value: "12,400 m²",
    description: "Cleaned water hyacinth coverage",
    trend: "+12% MoM",
  },
  {
    id: "carbon-offset",
    icon: Cloud,
    label: "Carbon Offset",
    value: "850 tonnes CO2e",
    description: "Verified emissions sequestration",
    badge: "Certified",
  },
  {
    id: "fish-stock",
    icon: Fish,
    label: "Fish Stock Recovery",
    value: "+4,500 kg",
    description: "Annual biomass growth in local yields",
  },
];

export const MOCK_BIOGAS_METRIC: ImpactMetric = {
  id: "biogas-generated",
  icon: Zap,
  label: "Sustainable Biogas Generated",
  value: "85,000 m³",
  description:
    "Equivalent to powering 1,200 rural households for an entire calendar year through circular biomass conversion.",
};

export interface BiogasTrendPoint {
  month: string;
  m3: number;
}

export const MOCK_BIOGAS_TREND: BiogasTrendPoint[] = [
  { month: "Jan", m3: 42000 },
  { month: "Feb", m3: 48500 },
  { month: "Mar", m3: 55000 },
  { month: "Apr", m3: 61000 },
  { month: "May", m3: 68500 },
  { month: "Jun", m3: 74000 },
  { month: "Jul", m3: 79500 },
  { month: "Aug", m3: 85000 },
];

export const MOCK_SOCIAL_IMPACT_METRIC: ImpactMetric = {
  id: "green-jobs",
  icon: Briefcase,
  label: "Social Impact",
  value: "275 Green Jobs",
  description: "Livelihoods created in the harvesting and logistics network.",
};

export const MOCK_MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "10,000 m² Milestone Reached",
    date: "October 12, 2024",
    status: "complete",
  },
  {
    id: "m2",
    title: "Expansion to Kisumu Port",
    date: "September 28, 2024",
    status: "complete",
  },
  {
    id: "m3",
    title: "Tier 2 Verification Pending",
    date: "Estimated Nov 15",
    status: "pending",
  },
];

export const MOCK_AUDIT_PROGRESS_PERCENT = 78;