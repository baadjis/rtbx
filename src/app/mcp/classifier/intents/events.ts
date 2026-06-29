
// app/mcp/classifier/intents/events.ts
import type { IntentData } from '../core';
import {
  GET_VERBS, CREATE_VERBS, UPDATE_VERBS,
  DELETE_VERBS, SEND_VERBS, ADD_VERBS, PUBLISH_VERBS,
} from './shared-verbs';

const EVENT_PLURIEL = [
  'mes evenements', 'my events', 'mes events', 'events', 'evenements que j organise',
];
const EVENT_SINGULAR = [
  'evenement', 'event', 'masterclass', 'formation', 'conference', 'atelier',
];

export const EVENT_INTENTS: IntentData[] = [
  {
    intent: 'get_my_events',
    action_verbs: GET_VERBS,
    keywords: EVENT_PLURIEL,
    boost_words: ['quels', 'quelles', 'tous', 'tout', 'what', 'liste', 'list'],
    tools: ['getMyEvents'],
  },
  {
    intent: 'get_registrations',
    action_verbs: GET_VERBS,
    keywords: ['inscrits', 'participants', 'registrations', 'inscriptions'],
    boost_words: ['qui', 'combien', 'liste', 'list', 'who'],
    tools: ['getEventRegistrations'],
  },
  {
    intent: 'get_invitations',
    action_verbs: GET_VERBS,
    keywords: ['invitations', 'invites', 'personnes invitees'],
    boost_words: ['qui', 'combien', 'liste', 'tous', 'all'],
    tools: ['getEventInvitations'],
  },
  {
    intent: 'get_agenda',
    action_verbs: GET_VERBS,
    keywords: ['agenda', 'creneaux', 'schedule', 'speakers', 'programme', 'planning'],
    boost_words: ['quel', 'liste', 'tous'],
    tools: ['getEventAgenda'],
  },
  {
    intent: 'search_public_events',
    action_verbs: ['cherche', 'trouve', 'search', 'find', 'recherche'],
    keywords: ['evenements publics', 'public events', 'evenements disponibles'],
    boost_words: ['public', 'disponible', 'near', 'category'],
    tools: ['searchPublicEvents'],
  },
  {
    intent: 'create_event',
    action_verbs: CREATE_VERBS,
    keywords: EVENT_SINGULAR,
    boost_words: ['nouveau', 'nouvelle', 'nouvel', 'new', 'premier'],
    tools: ['createEvent'],
    weight: 3,
  },
  {
    intent: 'add_agenda_item',
    action_verbs: ADD_VERBS,
    keywords: ['creneau', 'session', 'agenda', 'programme', 'schedule'],
    boost_words: ['nouveau', 'new', 'another'],
    tools: ['addAgendaItem'],
  },
  {
    intent: 'update_event',
    action_verbs: UPDATE_VERBS,
    keywords: EVENT_SINGULAR,
    boost_words: ['infos', 'date', 'lieu', 'titre', 'horaire'],
    tools: ['updateEvent'],
  },
  {
    intent: 'update_agenda_item',
    action_verbs: UPDATE_VERBS,
    keywords: ['creneau', 'session', 'agenda'],
    boost_words: ['heure', 'titre', 'speaker', 'salle'],
    tools: ['updateAgendaItem'],
  },
  {
    intent: 'publish_event',
    action_verbs: PUBLISH_VERBS,
    keywords: EVENT_SINGULAR,
    boost_words: ['en ligne', 'public', 'maintenant'],
    tools: ['publishEvent'],
  },
  {
    intent: 'send_badges',
    action_verbs: [...SEND_VERBS, 'generer', 'genere'],
    keywords: ['badges', 'badge', 'attestations'],
    boost_words: ['tous', 'tout', 'participants'],
    tools: ['sendBadges'],
    weight: 3,
  },
  {
    intent: 'send_invite',
    action_verbs: SEND_VERBS,
    keywords: ['invitation', 'invite', 'contact', 'invitations'],
    boost_words: ['email', 'mail', 'par email'],
    tools: ['sendInvite'],
  },
  {
    intent: 'register_event',
    action_verbs: ['inscrire', 'inscription', 'register', 'rejoindre', 'join', 'participer'],
    keywords: EVENT_SINGULAR,
    boost_words: ['moi', 'me', 'je veux', 'i want'],
    tools: ['registerEvent'],
  },
  {
    intent: 'cancel_event',
    action_verbs: ['annuler', 'annule', 'cancel'],
    keywords: EVENT_SINGULAR,
    boost_words: ['raison', 'motif'],
    tools: ['cancelEvent'],
  },
  {
    intent: 'delete_event',
    action_verbs: DELETE_VERBS,
    keywords: [...EVENT_SINGULAR, 'draft', 'brouillon'],
    boost_words: ['definitivement', 'completement'],
    tools: ['deleteEvent'],
  },
  {
    intent: 'delete_agenda_item',
    action_verbs: DELETE_VERBS,
    keywords: ['creneau', 'session', 'agenda'],
    boost_words: ['definitivement'],
    tools: ['deleteAgendaItem'],
  },
];