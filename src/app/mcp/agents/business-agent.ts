import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createBusinessTools } from '../tools/businesses';

const businessAgentConfig: AgentConfig = {
  name: 'Business',
  writeKeywords: /crée|créer|create|update|modifier|ajouter|add|nouveau|new|change|entreprise|business|société/i,
  readKeywords: /voir|montre|liste|mes business|my business|get my|afficher|chercher|search|quel est|what is|mon entreprise|my company/i,
  writeTools: ['createBusiness', 'updateBusiness'],
  readOnlyTools: ['getUserBusinesses'],
  createTools: (accessToken) => createBusinessTools(accessToken),
  getSystemPrompt: (businessId?) => `Tu es un assistant spécialisé dans la gestion des businesses sur rtbx.space.
${businessId ? `Contexte actuel : Business ID ${businessId}.` : ''}
WRITE (confirmation obligatoire) : createBusiness , updateBusiness .
READ (appeler directement) : getUserBusinesses .
RÈGLES : createBusiness → user_id injecté automatiquement.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en anglais par défaut.`,
};

export async function runBusinessAgent(messages: Message[], options?: AgentOptions & { businessId?: string }) {
  return runAgent(messages, businessAgentConfig, {
    ...options,
    contextId: options?.businessId,
  });
}