import { ChatOpenAI } from "@langchain/openai";
import { extractionPromptTemplate } from "./parserPrompts";
import { ParsedSMSData, smsParserSchema } from "./parserSchema";
import { CircuitBreaker, getPartialExtraction } from "./parserFallback";

const circuitBreaker = new CircuitBreaker(5, 60000);
const cache = new Map<string, { data: ParsedSMSData; timestamp: number }>();

export class LangchainSMSParser {
    private llm: ChatOpenAI;

    constructor() {
        this.llm = new ChatOpenAI({
            modelName: process.env.LLM_MODEL || "gpt-3.5-turbo",
            temperature: 0.1,
            timeout: 15000,
            maxRetries: 3,
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    public async parseSMS(message: string): Promise<ParsedSMSData> {
        // Check cache first
        const cached = cache.get(message);
        if (cached && Date.now() - cached.timestamp < 3600000) {
            return cached.data;
        }

        try {
            return await circuitBreaker.execute(async () => {
                const structuredLlm = this.llm.withStructuredOutput(smsParserSchema);
                const chain = extractionPromptTemplate.pipe(structuredLlm);
                const result = await chain.invoke({ message });

                const finalResult = {
                    ...result,
                    extracted_at: result.extracted_at || new Date().toISOString(),
                    confidence_score: result.confidence_score ?? 0.8
                } as ParsedSMSData;

                // Cache successful results
                cache.set(message, { data: finalResult, timestamp: Date.now() });
                return finalResult;
            });
        } catch (error) {
            console.error("Langchain parser failed, using fallback:", error);
            return getPartialExtraction(message) as ParsedSMSData;
        }
    }
}

export const smsParser = new LangchainSMSParser();