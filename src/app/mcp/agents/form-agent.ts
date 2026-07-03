// form-agent.ts
import { runAgent, AgentConfig, AgentOptions, Message } from './run-agent';
import { createFormTools } from '../tools/forms';
import { LangType } from '@/lib/lang/types';

const formAgentConfig: AgentConfig = {
  name: 'Form',
  writeKeywords: /crée|créer|create|update|modifier|delete|supprimer|publier|publish|invite|envoyer|send|nouveau|new|formulaire|form/i,
  readKeywords: /voir|montre|liste|mes forms|my forms|get my|afficher|chercher|search|réponses|responses|quel est|what is|résultats|results/i,
  writeTools: ['createForm', 'updateForm', 'deleteForm', 'publishForm', 'sendFormInvites'],
  readOnlyTools: ['getMyForms', 'getFormById', 'getFormResponses', 'searchForms'],
  createTools: (accessToken) => createFormTools(accessToken),
 getSystemPrompt: (formId?, lang: LangType = 'en') => {
  if (lang === 'fr') return `Tu es un assistant spécialisé dans la gestion des formulaires sur rtbx.space.
${formId ? `Contexte actuel : Form ID ${formId}.` : ''}

WRITE (confirmation obligatoire avant d'appeler) : createForm, updateForm, deleteForm, publishForm, sendFormInvites.
READ (appeler directement sans confirmation) : getMyForms, getFormById, getFormResponses, searchForms.

RÈGLE CRITIQUE — RÉSOLUTION D'ENTITÉ :
Si l'utilisateur veut modifier, supprimer, publier ou voir les réponses d'un formulaire sans préciser lequel, appelle d'abord getMyForms pour lister ses formulaires, puis demande-lui de choisir par titre. Une fois choisi, retrouve l'id dans les résultats et utilise-le directement. Ne demande JAMAIS l'id à l'utilisateur.

RÈGLES : deleteForm → définitif, supprime toutes les réponses. publishForm → envoie les invitations en attente.
APRÈS chaque tool : résume en langage naturel. Jamais de JSON brut.
Réponds en français, sois concis.`;

  return `You are an assistant specialized in form management on rtbx.space.
${formId ? `Current context: Form ID ${formId}.` : ''}

WRITE (confirmation required before calling): createForm, updateForm, deleteForm, publishForm, sendFormInvites.
READ (call directly without confirmation): getMyForms, getFormById, getFormResponses, searchForms.

CRITICAL RULE — ENTITY RESOLUTION:
If the user wants to update, delete, publish or view responses of a form without specifying which one, first call getMyForms to list their forms, then ask them to choose by title. Once chosen, find the id from the results and use it directly. NEVER ask the user for an id.

RULES: deleteForm → permanent, deletes all responses. publishForm → sends pending invitations.
AFTER each tool: summarize in natural language. Never return raw JSON.
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