/* eslint-disable @typescript-eslint/no-explicit-any */
import defaultModel from '../core/client';
import { mcpConfig } from '../core/config';
import { extractUIFromSteps } from '../ui/extract-ui';
import { getAgentRelevantTools } from './releventTools';
import { generateText, stepCountIs } from 'ai';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type AgentConfig = {
  name: string;
  writeKeywords: RegExp;
  readKeywords: RegExp;
  writeTools: string[];
  readOnlyTools: string[];
  createTools: (accessToken?: string, userId?: string, userEmail?: string) => any;
  getSystemPrompt: (contextId?: string) => string;
};

export type AgentOptions = {
  temperature?: number;
  maxSteps?: number;
  accessToken?: string;
  userId?: string;
  userEmail?: string;
  contextId?: string; // eventId, spaceId, formId, businessId...
  mode?: 'ui' | 'text';
};

const MAX_CONTENT_LENGTH = 800;

export async function runAgent(
  messages: Message[],
  config: AgentConfig,
  options?: AgentOptions
) {
  try {
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

    const allTools = config.createTools(
      options?.accessToken,
      options?.userId,
      options?.userEmail
    );

    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const tools = getAgentRelevantTools(
      allTools,
      config.writeKeywords,
      config.readKeywords,
      config.writeTools,
      config.readOnlyTools,
      lastMessage
    );

    console.log(`${config.name} tools tokens ~`, JSON.stringify(tools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: config.getSystemPrompt(options?.contextId),
      messages: sanitizedMessages,
      tools,
      temperature: options?.temperature ?? mcpConfig.temperature ?? 0.3,
      maxOutputTokens: mcpConfig.maxTokens,
      stopWhen: stepCountIs(options?.maxSteps ?? mcpConfig.maxSteps ?? 3),
      maxRetries: 0,
    });

    let finalText = result.text?.trim() || '';

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

    if (!finalText) finalText = "J'ai exécuté l'action. Voici le résultat :";

    const toolNames = result.steps
      ?.flatMap(step => step.toolCalls ?? [])
      .map(tc => tc.toolName) ?? [];

    const uiPayload = options?.mode !== 'text'
      ? extractUIFromSteps(result.steps ?? [])
      : null;

    return {
      success: true,
      text: finalText,
      toolCalls: toolNames,
      usage: result.usage,
      ui: uiPayload,
    };
  } catch (error: any) {
    console.error(`${config.name} Agent Error:`, error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
      ui: null,
    };
  }
}