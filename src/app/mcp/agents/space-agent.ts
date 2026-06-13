// space-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createSpaceTools } from '../tools/spaces';
import { LangType } from '@/lib/lang/types';

const spaceAgentConfig: AgentConfig = {
  name: 'Space',
  writeKeywords: /crée|créer|create|update|modifier|supprimer|delete|ajouter|add|nouveau|new|change|social|instagram|tiktok|twitter|linkedin/i,
  readKeywords: /voir|montre|liste|mes spaces|my spaces|get my|afficher|chercher|search|quel est|what is|mon profil|my profile|slug/i,
  writeTools: ['createSpace', 'updateSpace', 'addSpaceSocialLink', 'updateSpaceSocialLink', 'deleteSpaceSocialLink'],
  readOnlyTools: ['getMySpaces', 'getSpaceBySlug', 'getSpaceByToken', 'searchSpaces', 'getSpaceSocialLinks'],
 createTools: (accessToken, userId, userEmail) => createSpaceTools(accessToken, userId, userEmail),
getSystemPrompt: (spaceId?, lang: LangType = 'en') => {
  if (lang === 'fr') {
    return `Tu es un assistant spécialisé dans la gestion des Spaces sur rtbx.space.
${spaceId ? `Contexte actuel : Space ID ${spaceId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.
READ (appeler directement sans confirmation) : getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.

RÈGLES : createSpace → email et user_id injectés automatiquement, ne pas les demander à l'utilisateur. social_data → utiliser addSpaceSocialLink après création.
APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
Réponds en français, sois concis.`;
  }

  return `You are an assistant specialized in managing Spaces (public profiles) on rtbx.space.
${spaceId ? `Current context: Space ID ${spaceId}.` : ''}

WRITE (confirmation required before calling): createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.
READ (call directly without confirmation): getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.

RULES: createSpace → email and user_id are injected automatically, don't ask the user for them. social_data → use addSpaceSocialLink after creation.
AFTER each tool: summarize the result in natural language. NEVER return raw JSON.
Reply in English, be concise.`;
},
};

export async function runSpaceAgent(messages: Message[], options?: AgentOptions & { spaceId?: string }) {
  return runAgent(messages, spaceAgentConfig, {
    lang:'en',
    ...options,
    contextId: options?.spaceId,
  });
}