// app/mcp/classifier/intents/shortener.ts
import type { IntentData } from '../core';
import { GET_VERBS, CREATE_VERBS, UPDATE_VERBS, DELETE_VERBS } from './shared-verbs';

const SHORTENER_PLURIEL = [
  'mes raccourcis', 'mes short links', 'my short links', 'mes liens courts',
  'raccourcis', 'short links',"shorten links", 'liens courts',
];
const SHORTENER_SINGULAR = [
  'raccourci', 'short link',"shortened link", 'lien court', 'ce raccourci', 'ce lien',
];

export const SHORTENER_INTENTS: IntentData[] = [
  {
    intent: 'get_user_short_links',
    action_verbs: GET_VERBS,
    keywords: SHORTENER_PLURIEL,
    boost_words: ['quels sont', 'la liste', 'tous mes', 'liste', 'list'],
    tools: ['getUserShortLinks'],
  },
  {
    intent: 'get_short_link_stats',
    action_verbs: GET_VERBS,
    keywords: SHORTENER_SINGULAR,
    boost_words: ['statistiques', 'stats', 'clics', 'analytics', 'performance'],
    tools: ['getShortLinkStats'],
  },
  {
    intent: 'get_short_link_logs',
    action_verbs: GET_VERBS,
    keywords: SHORTENER_SINGULAR,
    boost_words: ['logs', 'historique', 'details', 'clics', 'clicks'],
    tools: ['getShortLinkLogs'],
  },
  {
    intent: 'create_short_link',
    action_verbs: [...CREATE_VERBS, 'raccourcir', 'shorten'],
    keywords: [...SHORTENER_SINGULAR, 'url', 'link', 'lien', 'ce lien', 'this link'],
    boost_words: ['nouveau', 'new', 'another'],
    tools: ['createShortLink'],
    weight: 3,
  },
  {
    intent: 'update_short_link',
    action_verbs: UPDATE_VERBS,
    keywords: SHORTENER_SINGULAR,
    boost_words: ['titre', 'description', 'url', 'destination'],
    tools: ['updateShortLink'],
  },
  {
    intent: 'delete_short_link',
    action_verbs: DELETE_VERBS,
    keywords: SHORTENER_SINGULAR,
    boost_words: ['definitivement', 'completement'],
    tools: ['deleteShortLink'],
  },
];