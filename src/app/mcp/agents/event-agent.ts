/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText, stepCountIs } from 'ai';
import { createEventTools } from '../tools/events';
import { defaultModel } from '../core/client';
import { mcpConfig } from '../core/config';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const MAX_CONTENT_LENGTH = 800;

const getEventSystemPrompt = (eventId?: string) => `Tu es un assistant spécialisé dans la gestion d'événements sur rtbx.space.
${eventId ? `Contexte actuel : événement ID ${eventId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.

READ (appeler directement sans confirmation) : getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : cancelEvent → demander la raison d'abord. sendBadges → avertir que c'est irréversible. deleteEvent → avertir que c'est définitif.
Réponds en anglais par défaut, français si l'utilisateur écrit en français. Sois concis.`;


// =============================================
// TOOLS CATEGORIES
// =============================================
const READ_ONLY_TOOLS = [
  'getMyEvents',
  'getEventRegistrations',
  'getEventInvitations',
  'getEventAgenda',
  'searchPublicEvents',
  'searchOrganizerEvents',
];

const WRITE_TOOLS = [
  'createEvent',
  'publishEvent',
  'updateEvent',
  'deleteEvent',
  'cancelEvent',
  'sendInvite',
  'sendBadges',
  'registerEvent',
  'addAgendaItem',
  'updateAgendaItem',
  'deleteAgendaItem',
];

const WRITE_KEYWORDS = /crée|créer|create|publish|publier|update|modifier|delete|supprimer|cancel|annuler|invite|send|envoyer|badge|register|inscrire|agenda|ajouter|add/i;
const READ_KEYWORDS = /voir|montre|liste|mes événements|my events|get my|afficher|chercher|search|quel est|what is|combien/i;
const getRelevantEventTools = (allTools: any, lastMessage: string) => {
  const lowerMessage = lastMessage.toLowerCase().trim();
  // Si le message contient un mot d'action → envoyer tous les tools
  if (WRITE_KEYWORDS.test(lowerMessage)) {
    console.log("🔧 WRITE mode → Tous les tools (READ + WRITE)");
    return Object.fromEntries(
      Object.entries(WRITE_TOOLS).filter(([key]) => READ_ONLY_TOOLS.includes(key))
    );
  }

  // 2. READ détecté → on renvoie seulement les READ tools
  else if (READ_KEYWORDS.test(lowerMessage)) {
    console.log("🔧 READ mode → Seulement READ tools");
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => READ_ONLY_TOOLS.includes(key))
    );
  }
  //console.log(ReleventTools)
  return Object.fromEntries(
      allTools
    );
};

export async function runEventAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    refreshToken?:string
    userId?: string;
    eventId?: string;
    userEmail?: string;
    
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

    const allEventTools = createEventTools(options?.accessToken);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const eventTools = getRelevantEventTools(allEventTools, lastMessage);

    console.log('Event tools tokens ~', JSON.stringify(eventTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getEventSystemPrompt(options?.eventId),
      messages: sanitizedMessages,
      tools: eventTools,
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

    return {
      success: true,
      text: finalText,
      toolCalls: toolNames,
      usage: result.usage,
    };
  } catch (error: any) {
    console.error('Event Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}