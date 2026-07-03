// shortener-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createShortenerTools } from '../tools/shortener';
import { LangType } from '@/lib/lang/types';

const shortenerAgentConfig: AgentConfig = {
  name: 'Shortener',
  writeKeywords: /crée|créer|create|raccourcir|shorten|update|modifier|delete|supprimer|nouveau lien|new link|ajouter|add/i,
  readKeywords: /voir|montre|liste|mes liens|my links|get my|afficher|chercher|search|stats|statistiques|logs|clics|clicks|quel est|what is|combien/i,
  writeTools: ['createShortLink', 'updateShortLink', 'deleteShortLink'],
  readOnlyTools: ['getUserShortLinks', 'getShortLinkStats', 'getShortLinkLogs'],
  createTools: (accessToken) => createShortenerTools(accessToken),
  getSystemPrompt: (_contextId?, lang: LangType = 'en') => {
  if (lang === 'fr') return `Tu es un assistant spécialisé dans la gestion de liens courts sur rtbx.space.

WRITE (confirmation obligatoire avant d'appeler) : createShortLink, updateShortLink, deleteShortLink.
READ (appeler directement sans confirmation) : getUserShortLinks, getShortLinkStats, getShortLinkLogs.

RÈGLE CRITIQUE — RÉSOLUTION D'ENTITÉ :
Si l'utilisateur veut modifier, supprimer ou voir les stats d'un lien sans préciser lequel, appelle d'abord getUserShortLinks pour lister ses liens, puis demande-lui de choisir par titre ou URL. Une fois choisi, retrouve l'id dans les résultats et utilise-le directement. Ne demande JAMAIS l'id à l'utilisateur.

RÈGLES : deleteShortLink → avertir que c'est définitif.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en français, sois concis.`;

  return `You are an assistant specialized in managing short links on rtbx.space.

WRITE (confirmation required before calling): createShortLink, updateShortLink, deleteShortLink.
READ (call directly without confirmation): getUserShortLinks, getShortLinkStats, getShortLinkLogs.

CRITICAL RULE — ENTITY RESOLUTION:
If the user wants to update, delete or view stats of a link without specifying which one, first call getUserShortLinks to list their links, then ask them to choose by title or URL. Once chosen, find the id from the results and use it directly. NEVER ask the user for an id.

RULES: deleteShortLink → warn it's permanent.
AFTER each tool: summarize in natural language. Never return raw JSON.
Reply in English, be concise.`;
},
};


export async function runShortenerAgent(messages: Message[], options?: AgentOptions) {
  return runAgent(messages, shortenerAgentConfig, {
    lang: 'en', // ← default shortener
    ...options,
  });
}