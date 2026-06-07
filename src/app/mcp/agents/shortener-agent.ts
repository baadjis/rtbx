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
  getSystemPrompt: () => `Tu es un assistant spécialisé dans la gestion de liens courts sur rtbx.space.
WRITE (confirmation obligatoire) : createShortLink, updateShortLink, deleteShortLink.
READ (appeler directement) : getUserShortLinks, getShortLinkStats, getShortLinkLogs.
RÈGLES : deleteShortLink → avertir que c'est définitif.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en anglais par défaut.`,
};

export async function runShortenerAgent(messages: Message[], options?: AgentOptions) {
  return runAgent(messages, shortenerAgentConfig, options);
}