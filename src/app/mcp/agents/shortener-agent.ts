/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { generateText, stepCountIs } from 'ai';
import { createShortenerTools } from '../tools/shortener';
import { defaultModel } from '../core/client';
import { mcpConfig } from '../core/config';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const MAX_CONTENT_LENGTH = 800;

// =============================================
// TOOLS CATEGORIES
// =============================================
const READ_ONLY_TOOLS = [
  'getUserShortLinks',
  'getShortLinkStats',
  'getShortLinkLogs',
];

const WRITE_TOOLS = [
  'createShortLink',
  'updateShortLink',
  'deleteShortLink',
];

const WRITE_KEYWORDS = /crée|créer|create|raccourcir|shorten|update|modifier|delete|supprimer|nouveau lien|new link|ajouter|add/i;
const READ_KEYWORDS = /voir|montre|liste|mes liens|my links|get my|afficher|chercher|search|stats|statistiques|logs|clics|clicks|quel est|what is|combien/i;

const getRelevantShortenerTools = (allTools: any, lastMessage: string) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (WRITE_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 WRITE mode → WRITE tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => WRITE_TOOLS.includes(key))
    );
  }

  if (READ_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => READ_ONLY_TOOLS.includes(key))
    );
  }

  // Par défaut — tous les tools
  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};

// =============================================
// SYSTEM PROMPT
// =============================================
const shortenerSystemPrompt = `Tu es un assistant spécialisé dans la gestion de liens courts sur rtbx.space.

WRITE (confirmation obligatoire avant d'appeler) : createShortLink, updateShortLink, deleteShortLink.

READ (appeler directement sans confirmation) : getUserShortLinks, getShortLinkStats, getShortLinkLogs.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : deleteShortLink → avertir que c'est définitif.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais. Sois concis.`;

// =============================================
// AGENT
// =============================================
export async function runShortenerAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
  }
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

    const allShortenerTools = createShortenerTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const shortenerTools = getRelevantShortenerTools(allShortenerTools, lastMessage);

    console.log('Shortener tools tokens ~', JSON.stringify(shortenerTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: shortenerSystemPrompt,
      messages: sanitizedMessages,
      tools: shortenerTools,
      temperature: options?.temperature ?? mcpConfig.temperature ?? 0.7,
      maxOutputTokens: mcpConfig.maxTokens,
      stopWhen: stepCountIs(options?.maxSteps ?? mcpConfig.maxSteps ?? 5),
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

    return {
      success: true,
      text: finalText,
      toolCalls: toolNames,
      usage: result.usage,
    };
  } catch (error: any) {
    console.error('Shortener Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}*/



/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/agents/shortener-agent.ts
import { generateText, stepCountIs } from 'ai';
import { createShortenerTools } from '../tools/shortener';
import { defaultModel } from '../core/client';
import { mcpConfig } from '../core/config';
import { extractUIFromSteps } from '../ui/extract-ui';
import { getAgentRelevantTools } from './releventTools';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const MAX_CONTENT_LENGTH = 800;

const READ_ONLY_TOOLS = ['getUserShortLinks', 'getShortLinkStats', 'getShortLinkLogs'];
const WRITE_TOOLS = ['createShortLink', 'updateShortLink', 'deleteShortLink'];

const WRITE_KEYWORDS = /crée|créer|create|raccourcir|shorten|update|modifier|delete|supprimer|nouveau lien|new link|ajouter|add/i;
const READ_KEYWORDS = /voir|montre|liste|mes liens|my links|get my|afficher|chercher|search|stats|statistiques|logs|clics|clicks|quel est|what is|combien/i;

const getRelevantShortenerTools = (allTools: any, lastMessage: string) => {
  const lowerMessage = lastMessage.toLowerCase().trim();

  if (WRITE_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 WRITE mode → WRITE tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => WRITE_TOOLS.includes(key))
    );
  }
  if (READ_KEYWORDS.test(lowerMessage)) {
    console.log('🔧 READ mode → READ tools');
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => READ_ONLY_TOOLS.includes(key))
    );
  }
  console.log('🔧 DEFAULT mode → Tous les tools');
  return allTools;
};

const shortenerSystemPrompt = `Tu es un assistant spécialisé dans la gestion de liens courts sur rtbx.space.

WRITE (confirmation obligatoire avant d'appeler) : createShortLink, updateShortLink, deleteShortLink.
READ (appeler directement sans confirmation) : getUserShortLinks, getShortLinkStats, getShortLinkLogs.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : deleteShortLink → avertir que c'est définitif.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais. Sois concis.`;

export async function runShortenerAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
    mode?: 'ui' | 'text'; // ← nouveau
  }
) {
  try {
    const sanitizedMessages = messages.map((msg, index) => {
      if (index === messages.length - 1) return msg;
      if (msg.role === 'assistant' && msg.content.length > MAX_CONTENT_LENGTH) {
        return { ...msg, content: msg.content.slice(0, MAX_CONTENT_LENGTH) + '... [tronqué]' };
      }
      return msg;
    });

    const allShortenerTools = createShortenerTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const shortenerTools = getAgentRelevantTools(allShortenerTools,WRITE_KEYWORDS,READ_KEYWORDS,WRITE_TOOLS,READ_ONLY_TOOLS, lastMessage);

    const result = await generateText({
      model: defaultModel,
      system: shortenerSystemPrompt,
      messages: sanitizedMessages,
      tools: shortenerTools,
      temperature: options?.temperature ?? mcpConfig.temperature ?? 0.7,
      maxOutputTokens: mcpConfig.maxTokens,
      stopWhen: stepCountIs(options?.maxSteps ?? mcpConfig.maxSteps ?? 5),
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
      ui: uiPayload,      // ← null si mode=text ou pas de UI disponible
      toolCalls: toolNames,
      usage: result.usage,
    };
  } catch (error: any) {
    console.error('Shortener Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
      ui: null,
    };
  }
}