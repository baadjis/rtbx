/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/core/generic-context-manager.ts
/*import { pipeline } from '@xenova/transformers';

type Example = {
  intent: string;
  examples: string[];        // phrases dans plusieurs langues
  tools: string[];           // noms des tools à activer
  priority?: number;
};

type ContextConfig = {
  agentName: string;
  baseSystemPrompt: string;
  examples: Example[];
  fallbackTools: string[];   // tools par défaut si aucun match
};

let extractor: any = null;

async function getEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function getGenericContext(
  messages: any[],
  allTools: Record<string, any>,
  config: ContextConfig
) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const history = messages.slice(-4).map(m => m.content).join(" | ");

  const queryEmbedding = await getEmbedding(history);

  let bestMatch = { score: -1, tools: [] as string[], intent: "unknown" };

  // Recherche du meilleur match
  for (const ex of config.examples) {
    for (const exText of ex.examples) {
      const exEmb = await getEmbedding(exText);
      const score = cosineSimilarity(queryEmbedding, exEmb);

      if (score > bestMatch.score) {
        bestMatch = {
          score,
          tools: ex.tools,
          intent: ex.intent
        };
      }
    }
  }

  const threshold = 0.67;

  let selectedTools: Record<string, any> = {};
  let systemPrompt = `${config.baseSystemPrompt}\n\n`;

  if (bestMatch.score > threshold) {
    console.log(`🧠 [${config.agentName}] Match: ${bestMatch.intent} (${bestMatch.score.toFixed(3)})`);
    selectedTools = Object.fromEntries(
      Object.entries(allTools).filter(([key]) => bestMatch.tools.includes(key))
    );
    systemPrompt += `Contexte détecté : ${bestMatch.intent}`;
  } else {
    console.log(`🧠 [${config.agentName}] Pas de match fort → Fallback`);
    selectedTools = Object.fromEntries(
      Object.entries(allTools).filter(([key]) => config.fallbackTools.includes(key))
    );
    systemPrompt += "Mode consultation par défaut.";
  }

  return {
    tools: selectedTools,
    systemPrompt,
    confidence: bestMatch.score,
    detectedIntent: bestMatch.intent
  };
}*/