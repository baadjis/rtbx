/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText, stepCountIs } from 'ai';
import { createBusinessTools } from '../tools/businesses';
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
  'getUserBusinesses',
];

const WRITE_TOOLS = [
  'createBusiness',
  'updateBusiness',
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change|entreprise|business|société/i;
const READ_KEYWORDS = /voir|montre|liste|mes business|my business|get my|afficher|chercher|search|quel est|what is|mon entreprise|my company/i;

const getRelevantBusinessTools = (allTools: any, lastMessage: string) => {
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
const getBusinessSystemPrompt = (businessId?: string) => `Tu es un assistant spécialisé dans la gestion des businesses sur rtbx.space.
${businessId ? `Contexte actuel : Business ID ${businessId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createBusiness, updateBusiness.

READ (appeler directement sans confirmation) : getUserBusinesses.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : createBusiness → user_id est injecté automatiquement, ne pas le demander à l'utilisateur.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais. Sois concis.`;

// =============================================
// AGENT
// =============================================
export async function runBusinessAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
    businessId?: string;
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

    const allBusinessTools = createBusinessTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const businessTools = getRelevantBusinessTools(allBusinessTools, lastMessage);

    console.log('Business tools tokens ~', JSON.stringify(businessTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getBusinessSystemPrompt(options?.businessId),
      messages: sanitizedMessages,
      tools: businessTools,
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
    console.error('Business Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}