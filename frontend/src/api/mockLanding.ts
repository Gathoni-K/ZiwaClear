import { Droplets, Wind, TrendingDown, Radio, Target, Factory } from "lucide-react";
import type { CrisisStat, EcosystemFeature, VisionItem } from "../types/landing";

export const CRISIS_STATS: CrisisStat[] = [
  {
    icon: Droplets,
    title: "Clogged Waterways",
    description:
      "Dense hyacinth mats obstruct navigable channels, crippling local boat trade and restraining ferry commerce from the primary source of income.",
  },
  {
    icon: Wind,
    title: "Oxygen Depletion",
    description:
      "The rapid decomposition of biomass under the water surface starves the lake of oxygen, leading to massive fish kills and a collapsing local ecosystem.",
  },
  {
    icon: TrendingDown,
    title: "Economic Impact",
    description:
      "Over $80 million is lost annually in fishery output and regional economic activity due to the unchecked spread of water hyacinth.",
  },
];

export const ECOSYSTEM_FEATURES: EcosystemFeature[] = [
  {
    icon: Radio,
    title: "Decentralized Harvesting",
    description:
      "Empower local youth and harvesters to log collected biomass instantly via SMS or USSD, no smartphone required.",
    ctaLabel: "Join as Harvester",
  },
  {
    icon: Target,
    title: "Intelligent Matching",
    description:
      "Our AI engine matches verified biomass batches with the nearest commercial buyer, optimizing logistics and routing in real time.",
    ctaLabel: "View Live Map",
  },
  {
    icon: Factory,
    title: "Industrial Output",
    description:
      "Biogas and fertilizer producers gain a reliable, verified, and continuously replenished supply chain of converted hyacinth biomass.",
    ctaLabel: "Partner With Us",
  },
];

export const VISION_ITEMS: VisionItem[] = [
  {
    label: "Collection",
    title: "2025 Roadmap",
    description: "Expand harvesting coverage across Kisumu, Homa Bay, and the broader Winam Gulf, scaling SMS-based reporting infrastructure.",
    status: "current",
  },
  {
    label: "Optimization",
    title: "AI-Driven Logistics",
    description: "Deploy predictive routing and yield modeling to reduce collection-to-conversion time across the supply chain.",
    status: "upcoming",
  },
];