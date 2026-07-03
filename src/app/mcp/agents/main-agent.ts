
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { getAllTools } from '../tools';
import { LangType } from '@/lib/lang/types';
import { detectDomain } from './domain-detection';
import { classifier } from '../classifier';

// =============================================
// TOOLS CATEGORIES — main agent (tous domaines)
// =============================================
const WRITE_TOOLS = [
  'createSpace', 'updateSpace', 'addSpaceSocialLink', 'updateSpaceSocialLink', 'deleteSpaceSocialLink',
  'createBusiness', 'updateBusiness','upsertBusinessProviderLink',
'saveBusinessOpeningHours',
'saveBusinessLoyaltySettings',
'createBusinessLoyaltyReward',
'updateBusinessLoyaltyReward',
'deleteBusinessLoyaltyReward',
'upsertBusinessAppLink', 'deleteBusinessAppLink',
  'createShortLink', 'updateShortLink', 'deleteShortLink',
  'createEvent', 'publishEvent', 'updateEvent', 'deleteEvent', 'cancelEvent',
  'sendInvite', 'sendBadges', 'registerEvent', 'addAgendaItem', 'updateAgendaItem', 'deleteAgendaItem',
  'createForm', 'updateForm', 'deleteForm', 'publishForm', 'sendFormInvites',
  
];

const READ_ONLY_TOOLS = [
  'getMySpaces', 'getSpaceBySlug', 'getSpaceByToken', 'getSpaceSocialLinks', 'searchSpaces',
  'getUserBusinesses',

  'getBusinessProviderLinks',
'getBusinessOpeningHours',
'getBusinessLoyaltySettings',
'getBusinessLoyaltyRewards',
'getBusinessLoyaltyHistory',

  'getUserShortLinks', 'getShortLinkStats', 'getShortLinkLogs',
  'getMyEvents', 'getEventRegistrations', 'getEventInvitations', 'getEventAgenda', 'searchPublicEvents', 'searchOrganizerEvents',
  'getMyForms', 'getFormById', 'getFormResponses', 'searchForms',
  'getBusinessAppLinks'
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|delete|supprimer|cancel|annuler|invite|send|envoyer|badge|register|inscrire|agenda|ajouter|add|publish|publier|nouveau|new|change|social/i;
const READ_KEYWORDS = /voir|montre|liste|mes|my|get my|afficher|chercher|search|quel est|what is|combien|stats|statistiques/i;

// Dans main-agent — DEFAULT retourne READ only au lieu de ALL


// Dans main-agent.ts — détection de domaine
const DOMAIN_KEYWORDS = {
  // Business en premier — mots plus spécifiques
  business: /business|entreprise|société|company|provider|loyalty|fidélité|horaires|opening|app.?link|récompense|reward/i,
  // Shortener — "lien court" ou "url" seuls, pas "lien provider/app"
  shortener: /lien\s+court|short\s+link|url\s+court|raccourcir|shorten|clics|stats/i,
  event: /événement|event|agenda|participant|invitation|badge|inscrire|register/i,
  space: /space|profil|slug|social|instagram|tiktok/i,
  form: /formulaire|form|réponse|response|sondage/i,
};

const DOMAIN_READ_TOOLS: Record<string, string[]> = {
  shortener: [
    'getUserShortLinks',
    'getShortLinkStats',
    'getShortLinkLogs',
  ],
  event: [
    'getMyEvents',
    'getEventRegistrations',
    'getEventInvitations',
    'getEventAgenda',
    'searchPublicEvents',
    'searchOrganizerEvents',
  ],
  space: [
    'getMySpaces',
    'getSpaceBySlug',
    'getSpaceSocialLinks',
    'searchSpaces',
  ],
  business: [
    'getUserBusinesses',
    'getBusinessProviderLinks',
    'getBusinessAppLinks',
    'getBusinessOpeningHours',
    'getBusinessLoyaltySettings',
    'getBusinessLoyaltyRewards',
    'getBusinessLoyaltyHistory',
  ],
  form: [
    'getMyForms',
    'getFormById',
    'getFormResponses',
    'searchForms',
  ],
};

export function getMainAgentDefaultTools(lastMessage: string, allReadTools: string[]): string[] {
  const lower = lastMessage.toLowerCase();
  
  for (const [domain, regex] of Object.entries(DOMAIN_KEYWORDS)) {
    if (regex.test(lower)) {
      console.log(`🎯 Domain detected: ${domain}`);
      console.log(DOMAIN_READ_TOOLS[domain])
      return DOMAIN_READ_TOOLS[domain];
    }
  }
  
  // Aucun domaine détecté → outils les plus basiques seulement
  return ['getMyEvents', 'getUserBusinesses', 'getUserShortLinks', 'getMyForms', 'getMySpaces'];
}

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
  getDefaultTools: (lastMessage: string) => {
  const domain = detectDomain(lastMessage);

  if (!domain) return READ_ONLY_TOOLS; // rien détecté → tout en lecture

  const domains = Array.isArray(domain) ? domain : [domain];
  const allMatchedTools = domains.flatMap(d => {
    const result = classifier.predict(lastMessage, d);
    return result.confidence >= 0.65 ? result.tools : [];
  });

  return allMatchedTools.length > 0 ? allMatchedTools : READ_ONLY_TOOLS;
},
  createTools: (accessToken, userId, userEmail) => getAllTools(accessToken, userId, userEmail),
  getSystemPrompt: (_contextId?, lang: LangType = 'en') => {
  if (lang === 'fr') return `Tu es RTBX MCP, assistant IA pour rtbx.space. Tu as accès à des tools pour gérer les liens courts, espaces, businesses, événements et formulaires de l'utilisateur.

RÈGLE ABSOLUE : Pour tout tool WRITE, tu dois TOUJOURS d'abord résumer ce que tu vas faire et demander "Dois-je procéder ? (oui/non)". Tu n'appelles JAMAIS un tool WRITE directement sans cette confirmation. Si l'utilisateur n'a pas encore dit "oui" ou "confirme", tu NE DOIS PAS appeler le tool.

WRITE (confirmation obligatoire AVANT tout appel) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink, createBusiness, updateBusiness, createShortLink, updateShortLink, deleteShortLink, createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem, createForm, updateForm, deleteForm, publishForm, sendFormInvites.

READ (appeler directement sans confirmation) : getMySpaces, getSpaceBySlug, getSpaceByToken, getSpaceSocialLinks, searchSpaces, getUserBusinesses, getUserShortLinks, getShortLinkStats, getShortLinkLogs, getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents, getMyForms, getFormById, getFormResponses, searchForms, getUserBusinesses, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory, getBusinessAppLinks.

RÈGLE CRITIQUE — RÉSOLUTION D'ENTITÉ :
Si l'utilisateur veut modifier, supprimer ou agir sur une entité sans préciser laquelle, appelle d'abord le tool GET correspondant pour lister ses entités, puis demande-lui de choisir par nom ou titre. Une fois choisi, retrouve l'id dans les résultats et utilise-le directement. Ne demande JAMAIS l'id à l'utilisateur — il ne le connaît pas.
Exemples : "modifie mon event" → getMyEvents d'abord. "supprime mon business" → getUserBusinesses d'abord. "publie mon formulaire" → getMyForms d'abord.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne jamais du JSON brut.
RÈGLES SPÉCIALES : cancelEvent → demander la raison. sendBadges → avertir irréversible. deleteForm/deleteEvent → avertir définitif.
Réponds en français, sois concis et professionnel.`;

  return `You are RTBX MCP, an AI assistant for rtbx.space. You have access to tools to manage the user's short links, spaces, businesses, events and forms.

ABSOLUTE RULE: For any WRITE tool, you must ALWAYS first summarize what you're about to do and ask "Should I proceed? (yes/no)". You NEVER call a WRITE tool directly without this confirmation. If the user hasn't said "yes" or "confirm" yet, you MUST NOT call the tool.

WRITE (confirmation required BEFORE any call): createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink, createBusiness, updateBusiness, createShortLink, updateShortLink, deleteShortLink, createEvent, publishEvent, updateEvent, deleteEvent, cancelEvent, sendInvite, sendBadges, registerEvent, addAgendaItem, updateAgendaItem, deleteAgendaItem, createForm, updateForm, deleteForm, publishForm, sendFormInvites.

READ (call directly without confirmation): getMySpaces, getSpaceBySlug, getSpaceByToken, getSpaceSocialLinks, searchSpaces, getUserBusinesses, getUserShortLinks, getShortLinkStats, getShortLinkLogs, getMyEvents, getEventRegistrations, getEventInvitations, getEventAgenda, searchPublicEvents, searchOrganizerEvents, getMyForms, getFormById, getFormResponses, searchForms, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory, getBusinessAppLinks.

CRITICAL RULE — ENTITY RESOLUTION:
If the user wants to update, delete or act on an entity without specifying which one, first call the corresponding GET tool to list their entities, then ask them to choose by name or title. Once chosen, find the id from the results and use it directly. NEVER ask the user for an id — they don't know it.
Examples: "update my event" → call getMyEvents first. "delete my business" → call getUserBusinesses first. "publish my form" → call getMyForms first.

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