// app/mcp/core/client.ts
// app/mcp/core/client.ts
import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

/**
 * =========================================================
 * LLM CLIENTS - WITH SMART FALLBACK
 * =========================================================
 */

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modèles
export const models = {
  claudeSonnet: anthropic('claude-3-5-sonnet-20240620'),
  gpt4o: openai('gpt-4o'),
  groqLlama70B: groq('llama-3.3-70b-versatile'),
  groqFast: groq('llama-3.1-8b-instant'),
};

// Sélection intelligente avec fallback sur Groq
export const getDefaultModel = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('🤖 MCP → Using Claude 3.5 Sonnet');
    return models.claudeSonnet;
  }

  if (process.env.OPENAI_API_KEY) {
    console.log('🤖 MCP → Using GPT-4o');
    return models.gpt4o;
  }

  if (process.env.GROQ_API_KEY) {
    console.log('🚀 MCP → Using Groq Llama 3.1 70B');
    return models.groqLlama70B;
    //console.log(" 🚀 MCP → Using Groqllama-3.1-8b-instant ")
    //return models.groqFast;

  }

  console.warn('⚠️ No LLM API key found. Using Groq fast fallback.');
  return models.groqFast;
};

export const defaultModel = getDefaultModel();

export default defaultModel;