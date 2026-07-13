export type LocalUnit =
    | "gunia" | "toroli" | "mkokoteni" | "mtumbwi"
    | "sese" | "pickup" | "canter" | "fuso";

export const UNIT_KG_BASELINE: Record<LocalUnit, number> = {
    gunia: 30,
    toroli: 40,
    mkokoteni: 250,
    mtumbwi: 500,
    sese: 1500,
    pickup: 800,
    canter: 2500,
    fuso: 6000,
};

export const UNIT_ALIASES: Record<string, LocalUnit> = {
    gunia: "gunia", magunia: "gunia", sack: "gunia",
    toroli: "toroli", sitoro: "toroli", wheelbarrow: "toroli",
    mkokoteni: "mkokoteni", handcart: "mkokoteni",
    mtumbwi: "mtumbwi", "boti ndogo": "mtumbwi",
    sese: "sese", "boti kubwa": "sese",
    pickup: "pickup", "pick-up": "pickup", hilux: "pickup",
    canter: "canter", "lorry ndogo": "canter",
    fuso: "fuso", "lorry kubwa": "fuso", lorry: "fuso",
};

export function estimateKgFromUnit(unit: LocalUnit, count: number): number {
    return UNIT_KG_BASELINE[unit] * count;
}

export function resolveUnitAlias(term: string): LocalUnit | null {
    return UNIT_ALIASES[term.trim().toLowerCase()] ?? null;
}