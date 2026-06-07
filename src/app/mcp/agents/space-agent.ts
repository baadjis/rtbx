// space-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createSpaceTools } from '../tools/spaces';

const spaceAgentConfig: AgentConfig = {
  name: 'Space',
  writeKeywords: /crée|créer|create|update|modifier|supprimer|delete|ajouter|add|nouveau|new|change|social|instagram|tiktok|twitter|linkedin/i,
  readKeywords: /voir|montre|liste|mes spaces|my spaces|get my|afficher|chercher|search|quel est|what is|mon profil|my profile|slug/i,
  writeTools: ['createSpace', 'updateSpace', 'addSpaceSocialLink', 'updateSpaceSocialLink', 'deleteSpaceSocialLink'],
  readOnlyTools: ['getMySpaces', 'getSpaceBySlug', 'getSpaceByToken', 'searchSpaces', 'getSpaceSocialLinks'],
  createTools: (accessToken, userId, userEmail) => createSpaceTools(accessToken, userId, userEmail),
  getSystemPrompt: (spaceId?) => `Tu es un assistant spécialisé dans la gestion des Spaces sur rtbx.space.
${spaceId ? `Contexte actuel : Space ID ${spaceId}.` : ''}
WRITE (confirmation obligatoire) : createSpace, updateSpace, addSpaceSocialLink, updateSpaceSocialLink, deleteSpaceSocialLink.
READ (appeler directement) : getMySpaces, getSpaceBySlug, getSpaceByToken, searchSpaces, getSpaceSocialLinks.
RÈGLES : createSpace → email et user_id injectés automatiquement.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en anglais par défaut.`,
};

export async function runSpaceAgent(messages: Message[], options?: AgentOptions & { spaceId?: string }) {
  return runAgent(messages, spaceAgentConfig, {
    ...options,
    contextId: options?.spaceId,
  });
}