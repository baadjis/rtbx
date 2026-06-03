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

WRITE — confirmation obligatoire : createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.

READ — appeler directement : getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
RÈGLES : cancelEvent → demander la raison. sendBadges → avertir irréversible. deleteEvent → avertir définitif.
Réponds en français par défaut, anglais si l'utilisateur écrit en anglais.`;

const READ_TOOLS = ['getMyEvents', 'getEventRegistrations', 'getEventInvitations', 'getEventAgenda', 'searchPublicEvents', 'searchOrganizerEvents'];

const getRelevantEventTools = (allTools: any, lastMessage: string) => {
  const isReadOnly = lastMessage.match(/voir|liste|agenda|participants|invitations|cherche|search|show|get|mes events|mes événements/i);

  if (isReadOnly) {
    return Object.fromEntries(
      Object.entries(allTools).filter(([key]) => READ_TOOLS.includes(key))
    );
  }

  return allTools;
};

export async function runEventAgent(
  messages: Message[],
  options?: {
    temperature?: number;
    maxSteps?: number;
    accessToken?: string;
    userId?: string;
    eventId?: string;
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

    // Créer les tools une seule fois
    const allEventTools = createEventTools(options?.accessToken);

    // Filtrer selon le message
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const eventTools = getRelevantEventTools(allEventTools, lastMessage);

    console.log('Event tools tokens ~', JSON.stringify(eventTools).length / 4);

    const result = await generateText({
      model: defaultModel,
      system: getEventSystemPrompt(options?.eventId),
      messages: sanitizedMessages,
      tools: eventTools,
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
    console.error('Event Agent Error:', error);
    return {
      success: false,
      error,
      text: "Désolé, une erreur est survenue. Veuillez réessayer.",
    };
  }
}