/**
 * Returns a canned response based on simple keyword matching in the user's
 * message. Once a real backend endpoint exists (LangChain / Vercel AI SDK),
 * replace getMockResponse() + streamText() with an actual fetch to a
 * streaming endpoint — the ChatPanel's onChunk callback pattern will work
 * the same way with a real ReadableStream.
 */
export function getMockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("batch") || msg.includes("kisumu") || msg.includes("kg")) {
    return "There are currently several available biomass batches around the Lake Victoria basin, including Dunga Beach, Usenge, and Kendu Bay. You can reserve any available batch directly from the Dashboard sidebar or by clicking its pin on the map.";
  }

  if (msg.includes("impact") || msg.includes("carbon") || msg.includes("co2")) {
    return "So far, ZiwaClear has restored 12,400 m² of lake surface, offset 850 tonnes of CO2e, and created 275 green jobs for local harvesters. You can see the full breakdown on the Impact page.";
  }

  if (msg.includes("payment") || msg.includes("mpesa") || msg.includes("pay")) {
    return "Payments are handled securely through M-Pesa. Once you confirm a collection on the Claimed Batches page, funds are held in escrow and released to the harvester upon verified collection.";
  }

  return "I'm a demo AI assistant for now — once connected to the real backend, I'll be able to answer questions about live batches, logistics, and impact metrics in detail.";
}

/**
 * Simulates token/word-by-word streaming by calling onChunk repeatedly
 * with small delays, mimicking how a real LLM streaming response feels.
 */
export async function streamText(
  text: string,
  onChunk: (chunkSoFar: string) => void,
  delayMs = 35
): Promise<void> {
  const words = text.split(" ");
  let soFar = "";

  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    soFar += (i > 0 ? " " : "") + words[i];
    onChunk(soFar);
  }
}