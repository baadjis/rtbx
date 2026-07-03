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
  if (lang === 'fr') return `Tu es un assistant spécialisé dans la gestion des Spaces sur rtbx.space.
${spaceId ? `Contexte actuel : Space ID ${spaceId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.
READ (appeler directement sans confirmation) : getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.

RÈGLE CRITIQUE — RÉSOLUTION D'ENTITÉ :
Si l'utilisateur veut modifier, supprimer ou gérer les liens d'un Space sans préciser lequel, appelle d'abord getMySpaces pour lister ses Spaces, puis demande-lui de choisir par nom ou slug. Une fois choisi, retrouve l'id dans les résultats et utilise-le directement. Ne demande JAMAIS l'id à l'utilisateur.
Même logique pour les liens sociaux : si l'utilisateur veut modifier ou supprimer un lien sans préciser lequel, appelle d'abord getSpaceSocialLinks pour lister, puis demande de choisir par réseau social.

RÈGLES : createSpace → email et user_id injectés automatiquement, ne pas les demander. social_data → utiliser addSpaceSocialLink après création.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en français, sois concis.`;

  return `You are an assistant specialized in managing Spaces (public profiles) on rtbx.space.
${spaceId ? `Current context: Space ID ${spaceId}.` : ''}

WRITE (confirmation required before calling): createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.
READ (call directly without confirmation): getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.

CRITICAL RULE — ENTITY RESOLUTION:
If the user wants to update, delete or manage links of a Space without specifying which one, first call getMySpaces to list their Spaces, then ask them to choose by name or slug. Once chosen, find the id from the results and use it directly. NEVER ask the user for an id.
Same logic for social links: if the user wants to update or delete a link without specifying which one, first call getSpaceSocialLinks to list them, then ask to choose by social network.

RULES: createSpace → email and user_id are injected automatically, don't ask the user. social_data → use addSpaceSocialLink after creation.
AFTER each tool: summarize in natural language. Never return raw JSON.
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