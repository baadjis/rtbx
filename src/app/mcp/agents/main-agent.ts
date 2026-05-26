/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/agents/main-agent.ts
import { generateText } from 'ai';
import { tools } from '../tools';
import { defaultModel } from '../core/client';
import systemPrompt from '../prompts/system';
import mcpConfig from '../core/config';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

/**
 * =========================================================
 * MAIN MCP AGENT
 * =========================================================
 */
export async function runMCPAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
  }
) {
  try {
    const result = await generateText({
      model: defaultModel,
      system: systemPrompt,
      messages: messages,
      tools: tools,
      temperature: options?.temperature ?? mcpConfig.temperature ?? 0.7,
      maxRetries: 1,                    // On réduit les retries automatiques
    });

    return {
      success: true,
      text: result.text,
      steps: result.steps,
      toolCalls: result.toolCalls,
      usage: result.usage,
    };

  } catch (error: any) {
    console.error('MCP Agent Error:', error);

    // On passe l'erreur brute au server pour meilleure détection
    return {
      success: false,
      error: error,
      text: "Sorry, I encountered an error. Could you please try again?",
    };
  }
}