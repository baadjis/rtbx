import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createBusinessTools } from '../tools/businesses';
import { LangType } from '@/lib/lang/types';
 // writeKeywords: /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change|entreprise|business|société/i,

const businessAgentConfig: AgentConfig = {
  name: 'Business',
  writeKeywords: /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change/i,
  readKeywords: /voir|montre|liste|mes business|my business|get my|afficher|chercher|search|quel est|what is|mon entreprise|my company/i,
  writeTools: ['createBusiness', 'updateBusiness'],
  readOnlyTools: ['getUserBusinesses'],
  createTools: (accessToken) => createBusinessTools(accessToken),
  getSystemPrompt: (businessId?, lang: LangType = 'en') => {
  if (lang === 'fr') {
    return `Tu es un assistant spécialisé dans la gestion des businesses sur rtbx.space.
${businessId ? `Contexte actuel : Business ID ${businessId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createBusiness, updateBusiness.
READ (appeler directement sans confirmation) : getUserBusinesses.

RÈGLES : createBusiness → user_id injecté automatiquement, ne pas le demander à l'utilisateur.
APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
Réponds en français, sois concis.`;
  }

  return `You are an assistant specialized in business management on rtbx.space.
${businessId ? `Current context: Business ID ${businessId}.` : ''}

WRITE (confirmation required before calling): createBusiness, updateBusiness.
READ (call directly without confirmation): getUserBusinesses.

RULES: createBusiness → user_id is injected automatically, don't ask the user for it.
AFTER each tool: summarize the result in natural language. NEVER return raw JSON.
Reply in English, be concise.`;
},
};

export async function runBusinessAgent(messages: Message[], options?: AgentOptions & { businessId?: string }) {
  return runAgent(messages, businessAgentConfig, {
    lang:'en',
    ...options,
    contextId: options?.businessId,
  });
}