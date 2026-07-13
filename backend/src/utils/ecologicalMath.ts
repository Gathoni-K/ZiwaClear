export type QualityGrade = "PREMIUM" | "STANDARD" | "MUDDY";

// Energy-yield penalty modifiers. Applies ONLY to biogas/CO2e math (chemical
// viability), never to surface area (spatial footprint is grade-independent).
export const QUALITY_MODIFIERS: Record<QualityGrade, number> = {
    PREMIUM: 1.0,   // fresh, clean stalks — full conversion
    STANDARD: 0.85, // average mix — ~15% dead organic matter / trapped water
    MUDDY: 0.60,    // dredged debris — 40% penalty for non-fermentable silt/roots
};

// batches.qualityRating is a raw integer (1|2|3), a direct lookup — not a
// threshold band. This is the single source of truth for that mapping;
// anything that needs rating -> grade (in JS or, derived, in SQL) reads
// from here rather than re-declaring its own copy.
export const QUALITY_RATING_TO_GRADE: Record<number, QualityGrade> = {
    3: "PREMIUM",
    2: "STANDARD",
    1: "MUDDY",
};

// Safe baseline failure mode for a missing or out-of-range rating, per spec.
export const DEFAULT_QUALITY_GRADE: QualityGrade = "STANDARD";

export function qualityRatingToGrade(qualityRating: number | null | undefined): QualityGrade {
    if (qualityRating == null) return DEFAULT_QUALITY_GRADE;
    return QUALITY_RATING_TO_GRADE[qualityRating] ?? DEFAULT_QUALITY_GRADE;
}

export function qualityRatingToModifier(qualityRating: number | null | undefined): number {
    return QUALITY_MODIFIERS[qualityRatingToGrade(qualityRating)];
}


// Sourced constants (see doc: MDPI Energy Transition / FAO anaerobic digestion profiles)
export const SURFACE_KG_PER_M2 = 40;
export const BIOGAS_M3_PER_ACTIVE_KG = 0.0224;
export const CO2E_KG_PER_ACTIVE_KG = 0.42;

/**
 * Surface area cleared. Uses RAW weight, not quality-adjusted mass —
 * the physical footprint blocked by hyacinth is the same regardless of
 * how fermentable it is.
 */
export function rawMassToSurfaceM2(rawWeightKg: number): number {
    return rawWeightKg / SURFACE_KG_PER_M2;
}

/**
 * Quality-adjusted "chemically viable" mass. This is the only place the
 * quality_grade modifier should ever be applied.
 */
export function getActiveMass(rawWeightKg: number, qualityGrade: QualityGrade): number {
    return rawWeightKg * QUALITY_MODIFIERS[qualityGrade];
}

export function activeMassToBiogasM3(activeMassKg: number): number {
    return activeMassKg * BIOGAS_M3_PER_ACTIVE_KG;
}

export function activeMassToCO2eKg(activeMassKg: number): number {
    return activeMassKg * CO2E_KG_PER_ACTIVE_KG;
}

export function activeMassToCO2eTonnes(activeMassKg: number): number {
    return activeMassToCO2eKg(activeMassKg) / 1000;
}