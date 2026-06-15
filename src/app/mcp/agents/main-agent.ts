
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { getAllTools } from '../tools';
import { LangType } from '@/lib/lang/types';

// =============================================
// TOOLS CATEGORIES — main agent (tous domaines)
// =============================================
const WRITE_TOOLS = [
  'createSpace', 'updateSpace', 'addSpaceSocialLink', 'updateSpaceSocialLink', 'deleteSpaceSocialLink',
  'createBusiness', 'updateBusiness',
  'createShortLink', 'updateShortLink', 'deleteShortLink',
  'createEvent', 'publishEvent', 'updateEvent', 'deleteEvent', 'cancelEvent',
  'sendInvite', 'sendBadges', 'registerEvent', 'addAgendaItem', 'updateAgendaItem', 'deleteAgendaItem',
  'createForm', 'updateForm', 'deleteForm', 'publishForm', 'sendFormInvites',
];

const READ_ONLY_TOOLS = [
  'getMySpaces', 'getSpaceBySlug', 'getSpaceByToken', 'getSpaceSocialLinks', 'searchSpaces',
  'getUserBusinesses',
  'getUserShortLinks', 'getShortLinkStats', 'getShortLinkLogs',
  'getMyEvents', 'getEventRegistrations', 'getEventInvitations', 'getEventAgenda', 'searchPublicEvents', 'searchOrganizerEvents',
  'getMyForms', 'getFormById', 'getFormResponses', 'searchForms',
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|delete|supprimer|cancel|annuler|invite|send|envoyer|badge|register|inscrire|agenda|ajouter|add|publish|publier|nouveau|new|change|social/i;
const READ_KEYWORDS = /voir|montre|liste|mes|my|get my|afficher|chercher|search|quel est|what is|combien|stats|statistiques/i;

// Dans main-agent — DEFAULT retourne READ only au lieu de ALL



// =============================================
// SYSTEM PROMPT
// =============================================
const mainAgentConfig: AgentConfig = {
  name: 'Main',
  writeKeywords: WRITE_KEYWORDS,
  readKeywords: READ_KEYWORDS,
  writeTools: WRITE_TOOLS,
  readOnlyTools: READ_ONLY_TOOLS,
  defaultTools: READ_ONLY_TOOLS, // ← par défaut READ only, économise ~50% tokens
  createTools: (accessToken, userId, userEmail) => getAllTools(accessToken, userId, userEmail),
  getSystemPrompt: (_contextId?, lang: LangType = 'en') => {
    if (lang === 'fr') {
      return `Tu es RTBX MCP, assistant IA pour rtbx.space. Tu as accès à des tools pour gérer les liens courts, espaces, businesses, événements et formulaires de l'utilisateur.

RÈGLE ABSOLUE : Pour tout tool WRITE, tu dois TOUJOURS d'abord résumer ce que tu vas faire et demander "Dois-je procéder ? (oui/non)". Tu n'appelles JAMAIS un tool WRITE directement sans cette confirmation. Si l'utilisateur n'a pas encore dit "oui" ou "confirme", tu NE DOIS PAS appeler le tool.

WRITE (confirmation obligatoire AVANT tout appel) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink, createBusiness, updateBusiness, createShortLink, updateShortLink, deleteShortLink, createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem, createForm, updateForm, deleteForm, publishForm, sendFormInvites.

READ (appeler directement sans confirmation) : getMySpaces, getSpaceBySlug, getSpaceByToken, getSpaceSocialLinks, searchSpaces, getUserBusinesses, getUserShortLinks, getShortLinkStats, getShortLinkLogs, getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents, getMyForms, getFormById, getFormResponses, searchForms.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne jamais du JSON brut.
RÈGLES SPÉCIALES : cancelEvent → demander la raison. sendBadges → avertir irréversible. deleteForm/deleteEvent → avertir définitif.
Réponds en français, sois concis et professionnel.`;
    }

    return `You are RTBX MCP, an AI assistant for rtbx.space. You have access to tools to manage the user's short links, spaces, businesses, events and forms.

ABSOLUTE RULE: For any WRITE tool, you must ALWAYS first summarize what you're about to do and ask "Should I proceed? (yes/no)". You NEVER call a WRITE tool directly without this confirmation. If the user hasn't said "yes" or "confirm" yet, you MUST NOT call the tool.

WRITE (confirmation required BEFORE any call): createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink, createBusiness, updateBusiness, createShortLink, updateShortLink, deleteShortLink, createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem, createForm, updateForm, deleteForm, publishForm, sendFormInvites.

READ (call directly without confirmation): getMySpaces, getSpaceBySlug, getSpaceByToken, getSpaceSocialLinks, searchSpaces, getUserBusinesses, getUserShortLinks, getShortLinkStats, getShortLinkLogs, getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents, getMyForms, getFormById, getFormResponses, searchForms.

AFTER each tool: summarize the result in natural language. Never return raw JSON.
SPECIAL RULES: cancelEvent → ask for the reason. sendBadges → warn it's irreversible. deleteForm/deleteEvent → warn it's permanent.
Reply in English, be concise and professional.`;
  },
};

export async function runMainAgent(messages: Message[], options?: AgentOptions) {
  return runAgent(messages, mainAgentConfig, {
    lang: 'en', // ← default main agent
    ...options,
  });
}