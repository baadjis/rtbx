// app/mcp/classifier/intents/forms.ts
import type { IntentData } from '../core';
import {
  GET_VERBS, CREATE_VERBS, UPDATE_VERBS,
  DELETE_VERBS, SEND_VERBS, PUBLISH_VERBS, SEARCH_VERBS,
} from './shared-verbs';

const FORM_PLURIEL = [
  'mes formulaires', 'mes forms', 'my forms', 'formulaires que j ai crees', 'forms', 'mes sondages',
];
const FORM_SINGULAR = [
  'formulaire', 'form', 'questionnaire', 'survey', 'sondage', 'enquete','enquête'
];

export const FORM_INTENTS: IntentData[] = [
  {
    intent: 'get_my_forms',
    action_verbs: GET_VERBS,
    keywords: FORM_PLURIEL,
    boost_words: ['quels', 'tous', 'tout', 'what', 'liste', 'list'],
    tools: ['getMyForms'],
  },
  {
    intent: 'get_form_responses',
    action_verbs: GET_VERBS,
    keywords: ['reponses', 'responses', 'answers', 'soumissions', 'personnes qui ont repondu'],
    boost_words: ['du formulaire', 'du form', 'tous', 'all', 'liste', 'id'],
    tools: ['getFormResponses'],
  },
  {
    intent: 'get_form_by_id',
    action_verbs: GET_VERBS,
    keywords: FORM_SINGULAR,
    boost_words: ['avec l id', 'par id', 'specifique', 'details', 'infos'],
    tools: ['getFormById'],
  },
  {
    intent: 'search_forms',
    action_verbs: SEARCH_VERBS,
    keywords: FORM_PLURIEL,
    boost_words: ['public', 'disponible', 'de la societe'],
    tools: ['searchForms'],
  },
  {
    intent: 'create_form',
    action_verbs: CREATE_VERBS,
    keywords: FORM_SINGULAR,
    boost_words: ['nouveau', 'nouvelle', 'nouvel', 'new', 'un autre'],
    tools: ['createForm'],
    weight: 3,
  },
  {
    intent: 'update_form',
    action_verbs: UPDATE_VERBS,
    keywords: FORM_SINGULAR,
    boost_words: ['questions', 'titre', 'mise a jour'],
    tools: ['updateForm'],
  },
  {
    intent: 'publish_form',
    action_verbs: PUBLISH_VERBS,
    keywords: FORM_SINGULAR,
    boost_words: ['en ligne', 'public', 'mise en ligne'],
    tools: ['publishForm'],
  },
  {
    intent: 'send_form_invites',
    action_verbs: SEND_VERBS,
    keywords: ['invitations', 'invite', 'personnes', 'invites', 'diffusion'],
    boost_words: ['email', 'mail', 'par email', 'tous', 'tout'],
    tools: ['sendFormInvites'],
  },
  {
    intent: 'delete_form',
    action_verbs: DELETE_VERBS,
    keywords: FORM_SINGULAR,
    boost_words: ['definitivement', 'completement', 'pour de bon'],
    tools: ['deleteForm'],
  },
];