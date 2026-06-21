import { ParsedSMSData } from "./parserSchema";

export function getPartialExtraction(message: string): Partial<ParsedSMSData> {
    const lowerMessage = message.toLowerCase();
    const partialData: Partial<ParsedSMSData> = {
        location: null,
        quantity_kg: null,
        unit: "kg",
        additional_notes: message.substring(0, 50),
        confidence_score: 0.1,
        extracted_at: new Date().toISOString()
    };

    if (lowerMessage.includes("dunga")) partialData.location = "Dunga";
    else if (lowerMessage.includes("usenge")) partialData.location = "Usenge";
    else if (lowerMessage.includes("kendu")) partialData.location = "Kendu Bay";
    else if (lowerMessage.includes("homa")) partialData.location = "Homa Bay";
    else if (lowerMessage.includes("muhuru")) partialData.location = "Muhuru Bay";

    const kgMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)/);

    if (kgMatch) {
        partialData.quantity_kg = parseFloat(kgMatch[1]!);
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