// form-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createFormTools } from '../tools/forms';

const formAgentConfig: AgentConfig = {
  name: 'Form',
  writeKeywords: /crée|créer|create|update|modifier|delete|supprimer|publier|publish|invite|envoyer|send|nouveau|new|formulaire|form/i,
  readKeywords: /voir|montre|liste|mes forms|my forms|get my|afficher|chercher|search|réponses|responses|quel est|what is|résultats|results/i,
  writeTools: ['createForm', 'updateForm', 'deleteForm', 'publishForm', 'sendFormInvites'],
  readOnlyTools: ['getMyForms', 'getFormById', 'getFormResponses', 'searchForms'],
  createTools: (accessToken) => createFormTools(accessToken),
 getSystemPrompt: (formId?, lang: 'fr' | 'en' = 'en') => {
  if (lang === 'fr') {
    return `Tu es un assistant spécialisé dans la gestion des formulaires sur rtbx.space.
${formId ? `Contexte actuel : Form ID ${formId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createForm, updateForm, deleteForm, publishForm, sendFormInvites.
READ (appeler directement sans confirmation) : getMyForms, getFormById, getFormResponses, searchForms.

RÈGLES : deleteForm → définitif, supprime toutes les réponses. publishForm → envoie les invitations en attente.
APRÈS chaque tool : résume le résultat en langage naturel. Ne retourne JAMAIS du JSON brut.
Réponds en français, sois concis.`;
  }

  return `You are an assistant specialized in form management on rtbx.space.
${formId ? `Current context: Form ID ${formId}.` : ''}

WRITE (confirmation required before calling): createForm, updateForm, deleteForm, publishForm, sendFormInvites.
READ (call directly without confirmation): getMyForms, getFormById, getFormResponses, searchForms.

RULES: deleteForm → permanent, deletes all responses. publishForm → sends pending invitations.
AFTER each tool: summarize the result in natural language. NEVER return raw JSON.
Reply in English, be concise.`;
},
};

export async function runFormAgent(messages: Message[], options?: AgentOptions & { formId?: string }) {
  return runAgent(messages, formAgentConfig, {
    lang:'en',
    ...options,
    contextId: options?.formId,
  });
}