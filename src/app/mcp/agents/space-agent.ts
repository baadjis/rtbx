/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText, stepCountIs } from 'ai';
import { createSpaceTools } from '../tools/spaces';
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
  'getMySpaces',
  'getSpaceBySlug',
  'getSpaceByToken',
  'searchSpaces',
  'getSpaceSocialLinks',
];

const WRITE_TOOLS = [
  'createSpace',
  'updateSpace',
  'addSpaceSocialLink',
  'updateSpaceSocialLink',
  'deleteSpaceSocialLink',
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|supprimer|delete|ajouter|add|nouveau|new|change|social|instagram|tiktok|twitter|linkedin/i;
const READ_KEYWORDS = /voir|montre|liste|mes spaces|my spaces|get my|afficher|chercher|search|quel est|what is|mon profil|my profile|slug/i;

const getRelevantSpaceTools = (allTools: any, lastMessage: string) => {
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

// =============================================
// SYSTEM PROMPT
// =============================================
const getSpaceSystemPrompt = (spaceId?: string) => `Tu es un assistant spécialisé dans la gestion des Spaces (profils publics) sur rtbx.space.
${spaceId ? `Contexte actuel : Space ID ${spaceId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.

READ (appeler directement sans confirmation) : getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : createSpace → email et user_id sont injectés automatiquement, ne pas les demander à l'utilisateur. social_data → utiliser addSpaceSocialLink après création.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais. Sois concis.`;

// =============================================
// AGENT
// =============================================
export async function runSpaceAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
    userEmail?: string;
    spaceId?: string;
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

    const allSpaceTools = createSpaceTools(
      options?.accessToken,
      options?.userId,
      options?.userEmail
    );
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const spaceTools = getRelevantSpaceTools(allSpaceTools, lastMessage);

    console.log('Space tools tokens ~', JSON.stringify(spaceTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getSpaceSystemPrompt(options?.spaceId),
      messages: sanitizedMessages,
      tools: spaceTools,
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
    console.error('Space Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}