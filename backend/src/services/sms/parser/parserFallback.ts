import { LLMExtraction } from "./parserSchema";
import { resolveUnitAlias } from "./unitReference";

const QUALITY_KEYWORDS: Record<string, "fresh" | "dry" | "mixed" | "decomposed"> = {
    kavu: "dry",
    dry: "dry",
    mbichi: "fresh",
    fresh: "fresh",
    "mpya": "fresh",
    imeoza: "decomposed",
    "imeozea": "decomposed",
    rotten: "decomposed",
    decomposed: "decomposed",
    mchanganyiko: "mixed",
    mixed: "mixed",
};

function detectQuality(lowerMessage: string): "fresh" | "dry" | "mixed" | "decomposed" | null {
    for (const [keyword, quality] of Object.entries(QUALITY_KEYWORDS)) {
        if (lowerMessage.includes(keyword)) {
            return quality;
        }
    }
    return null;
}

export function getPartialExtraction(message: string): LLMExtraction {
    const lowerMessage = message.toLowerCase();
    const partialData: LLMExtraction = {
        location_raw: null,
        location: null,
        scale_estimate: null,
        quality: null,
        impact_tags: [],
        summary: null,
        additional_notes: message.substring(0, 50),
        confidence_score: 0.1,
    };

    if (lowerMessage.includes("dunga")) partialData.location = "Dunga";
    else if (lowerMessage.includes("usenge")) partialData.location = "Usenge";
    else if (lowerMessage.includes("kendu")) partialData.location = "Kendu Bay";
    else if (lowerMessage.includes("homa")) partialData.location = "Homa Bay";
    else if (lowerMessage.includes("muhuru")) partialData.location = "Muhuru Bay";

    const kgMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)/);
    if (kgMatch) {
        partialData.scale_estimate = { scale_type: "direct_kg", raw_value: parseFloat(kgMatch[1]!) };
    } else {
        const unitMatch = lowerMessage.match(
            /(\d+)\s*(gunia|magunia|toroli|sitoro|mkokoteni|mtumbwi|sese|pickup|pick-up|canter|fuso|lorry)/
        );
        if (unitMatch) {
            const unit = resolveUnitAlias(unitMatch[2]!);
            if (unit) {
                partialData.scale_estimate = { scale_type: unit, raw_value: parseFloat(unitMatch[1]!) };
            }
        }
    }

    partialData.quality = detectQuality(lowerMessage);

    if (lowerMessage.includes("imeziba") || lowerMessage.includes("blocked")) {
        partialData.impact_tags = [...partialData.impact_tags, "navigation_blockage"];
    }

    return partialData;
}

export class CircuitBreaker {
    private failureCount: number = 0;
    private readonly threshold: number;
    private lastFailureTime: number | null = null;
    private readonly resetTimeoutMs: number;

    constructor(threshold = 5, resetTimeoutMs = 60000) {
        this.threshold = threshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }

    public async execute<T>(action: () => Promise<T>): Promise<T> {
        if (this.isOpen()) {
            throw new Error("Circuit breaker is open due to consecutive failures.");
        }
        try {
            const result = await action();
            this.reset();
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }

    private isOpen(): boolean {
        if (this.failureCount >= this.threshold) {
            if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.failureCount = 0;
                return false;
            }
            return true;
        }
        return false;
    }

    private recordFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();
    }

    private reset(): void {
        this.failureCount = 0;
        this.lastFailureTime = null;
    }
}