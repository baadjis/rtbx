
/*getSystemPrompt: (eventId?) => `Tu es un assistant spécialisé dans la gestion d'événements sur rtbx.space.
${eventId ? `Contexte actuel : événement ID ${eventId}.` : ''}

RÈGLES STRICTES :
1. Quand l'utilisateur demande ses événements → appelle getMyEvents immédiatement.
2. Ne jamais inventer d'événements.
3. getMyEvents ne prend aucun paramètre.

WRITE (confirmation obligatoire) : createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.
READ (appeler directement) : getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en français par défaut.`,
};*/

/*const 
*/

// app/mcp/agents/event-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createEventTools } from '../tools/events';
import { LangType } from '@/lib/lang/types';
//import { EVENT_EXAMPLES } from '../core/Examples/events';
//import { getGenericContext } from '../core/context-manager';

const eventAgentConfig: AgentConfig = {
  name: 'Event',
  writeKeywords: /crée|créer|create|publish|publier|update|modifier|delete|supprimer|cancel|annuler|invite|send|envoyer|badge|register|inscrire|agenda|ajouter|add/i,
  readKeywords: /voir|montre|liste|mes événements|my events|get my|afficher|chercher|search|quel est|what is|combien/i,
  writeTools: ['createEvent', 'publishEvent', 'updateEvent', 'deleteEvent', 'cancelEvent', 'sendInvite', 'sendBadges', 'registerEvent', 'addAgendaItem', 'updateAgendaItem', 'deleteAgendaItem'],
  readOnlyTools: ['getMyEvents', 'getEventRegistrations', 'getEventInvitations', 'getEventAgenda', 'searchPublicEvents', 'searchOrganizerEvents'],
  createTools: (accessToken) => createEventTools(accessToken),
  getSystemPrompt: (eventId?, lang: LangType = 'en') => {
  if (lang === 'fr'){
    return `Tu es un assistant spécialisé dans la gestion d'événements sur rtbx.space.
${eventId ? `Contexte actuel : événement ID ${eventId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.
READ (appeler directement) : getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
RÈGLES : cancelEvent → demander la raison. sendBadges → avertir irréversible. deleteEvent → avertir définitif.
Réponds en français, sois concis.`;

  } 
    return `You are an assistant specialized in event management on rtbx.space.
${eventId ? `Current context: event ID ${eventId}.` : ''}

WRITE (confirmation required before calling): createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.
READ (call directly): getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

AFTER each tool: summarize the result in natural language. Never return raw JSON.
RULES: cancelEvent → ask for the reason first. sendBadges → warn it's irreversible. deleteEvent → warn it's permanent.
Reply in English, be concise.`;
  

  
},
  
  }
/*const EVENT_CONFIG = {
  agentName: "EventAgent",
  baseSystemPrompt: eventAgentConfig.getSystemPrompt(),
  examples: EVENT_EXAMPLES,
  fallbackTools: ["getMyEvents", "searchPublicEvents", "searchOrganizerEvents"]
};*/

export async function runEventAgent(messages: Message[], options?: AgentOptions & { eventId?: string }) {
  //const context = await getGenericContext(messages, eventAgentConfig.createTools(options?.accessToken), EVENT_CONFIG);
  
  return runAgent(messages, eventAgentConfig, {
    lang:'en',
    ...options,
    contextId: options?.eventId,
  });
}