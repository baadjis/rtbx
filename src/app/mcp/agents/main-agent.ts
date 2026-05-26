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
      maxRetries: 1,
    });

    let finalText = result.text?.trim() || '';

    // === EXTRACTION FORCÉE DU RÉSULTAT DU TOOL ===
    if (!finalText && result.toolCalls && result.toolCalls.length > 0) {
      const lastToolCall = result.toolCalls[result.toolCalls.length - 1];
      
      // Accès au résultat du tool
      const toolResult = (lastToolCall as any)?.result;

      if (toolResult) {
        if (typeof toolResult === 'string') {
          finalText = toolResult;
        } 
        else if (toolResult.success && toolResult.data) {
          // Cas le plus fréquent : { success: true, data: [...] }
          finalText = JSON.stringify(toolResult.data, null, 2);
        } 
        else {
          finalText = JSON.stringify(toolResult, null, 2);
        }
      }
    }

    // Fallback si toujours vide
    if (!finalText) {
      finalText = "J'ai exécuté l'action. Voici le résultat :";
    }

    return {
      success: true,
      text: finalText,
      steps: result.steps,
      toolCalls: result.toolCalls,
      usage: result.usage,
    };

  } catch (error: any) {
    console.error('MCP Agent Error:', error);

    return {
      success: false,
      error: error,
      text: "Sorry, I encountered an error. Could you please try again?",
    };
  }
}