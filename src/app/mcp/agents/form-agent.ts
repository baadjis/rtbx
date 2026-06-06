/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText, stepCountIs } from 'ai';
import { createFormTools } from '../tools/forms';
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
  'getMyForms',
  'getFormById',
  'getFormResponses',
  'searchForms',
];

const WRITE_TOOLS = [
  'createForm',
  'updateForm',
  'deleteForm',
  'publishForm',
  'sendFormInvites',
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|delete|supprimer|publier|publish|invite|envoyer|send|nouveau|new|formulaire|form/i;
const READ_KEYWORDS = /voir|montre|liste|mes forms|my forms|get my|afficher|chercher|search|réponses|responses|quel est|what is|résultats|results/i;

const getRelevantFormTools = (allTools: any, lastMessage: string) => {
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
const getFormSystemPrompt = (formId?: string) => `Tu es un assistant spécialisé dans la gestion des formulaires sur rtbx.space.
${formId ? `Contexte actuel : Form ID ${formId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createForm, updateForm, deleteForm, publishForm, sendFormInvites.

READ (appeler directement sans confirmation) : getMyForms, getFormById, getFormResponses, searchForms.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : deleteForm → avertir que c'est définitif et supprime toutes les réponses. publishForm → envoie automatiquement les invitations en attente. sendFormInvites → demander la liste des emails si non fournie.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais. Sois concis.`;

// =============================================
// AGENT
// =============================================
export async function runFormAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
    formId?: string;
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

    const allFormTools = createFormTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const formTools = getRelevantFormTools(allFormTools, lastMessage);

    console.log('Form tools tokens ~', JSON.stringify(formTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getFormSystemPrompt(options?.formId),
      messages: sanitizedMessages,
      tools: formTools,
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
    console.error('Form Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}