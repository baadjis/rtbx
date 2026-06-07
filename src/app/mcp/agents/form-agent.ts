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
  getSystemPrompt: (formId?) => `Tu es un assistant spécialisé dans la gestion des formulaires sur rtbx.space.
${formId ? `Contexte actuel : Form ID ${formId}.` : ''}
WRITE (confirmation obligatoire) : createForm, updateForm, deleteForm, publishForm, sendFormInvites.
READ (appeler directement) : getMyForms, getFormById, getFormResponses, searchForms.
RÈGLES : deleteForm → définitif, supprime toutes les réponses. publishForm → envoie les invitations en attente.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en anglais par défaut.`,
};

export async function runFormAgent(messages: Message[], options?: AgentOptions & { formId?: string }) {
  return runAgent(messages, formAgentConfig, {
    ...options,
    contextId: options?.formId,
  });
}