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

    // Si pas de texte mais des tool calls → on extrait le résultat
    if (!finalText && result.toolCalls && result.toolCalls.length > 0) {
      const lastToolCall = result.toolCalls[result.toolCalls.length - 1];
      
      // Accès correct au résultat du tool
      if (lastToolCall && 'result' in lastToolCall) {
        const toolResult = (lastToolCall as any).result;
        
        if (toolResult) {
          finalText = typeof toolResult === 'string' 
            ? toolResult 
            : JSON.stringify(toolResult, null, 2);
        }
      }
    }

    // Fallback si toujours vide
    if (!finalText) {
      finalText = "J'ai exécuté l'action demandée. Que puis-je faire d'autre ?";
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