import { ParsedSMSData } from "./parserSchema";

export function getPartialExtraction(message: string): Partial<ParsedSMSData> {
  const lowerMessage = message.toLowerCase();
  const partialData: Partial<ParsedSMSData> = {
    beach_name: null,
    fish_species: [],
    catch_total_kg: null,
    price_per_kg_ksh: null,
    weather_condition: null,
    boat_count: null,
    fishing_method: null,
    additional_notes: message.substring(0, 50),
    confidence_score: 0.1,
    extracted_at: new Date().toISOString()
  };

  if (lowerMessage.includes("dunga")) partialData.beach_name = "Dunga";
  else if (lowerMessage.includes("usenge")) partialData.beach_name = "Usenge";

  const kgMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*kg/);
  if (kgMatch) partialData.catch_total_kg = parseFloat(kgMatch[1]);

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
