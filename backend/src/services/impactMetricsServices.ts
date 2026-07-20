import { and, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { batches } from "../db/schema";
import {
    QUALITY_MODIFIERS,
    QUALITY_RATING_TO_GRADE,
    DEFAULT_QUALITY_GRADE,
    SURFACE_KG_PER_M2,
    BIOGAS_M3_PER_ACTIVE_KG,
    CO2E_KG_PER_ACTIVE_KG,
} from "../utils/ecologicalMath";

// Batches with these statuses count toward confirmed impact.
// - "claimed": biomass has been physically cleared from open water and
//   stacked at the landing site — surface area is already restored.
// - "collected": the loop is complete, truck has taken it to the digester.
// - "available" is excluded: not yet actioned, no confirmed impact yet.
// - "flagged" is excluded: disputed/duplicate/spam reports, must never
//   inflate environmental metrics.
const IMPACT_ELIGIBLE_STATUSES = ["claimed", "collected"] as const;

// batches.qualityRating is a raw 1|2|3 integer lookup. This builds the SQL
// CASE expression directly from QUALITY_RATING_TO_GRADE + QUALITY_MODIFIERS
// (both defined once, in ecologicalMath.ts) so there is a single source of
// truth for the rating -> grade -> modifier mapping. Anything outside the
// known ratings, including NULL, falls back to DEFAULT_QUALITY_GRADE's
// modifier, per spec. Expressed in SQL so the weighted sum runs as a single
// DB aggregate instead of pulling every row into memory.
//
// NOTE: every branch is explicitly cast to ::real. JS does not distinguish
// 1.0 from 1 (QUALITY_MODIFIERS.PREMIUM === 1), so without an explicit cast
// Postgres receives untyped bound params that don't unify to a single type
// across branches and silently falls back to `text`, which then blows up
// downstream as `operator does not exist: real * text`. Do not remove
// these casts even if the modifiers all "look like" floats in JS.
function qualityModifierCaseExpr() {
    const whenClauses = Object.entries(QUALITY_RATING_TO_GRADE)
        .map(([rating, grade]) => sql`WHEN ${Number(rating)} THEN ${QUALITY_MODIFIERS[grade]}::real`)
        .reduce((acc, clause) => sql`${acc} ${clause}`);
    const fallbackModifier = QUALITY_MODIFIERS[DEFAULT_QUALITY_GRADE];
    return sql<number>`CASE ${batches.qualityRating} ${whenClauses} ELSE ${fallbackModifier}::real END`;
}

export interface CumulativeImpactMetrics {
    surfaceRestoredM2: number;
    totalActiveMassKg: number;
    biogasGeneratedM3: number;
    co2eAvoidedKg: number;
    co2eAvoidedTonnes: number;
}

export interface BiogasTrendPoint {
    month: string; // e.g. "2026-01"
    surfaceRestoredM2: number;
    biogasGeneratedM3: number;
    co2eAvoidedKg: number;
}

export class ImpactMetricsService {
    /**
     * Cumulative, all-time impact totals for the dashboard cards.
     *
     * Surface Restored uses RAW quantityKg, unmodified by quality — the
     * physical footprint cleared from the lake is the same regardless of
     * how fermentable the biomass turns out to be.
     *
     * Total Active Mass (and everything derived from it: biogas, CO2e)
     * applies the quality modifier, since mud/roots don't ferment.
     */
    public async getCumulativeImpactMetrics(): Promise<CumulativeImpactMetrics> {
        const modifierExpr = qualityModifierCaseExpr();

        const [row] = await db
            .select({
                sumRawKg: sql<number>`COALESCE(SUM(${batches.quantityKg}), 0)`,
                sumActiveMassKg: sql<number>`COALESCE(SUM(${batches.quantityKg} * ${modifierExpr}), 0)`,
            })
            .from(batches)
            .where(inArray(batches.status, IMPACT_ELIGIBLE_STATUSES));

        const sumRawKg = Number(row?.sumRawKg ?? 0);
        const sumActiveMassKg = Number(row?.sumActiveMassKg ?? 0);

        return {
            surfaceRestoredM2: sumRawKg / SURFACE_KG_PER_M2,
            totalActiveMassKg: sumActiveMassKg,
            biogasGeneratedM3: sumActiveMassKg * BIOGAS_M3_PER_ACTIVE_KG,
            co2eAvoidedKg: sumActiveMassKg * CO2E_KG_PER_ACTIVE_KG,
            co2eAvoidedTonnes: (sumActiveMassKg * CO2E_KG_PER_ACTIVE_KG) / 1000,
        };
    }

    /**
     * Monthly trend, grouped by the month the batch was claimed
     * (i.e. entered the verified logistics chain), chronologically ordered.
     * Same eligibility + math split as the cumulative totals above.
     */
    public async getBiogasTrend(): Promise<BiogasTrendPoint[]> {
        const modifierExpr = qualityModifierCaseExpr();
        const monthExpr = sql<string>`TO_CHAR(DATE_TRUNC('month', ${batches.claimedAt}), 'YYYY-MM')`;

        const rows = await db
            .select({
                month: monthExpr,
                sumRawKg: sql<number>`COALESCE(SUM(${batches.quantityKg}), 0)`,
                sumActiveMassKg: sql<number>`COALESCE(SUM(${batches.quantityKg} * ${modifierExpr}), 0)`,
            })
            .from(batches)
            .where(
                and(
                    inArray(batches.status, IMPACT_ELIGIBLE_STATUSES),
                    sql`${batches.claimedAt} IS NOT NULL`
                )
            )
            .groupBy(monthExpr)
            .orderBy(monthExpr);

        return rows.map((r) => {
            const sumRawKg = Number(r.sumRawKg);
            const sumActiveMassKg = Number(r.sumActiveMassKg);
            return {
                month: r.month,
                surfaceRestoredM2: sumRawKg / SURFACE_KG_PER_M2,
                biogasGeneratedM3: sumActiveMassKg * BIOGAS_M3_PER_ACTIVE_KG,
                co2eAvoidedKg: sumActiveMassKg * CO2E_KG_PER_ACTIVE_KG,
            };
        });
    }
}

export const impactMetricsService = new ImpactMetricsService();