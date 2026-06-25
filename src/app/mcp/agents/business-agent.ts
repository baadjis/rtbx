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
  getSystemPrompt: (businessId?, lang: LangType= 'en') => {
    if (lang === 'fr') {
      return `Tu es un assistant spécialisé dans la gestion des businesses sur rtbx.space.
${businessId ? `Contexte actuel : Business ID ${businessId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createBusiness, updateBusiness, upsertBusinessProviderLink, saveBusinessOpeningHours, saveBusinessLoyaltySettings, createBusinessLoyaltyReward, updateBusinessLoyaltyReward, deleteBusinessLoyaltyReward.

READ (appeler directement sans confirmation) : getUserBusinesses, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory.

APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
RÈGLES : deleteBusinessLoyaltyReward → avertir que c'est définitif. createBusiness → user_id injecté automatiquement.
Réponds en français, sois concis.`;
    }

    return `You are an assistant specialized in business management on rtbx.space.
${businessId ? `Current context: Business ID ${businessId}.` : ''}

WRITE (confirmation required before calling): createBusiness, updateBusiness, upsertBusinessProviderLink, saveBusinessOpeningHours, saveBusinessLoyaltySettings, createBusinessLoyaltyReward, updateBusinessLoyaltyReward, deleteBusinessLoyaltyReward.

READ (call directly without confirmation): getUserBusinesses, getBusinessProviderLinks, getBusinessOpeningHours, getBusinessLoyaltySettings, getBusinessLoyaltyRewards, getBusinessLoyaltyHistory.

AFTER each tool: summarize in natural language. NEVER return raw JSON.
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