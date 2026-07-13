export type UrgencyLevel = "low" | "medium" | "high";

export function computeUrgencyLevel(kg: number | null): UrgencyLevel | null {
    if (kg == null) return null;
    if (kg >= 1000) return "high";
    if (kg >= 300) return "medium";
    return "low";
}