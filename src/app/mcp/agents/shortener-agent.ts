// shortener-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createShortenerTools } from '../tools/shortener';

const shortenerAgentConfig: AgentConfig = {
  name: 'Shortener',
  writeKeywords: /crée|créer|create|raccourcir|shorten|update|modifier|delete|supprimer|nouveau lien|new link|ajouter|add/i,
  readKeywords: /voir|montre|liste|mes liens|my links|get my|afficher|chercher|search|stats|statistiques|logs|clics|clicks|quel est|what is|combien/i,
  writeTools: ['createShortLink', 'updateShortLink', 'deleteShortLink'],
  readOnlyTools: ['getUserShortLinks', 'getShortLinkStats', 'getShortLinkLogs'],
  createTools: (accessToken) => createShortenerTools(accessToken),
getSystemPrompt: (_contextId?, lang: 'fr' | 'en' = 'en') => {
  if (lang === 'fr') {
    return `Tu es un assistant spécialisé dans la gestion de liens courts sur rtbx.space.

WRITE (confirmation obligatoire avant d'appeler) : createShortLink, updateShortLink, deleteShortLink.
READ (appeler directement sans confirmation) : getUserShortLinks, getShortLinkStats, getShortLinkLogs.

RÈGLES : deleteShortLink → avertir que c'est définitif.
APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
Réponds en français, sois concis.`;
  }

  return `You are an assistant specialized in managing short links on rtbx.space.

WRITE (confirmation required before calling): createShortLink, updateShortLink, deleteShortLink.
READ (call directly without confirmation): getUserShortLinks, getShortLinkStats, getShortLinkLogs.

RULES: deleteShortLink → warn it's permanent.
AFTER each tool: summarize the result in natural language. NEVER return raw JSON.
Reply in English, be concise.`;
},
};


export async function runShortenerAgent(messages: Message[], options?: AgentOptions) {
  return runAgent(messages, shortenerAgentConfig, {
    lang: 'en', // ← default shortener
    ...options,
  });
}