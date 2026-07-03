import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createBusinessTools } from '../tools/businesses';
import { LangType } from '@/lib/lang/types';
 // writeKeywords: /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change|entreprise|business|société/i,
const READ_ONLY_TOOLS = [
  'getUserBusinesses',
  'getBusinessProviderLinks',
  'getBusinessOpeningHours',
  'getBusinessLoyaltySettings',
  'getBusinessLoyaltyRewards',
  'getBusinessLoyaltyHistory',
  
'getBusinessAppLinks',


];

const WRITE_TOOLS = [
  'createBusiness',
  'updateBusiness',
  'upsertBusinessProviderLink',
  'saveBusinessOpeningHours',
  'saveBusinessLoyaltySettings',
  'createBusinessLoyaltyReward',
  'updateBusinessLoyaltyReward',
  'deleteBusinessLoyaltyReward',
 
'upsertBusinessAppLink',
'deleteBusinessAppLink',
];

const WRITE_KEYWORDS = /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change|supprimer|delete|save|sauvegarder|configurer|setup|activer|enable/i;
const READ_KEYWORDS = /voir|montre|liste|mes business|my business|get my|afficher|chercher|search|horaires|opening|providers|fidélité|loyalty|récompenses|rewards|historique|history/i;

const businessAgentConfig: AgentConfig = {
  name: 'Business',
  writeKeywords: WRITE_KEYWORDS,
  readKeywords: READ_KEYWORDS,
  writeTools: WRITE_TOOLS,
  readOnlyTools: READ_ONLY_TOOLS,
  createTools: (accessToken) => createBusinessTools(accessToken),
 getSystemPrompt: (businessId?, lang: LangType = 'en') => {
  if (lang === 'fr') return `Tu es un assistant spécialisé dans la gestion des businesses sur rtbx.space.
${businessId ? `Contexte actuel : Business ID ${businessId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createBusiness, updateBusiness, upsertBusinessProviderLink, saveBusinessOpeningHours, saveBusinessLoyaltySettings, createBusinessLoyaltyReward, updateBusinessLoyaltyReward, deleteBusinessLoyaltyReward, upsertBusinessAppLink, deleteBusinessAppLink.
READ (appeler directement sans confirmation) : getUserBusinesses, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory, getBusinessAppLinks.

RÈGLE CRITIQUE — RÉSOLUTION D'ENTITÉ :
Si l'utilisateur veut modifier, supprimer ou agir sur un business sans préciser lequel, appelle d'abord getUserBusinesses pour lister ses businesses, puis demande-lui de choisir par nom. Une fois choisi, retrouve l'id dans les résultats et utilise-le directement. Ne demande JAMAIS l'id à l'utilisateur.
Même logique pour les sous-entités : si l'utilisateur veut modifier une récompense ou un provider sans préciser lequel, appelle d'abord le GET correspondant (getBusinessLoyaltyRewards, getBusinessProviderLinks) pour lister, puis demande de choisir par nom.

APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
RÈGLES : deleteBusinessLoyaltyReward → avertir que c'est définitif. createBusiness → user_id injecté automatiquement.
Réponds en français, sois concis.`;

  return `You are an assistant specialized in business management on rtbx.space.
${businessId ? `Current context: Business ID ${businessId}.` : ''}

WRITE (confirmation required before calling): createBusiness, updateBusiness, upsertBusinessProviderLink, saveBusinessOpeningHours, saveBusinessLoyaltySettings, createBusinessLoyaltyReward, updateBusinessLoyaltyReward, deleteBusinessLoyaltyReward, upsertBusinessAppLink, deleteBusinessAppLink.
READ (call directly without confirmation): getUserBusinesses, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory, getBusinessAppLinks.

CRITICAL RULE — ENTITY RESOLUTION:
If the user wants to update, delete or act on a business without specifying which one, first call getUserBusinesses to list their businesses, then ask them to choose by name. Once chosen, find the id from the results and use it directly. NEVER ask the user for an id.
Same logic for sub-entities: if the user wants to update a reward or provider without specifying which one, first call the corresponding GET (getBusinessLoyaltyRewards, getBusinessProviderLinks) to list them, then ask to choose by name.

AFTER each tool: summarize in natural language. Never return raw JSON.
RULES: deleteBusinessLoyaltyReward → warn it's permanent. createBusiness → user_id injected automatically.
Reply in English, be concise.`;
},
};

export async function runBusinessAgent(messages: Message[], options?: AgentOptions & { businessId?: string }) {
  return runAgent(messages, businessAgentConfig, {
    lang: 'en',
    ...options,
    contextId: options?.businessId,
  });
}