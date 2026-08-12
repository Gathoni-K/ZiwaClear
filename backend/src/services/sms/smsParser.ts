import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { extractionPromptTemplate } from "./parser/parserPrompts";
import { ParsedSMSData, LLMExtraction, llmExtractionSchema, smsParserSchema, ScaleEstimate } from "./parser/parserSchema";
import { CircuitBreaker, getPartialExtraction } from "./parser/parserFallback";
import { estimateKgFromUnit } from "./parser/unitReference";
import { computeUrgencyLevel } from "./parser/urgencyRules";

const circuitBreaker = new CircuitBreaker(5, 60000);
const cache = new Map<string, { data: ParsedSMSData; timestamp: number }>();

function resolveQuantityKg(scale: ScaleEstimate | null | undefined): { kg: number | null; estimated: boolean } {
    if (!scale || scale.raw_value == null || !scale.scale_type) return { kg: null, estimated: false };
    if (scale.scale_type === "direct_kg") return { kg: scale.raw_value, estimated: false };
    return { kg: estimateKgFromUnit(scale.scale_type, scale.raw_value), estimated: true };
}

function finalizeResult(llmData: LLMExtraction): ParsedSMSData {
    const { kg, estimated } = resolveQuantityKg(llmData.scale_estimate);
    return smsParserSchema.parse({
        ...llmData,
        quantity_kg: kg,
        quantity_estimated: estimated,
        urgency_level: computeUrgencyLevel(kg),
        extracted_at: new Date().toISOString(),
    });
}

export class LangchainSMSParser {
    private llm: ChatGoogleGenerativeAI;

    constructor() {
        this.llm = new ChatGoogleGenerativeAI({
            model: process.env.LLM_MODEL || "gemini-1.5-flash",
            temperature: 0.1,
            maxRetries: 3,
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        });
    }

    public async parseSMS(message: string): Promise<ParsedSMSData> {
        const cached = cache.get(message);
        if (cached && Date.now() - cached.timestamp < 3600000) {
            return cached.data;
        }

        try {
            return await circuitBreaker.execute(async () => {
                const structuredLlm = this.llm.withStructuredOutput(llmExtractionSchema);
                const chain = extractionPromptTemplate.pipe(structuredLlm);
                const rawResult = await chain.invoke({ message });

                // Re-parse to normalize against our schema's defaults/types
                // before it's safe to pass into finalizeResult.
                const normalized = llmExtractionSchema.parse(rawResult);
                const finalResult = finalizeResult(normalized);

                cache.set(message, { data: finalResult, timestamp: Date.now() });
                return finalResult;
            });
        } catch (error) {
            console.error("Langchain parser failed, using fallback:", error);
            const partial = getPartialExtraction(message);
            return finalizeResult(partial);
        }
    }
}

export const smsParser = new LangchainSMSParser();