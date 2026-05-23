// app/mcp/core/client.ts
import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

/**
 * =========================================================
 * LLM CLIENTS CONFIGURATION
 * =========================================================
 * This file manages all LLM providers and selects the best model
 * based on available API keys.
 * =========================================================
 */

// Initialize clients
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================================================
// AVAILABLE MODELS
// =====================================================
export const models = {
  // High intelligence models
  claudeSonnet: anthropic('claude-3-5-sonnet-20240620'),
  gpt4o: openai('gpt-4o'),
  groqLlama70B: groq('llama-3.1-70b-versatile'),

  // Fast / cheaper models
  claudeHaiku: anthropic('claude-3-haiku-20240307'),
  groqLlama8B: groq('llama-3.1-8b-instant'),
  gpt4oMini: openai('gpt-4o-mini'),
};

// =====================================================
// DEFAULT MODEL SELECTION (Priority order)
// =====================================================
export const getDefaultModel = () => {
  // Priority 1: Claude 3.5 Sonnet (Best quality)
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('🤖 MCP → Using Claude 3.5 Sonnet');
    return models.claudeSonnet;
  }

  // Priority 2: OpenAI GPT-4o
  if (process.env.OPENAI_API_KEY) {
    console.log('🤖 MCP → Using GPT-4o');
    return models.gpt4o;
  }

  // Priority 3: Groq Llama 70B
  if (process.env.GROQ_API_KEY) {
    console.log('🚀 MCP → Using Groq Llama 3.1 70B');
    return models.groqLlama70B;
  }

  // Fallback
  console.warn('⚠️ No LLM API key found. Using Groq fast fallback.');
  return models.groqLlama8B;
};

// Default model used by the agent
export const defaultModel = getDefaultModel();

export default defaultModel;