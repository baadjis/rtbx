import defaultModel from "../core/client";
import { mcpConfig } from "../core/config";
import { extractUIFromSteps } from "../ui/extract-ui";
import { getAgentRelevantTools } from "./releventTools";
import { generateText, stepCountIs } from 'ai';


/* eslint-disable @typescript-eslint/no-explicit-any */
export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;

};

const MAX_CONTENT_LENGTH = 800;



export async function runAgent(
  messages: Message[],
  agent: string, 
  WRITE_KEYWORDS:any,READ_KEYWORDS:any,WRITE_TOOLS:string[],READ_ONLY_TOOLS:string[],
  createTools:any,
  getEventSystemPrompt:any,
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    refreshToken?:string
    userId?: string;
    eventId?: string;
    userEmail?: string;
    mode?: 'ui' | 'text'; // ← nouveau

    
  }
) {
  console.log('accessToken exists:', !!options?.accessToken);
  console.log('accessToken preview:', options?.accessToken?.slice(0, 20));
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

    const allTools = createTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const tools = getAgentRelevantTools(allTools,WRITE_KEYWORDS,READ_KEYWORDS,WRITE_TOOLS,READ_ONLY_TOOLS, lastMessage);
    
    //console.log('Event tools tokens ~', JSON.stringify(allTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getEventSystemPrompt(options?.eventId),
      messages: sanitizedMessages,
      tools: tools,
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
    // Extraire le payload UI si mode = 'ui'
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
    console.error(`${agent} Agent Error:`, error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}