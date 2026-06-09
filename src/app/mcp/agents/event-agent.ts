
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
import { EVENT_EXAMPLES } from '../core/Examples/events';
import { getGenericContext } from '../core/context-manager';

const eventAgentConfig: AgentConfig = {
  name: 'Event',
  writeKeywords: /crée|créer|create|publish|publier|update|modifier|delete|supprimer|cancel|annuler|invite|send|envoyer|badge|register|inscrire|agenda|ajouter|add/i,
  readKeywords: /voir|montre|liste|mes événements|my events|get my|afficher|chercher|search|quel est|what is|combien/i,
  writeTools: ['createEvent', 'publishEvent', 'updateEvent', 'deleteEvent', 'cancelEvent', 'sendInvite', 'sendBadges', 'registerEvent', 'addAgendaItem', 'updateAgendaItem', 'deleteAgendaItem'],
  readOnlyTools: ['getMyEvents', 'getEventRegistrations', 'getEventInvitations', 'getEventAgenda', 'searchPublicEvents', 'searchOrganizerEvents'],
  createTools: (accessToken) => createEventTools(accessToken),
  
  getSystemPrompt :(eventId?: string) => `Tu es un assistant spécialisé dans la gestion d'événements sur rtbx.space.
${eventId ? `Contexte actuel : événement ID ${eventId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem.

READ (appeler directement sans confirmation) : getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : cancelEvent → demander la raison d'abord. sendBadges → avertir que c'est irréversible. deleteEvent → avertir que c'est définitif.
Réponds en anglais par défaut, français si l'utilisateur écrit en français. Sois concis.`}
const EVENT_CONFIG = {
  agentName: "EventAgent",
  baseSystemPrompt: eventAgentConfig.getSystemPrompt(),
  examples: EVENT_EXAMPLES,
  fallbackTools: ["getMyEvents", "searchPublicEvents", "searchOrganizerEvents"]
};

export async function runEventAgent(messages: Message[], options?: AgentOptions & { eventId?: string }) {
  const context = await getGenericContext(messages, eventAgentConfig.createTools(options?.accessToken), EVENT_CONFIG);
  console.log(context.tools,context.detectedIntent)
  return runAgent(messages, eventAgentConfig, {
    ...options,
    contextId: options?.eventId,
  });
}