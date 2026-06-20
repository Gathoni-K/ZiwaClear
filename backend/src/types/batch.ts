export interface BatchFilters {
    startDate?: string;
    endDate?: string;
    beachId?: number;
    status?: "collecting" | "processing" | "completed" | "failed";
    limit?: number;
    offset?: number;
}

export interface FishSpeciesAggregation {
    species: string;
    total_kg: number;
    avg_price: number;
}

export interface BatchAggregation {
    total_catch_kg: number;
    average_price_ksh: number;
    fish_species_breakdown: FishSpeciesAggregation[];
    beach_name: string;
    total_boats: number;
    weather_summary: string;
    message_count: number;
}
