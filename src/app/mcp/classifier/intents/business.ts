
// app/mcp/classifier/intents/business.ts
import type { IntentData } from '../core';
import {
  GET_VERBS, CREATE_VERBS, UPDATE_VERBS,
  DELETE_VERBS, ADD_VERBS, SEARCH_VERBS,
  SOCIAL_NETWORKS_BOOST, PROVIDER_BOOST,
} from './shared-verbs';

const WORKDAYS=['lundi', 'mardi','mercredi','jeudi','vendredi',
    'samedi','dimanche','monday','tuesday','wensday','thursday','friday','saturday','sunday'
]

const BUSINESS_PLURIEL = [
  'mes business', 'mes businesses', 'my businesses', 'mes commerces',
  'mes boutiques', 'mes entreprises', 'my companies', 'shops', 'my shops',
];
const BUSINESS_SINGULAR = [
  'business', 'commerce', 'boutique', 'shop', 'entreprise',
  'mon business', 'ma boutique', 'mon commerce', 'company',
];
const PROVIDER_LINK_KEYWORDS = [
  'lien provider', 'provider link', 'plateforme', 'lien booking',
  'lien delivery', 'lien review', 'lien marketplace',
];
const APP_LINK_KEYWORDS = [
  'lien app', 'app link', 'application', 'lien application',
];
const OPENING_HOURS_KEYWORDS = [
  'horaires', 'heures d ouverture', 'opening hours', 'heure d ouverture',
];
const LOYALTY_KEYWORDS = [
  'fidelite', 'loyalty', 'programme fidelite', 'points', 'recompenses', 'rewards',
];

export const BUSINESS_INTENTS: IntentData[] = [
  {
    intent: 'get_user_businesses',
    action_verbs: GET_VERBS,
    keywords: BUSINESS_PLURIEL,
    boost_words: ['quels sont', 'la liste', 'tous mes', 'liste', 'list'],
    tools: ['getUserBusinesses'],
  },
  {
    intent: 'get_business_provider_links',
    action_verbs: GET_VERBS,
    keywords: PROVIDER_LINK_KEYWORDS,
    boost_words: ['tous', 'liste', 'list', ...PROVIDER_BOOST],
    tools: ['getBusinessProviderLinks'],
  },
  {
    intent: 'get_business_app_links',
    action_verbs: GET_VERBS,
    keywords: APP_LINK_KEYWORDS,
    boost_words: ['tous', 'liste', 'list', 'mes apps'],
    tools: ['getBusinessAppLinks'],
  },
  {
    intent: 'get_business_opening_hours',
    action_verbs: GET_VERBS,
    keywords: OPENING_HOURS_KEYWORDS,
    boost_words: ['lundi', 'mardi', 'semaine', 'week'],
    tools: ['getBusinessOpeningHours'],
  },
  {
    intent: 'get_business_loyalty_settings',
    action_verbs: GET_VERBS,
    keywords: LOYALTY_KEYWORDS,
    boost_words: ['parametres', 'settings', 'configuration', 'points par visite'],
    tools: ['getBusinessLoyaltySettings'],
  },
  {
    intent: 'get_business_loyalty_rewards',
    action_verbs: GET_VERBS,
    keywords: ['recompenses', 'rewards', 'cadeaux', 'avantages fidelite'],
    boost_words: ['liste', 'list', 'tous', 'all'],
    tools: ['getBusinessLoyaltyRewards'],
  },
  {
    intent: 'get_business_loyalty_history',
    action_verbs: GET_VERBS,
    keywords: ['historique fidelite', 'loyalty history', 'scans', 'derniers scans'],
    boost_words: ['recents', 'recent', 'derniers', 'last'],
    tools: ['getBusinessLoyaltyHistory'],
  },
  {
    intent: 'create_business',
    action_verbs: CREATE_VERBS,
    keywords: BUSINESS_SINGULAR,
    boost_words: ['nouveau', 'nouvelle', 'nouvel', 'new', 'premier'],
    tools: ['createBusiness'],
    weight: 3,
  },
  {
    intent: 'create_business_loyalty_reward',
    action_verbs: [...CREATE_VERBS, ...ADD_VERBS],
    keywords: ['recompense', 'reward', 'cadeau', 'avantage'],
    boost_words: ['points', 'fidelite', 'nouveau', 'new'],
    tools: ['createBusinessLoyaltyReward'],
  },
  {
    intent: 'update_business',
    action_verbs: UPDATE_VERBS,
    keywords: BUSINESS_SINGULAR,
    boost_words: ['nom', 'adresse', 'logo', 'avatar', 'telephone', 'email', 'site'],
    tools: ['updateBusiness'],
  },
  {
    intent: 'upsert_business_provider_link',
    action_verbs: [...ADD_VERBS, ...UPDATE_VERBS],
    keywords: PROVIDER_LINK_KEYWORDS,
    boost_words: PROVIDER_BOOST,
    tools: ['upsertBusinessProviderLink'],
  },
  {
    intent: 'upsert_business_app_link',
    action_verbs: [...ADD_VERBS, ...UPDATE_VERBS],
    keywords: APP_LINK_KEYWORDS,
    boost_words: ['ios', 'android', 'store', 'app store', 'play store'],
    tools: ['upsertBusinessAppLink'],
  },
  {
    intent: 'save_business_opening_hours',
    action_verbs: [...UPDATE_VERBS, 'sauvegarder', 
        'save', 'configurer','configure','configurate','set', 'setup'],
    keywords: OPENING_HOURS_KEYWORDS,
    boost_words: [...WORKDAYS, 'ferme', 'ouvert'],
    tools: ['saveBusinessOpeningHours'],
  },
  {
    intent: 'save_business_loyalty_settings',
    action_verbs: [...UPDATE_VERBS, 'configurer', 'setup', 'activer', 'enable'],
    keywords: LOYALTY_KEYWORDS,
    boost_words: ['points par visite', 'points par euro', 'activer', 'enable'],
    tools: ['saveBusinessLoyaltySettings'],
  },
  {
    intent: 'update_business_loyalty_reward',
    action_verbs: UPDATE_VERBS,
    keywords: ['recompense', 'reward'],
    boost_words: ['points', 'nom', 'description'],
    tools: ['updateBusinessLoyaltyReward'],
  },
  {
    intent: 'delete_business_app_link',
    action_verbs: DELETE_VERBS,
    keywords: APP_LINK_KEYWORDS,
    boost_words: ['ios', 'android', 'app','amazone app store', 'window app store'],
    tools: ['deleteBusinessAppLink'],
  },
  {
    intent: 'delete_business_loyalty_reward',
    action_verbs: DELETE_VERBS,
    keywords: ['recompense', 'reward'],
    boost_words: ['definitivement', 'points'],
    tools: ['deleteBusinessLoyaltyReward'],
  },
  {
    intent: 'add_business_social_link',
    action_verbs: ADD_VERBS,
    keywords: ['lien social', 'social link', 'reseau social'],
    boost_words: ['nouveau', 'new', ...SOCIAL_NETWORKS_BOOST],
    tools: ['addBusinessSocialLink'],
  },
  {
    intent: 'update_business_social_link',
    action_verbs: UPDATE_VERBS,
    keywords: ['lien social', 'social link', 'reseau social'],
    boost_words: SOCIAL_NETWORKS_BOOST,
    tools: ['updateBusinessSocialLink'],
  },
  {
    intent: 'delete_business_social_link',
    action_verbs: DELETE_VERBS,
    keywords: ['lien social', 'social link', 'reseau social'],
    boost_words: SOCIAL_NETWORKS_BOOST,
    tools: ['deleteBusinessSocialLink'],
  },
];