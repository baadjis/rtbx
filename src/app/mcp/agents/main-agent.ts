/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/agents/main-agent.ts
import { generateText, stepCountIs } from 'ai';
import { tools } from '../tools';
import { defaultModel } from '../core/client';
import systemPrompt from '../prompts/system';
import { mcpConfig } from '../core/config';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Longueur max des messages historiques avant troncature
const MAX_CONTENT_LENGTH = 800;

export async function runMCPAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
  }
) {
  try {
    // Sanitize l'historique — tronquer les anciens messages trop longs
    // Le dernier message (question actuelle) est toujours gardé intact
    const sanitizedMessages = messages.map((msg, index) => {
      if (index === messages.length - 1) return msg;
      if (msg.role === 'assistant' && msg.content.length > MAX_CONTENT_LENGTH) {
        return {
          ...msg,
          content: msg.content.slice(0, MAX_CONTENT_LENGTH) + '... [tronqué]',
        };
      }
      return msg;
    });

   const result = await generateText({
  model: defaultModel,
  system: systemPrompt,
  messages: sanitizedMessages,
  tools: tools,
  temperature: options?.temperature ?? mcpConfig.temperature ?? 0.7,
  maxOutputTokens: mcpConfig.maxTokens, // ← v6
  stopWhen: stepCountIs(options?.maxSteps ?? mcpConfig.maxSteps ?? 5),
  maxRetries: 0,
});

let finalText = result.text?.trim() || '';

    // Chercher le résultat dans steps si text est vide
    if (!finalText && result.steps && result.steps.length > 0) {
      for (const step of result.steps.slice().reverse()) {
        const toolResults = step.toolResults ?? [];
        if (toolResults.length > 0) {
          const lastOutput = (toolResults[toolResults.length - 1] as any).output;
          if (lastOutput !== undefined) {
            if (typeof lastOutput === 'string') {
              finalText = lastOutput;
            } else if ((lastOutput as any)?.data) {
              finalText = JSON.stringify((lastOutput as any).data, null, 2);
            } else {
              finalText = JSON.stringify(lastOutput, null, 2);
            }
            break;
          }
        }
      }
    }

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