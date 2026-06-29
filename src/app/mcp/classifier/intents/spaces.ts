
// app/mcp/classifier/intents/spaces.ts
import type { IntentData } from '../core';
import {
  GET_VERBS, CREATE_VERBS, UPDATE_VERBS,
  DELETE_VERBS, ADD_VERBS, SEARCH_VERBS, SOCIAL_NETWORKS_BOOST,
} from './shared-verbs';

const SPACES_PLURIEL = [
  'mes spaces', 'my spaces', 'mes espaces', 'espaces que j ai', 'mes profils', 'profiles', 'spaces',
];
const SPACE_SINGULAR = [
  'space', 'espace', 'profil', 'mon space', 'mon espace', 'my space', 'ce space',
];
const SOCIAL_LINKS_PLURIEL = [
  'social links', 'liens sociaux', 'reseaux', 'socials', 'mes liens', 'mes reseaux',
];
const SOCIAL_LINK_SINGULAR = ['lien', 'link', 'reseau','réseau','rèseau', 'social', 'url'];

export const SPACES_INTENTS: IntentData[] = [
  {
    intent: 'get_my_spaces',
    action_verbs: GET_VERBS,
    keywords: SPACES_PLURIEL,
    boost_words: ['quels sont', 'liste', 'list', 'tous', 'all', 'what'],
    tools: ['getMySpaces'],
  },
  {
    intent: 'get_space_social_links',
    action_verbs: GET_VERBS,
    keywords: SOCIAL_LINKS_PLURIEL,
    boost_words: ['quels sont', 'liste', 'list', 'mes liens', 'tous', 'all'],
    tools: ['getSpaceSocialLinks'],
  },
  {
    intent: 'search_spaces',
    action_verbs: SEARCH_VERBS,
    keywords: SPACES_PLURIEL,
    boost_words: ['public', 'disponible', 'organisation'],
    tools: ['searchSpaces'],
  },
  {
    intent: 'get_space_by_slug',
    action_verbs: GET_VERBS,
    keywords: SPACE_SINGULAR,
    boost_words: ['slug', 'details', 'par nom', 'with slug'],
    tools: ['getSpaceBySlug'],
  },
  {
    intent: 'create_space',
    action_verbs: CREATE_VERBS,
    keywords: SPACE_SINGULAR,
    boost_words: ['nouveau', 'new', 'another'],
    tools: ['createSpace'],
    weight: 3,
  },
  {
    intent: 'add_space_social_link',
    action_verbs: ADD_VERBS,
    keywords: SOCIAL_LINK_SINGULAR,
    boost_words: ['nouveau', 'new', 'another', ...SOCIAL_NETWORKS_BOOST],
    tools: ['addSpaceSocialLink'],
  },
  {
    intent: 'update_space',
    action_verbs: UPDATE_VERBS,
    keywords: SPACE_SINGULAR,
    boost_words: ['couleur', 'color', 'avatar', 'logo', 'theme', 'nom', 'username'],
    tools: ['updateSpace'],
  },
  {
    intent: 'update_space_social_link',
    action_verbs: UPDATE_VERBS,
    keywords: SOCIAL_LINK_SINGULAR,
    boost_words: ['nom', 'username', ...SOCIAL_NETWORKS_BOOST],
    tools: ['updateSpaceSocialLink'],
  },
  {
    intent: 'delete_space',
    action_verbs: DELETE_VERBS,
    keywords: SPACE_SINGULAR,
    boost_words: ['definitivement', 'completement'],
    tools: ['deleteSpace'],
  },
  {
    intent: 'delete_space_social_link',
    action_verbs: DELETE_VERBS,
    keywords: SOCIAL_LINK_SINGULAR,
    boost_words: ['definitivement', ...SOCIAL_NETWORKS_BOOST],
    tools: ['deleteSpaceSocialLink'],
  },
];