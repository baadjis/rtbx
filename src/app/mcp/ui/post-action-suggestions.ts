// app/mcp/ui/post-action-suggestions.ts
import type { LangType } from '@/lib/lang/types';

type SuggestionMap = Record<string, Record<LangType, string[]>>;

export const POST_ACTION_SUGGESTIONS: SuggestionMap = {
  // =====================================================
  // BUSINESS
  // =====================================================
  createBusiness: {
    fr: ['Ajouter des liens providers', 'Configurer les horaires', 'Programme fidélité', 'Ajouter un lien app'],
    en: ['Add providers', 'Set opening hours', 'Loyalty program', 'Add app link'],
  },
  updateBusiness: {
    fr: ['Ajouter des liens providers', 'Voir mes business', 'Configurer les horaires'],
    en: ['Add providers links', 'View my businesses', 'Set opening hours'],
  },
  upsertBusinessProviderLink: {
    fr: ['Ajouter un autre lien provider', 'Voir tous les liens providers', 'Configurer les horaires'],
    en: ['Add another provider', 'View all providers', 'Set opening hours'],
  },
  upsertBusinessAppLink: {
    fr: ['Ajouter un autre lien app', 'Voir tous les liens app'],
    en: ['Add another app link', 'View all app links'],
  },
  saveBusinessOpeningHours: {
    fr: ['Configurer le programme de  fidélité', 'Ajouter des providers', 'Voir mes business'],
    en: ['Setup loyalty', 'Add providers', 'View my businesses'],
  },
  saveBusinessLoyaltySettings: {
    fr: ['Créer une récompense', 'Voir toutes les récompenses', "Voir l'historique"],
    en: ['Create a reward', 'View all rewards', 'View history'],
  },
  createBusinessLoyaltyReward: {
    fr: ['Créer une autre récompense', 'Voir toutes les récompenses', 'Configurer la fidélité'],
    en: ['Create another reward', 'View all rewards', 'Setup loyalty'],
  },
  updateBusinessLoyaltyReward: {
    fr: ['Voir toutes les récompenses', "Voir l'historique fidélité"],
    en: ['View all rewards', 'View loyalty history'],
  },

  // =====================================================
  // EVENTS
  // =====================================================
  createEvent: {
    fr: ["Publier l'événement", 'Ajouter un créneau agenda', 'Envoyer des invitations'],
    en: ['Publish the event', 'Add agenda slot', 'Send invitations'],
  },
  updateEvent: {
    fr: ["Publier l'événement", 'Voir les participants', "Voir l'agenda"],
    en: ['Publish the event', 'View participants', 'View agenda'],
  },
  publishEvent: {
    fr: ['Envoyer les invitations', 'Voir les participants', "Partager l'événement"],
    en: ['Send invitations', 'View participants', 'Share the event'],
  },
  addAgendaItem: {
    fr: ['Ajouter un autre créneau', "Publier l'événement", 'Envoyer des invitations'],
    en: ['Add another slot', 'Publish the event', 'Send invitations'],
  },
  sendInvite: {
    fr: ['Voir les invitations', 'Voir les participants', 'Envoyer les badges'],
    en: ['View invitations', 'View participants', 'Send badges'],
  },
  sendBadges: {
    fr: ['Voir les participants', 'Voir les invitations'],
    en: ['View participants', 'View invitations'],
  },

  // =====================================================
  // FORMS
  // =====================================================
  createForm: {
    fr: ['Publier le formulaire', 'Ajouter des questions', 'Envoyer par email'],
    en: ['Publish the form', 'Add questions', 'Send by email'],
  },
  updateForm: {
    fr: ['Publier le formulaire', 'Voir les réponses', 'Envoyer par email'],
    en: ['Publish the form', 'View responses', 'Send by email'],
  },
  publishForm: {
    fr: ['Envoyer les invitations', 'Voir le lien public', 'Voir les réponses'],
    en: ['Send invitations', 'View public link', 'View responses'],
  },
  sendFormInvites: {
    fr: ['Voir les réponses', 'Voir les invitations'],
    en: ['View responses', 'View invitations'],
  },

  // =====================================================
  // SPACES
  // =====================================================
  createSpace: {
    fr: ['Ajouter des liens sociaux', "Changer l'avatar", 'Voir mon profil public'],
    en: ['Add social links', 'Change avatar', 'View my public profile'],
  },
  updateSpace: {
    fr: ['Ajouter des liens sociaux', 'Voir mon profil public'],
    en: ['Add social links', 'View my public profile'],
  },
  addSpaceSocialLink: {
    fr: ['Ajouter un autre lien', 'Voir tous mes liens', 'Voir mon profil public'],
    en: ['Add another link', 'View all my links', 'View my public profile'],
  },
  updateSpaceSocialLink: {
    fr: ['Voir tous mes liens', 'Voir mon profil public'],
    en: ['View all my links', 'View my public profile'],
  },

  // =====================================================
  // SHORTENER
  // =====================================================
  createShortLink: {
    fr: ['Voir les statistiques', 'Créer un autre lien', 'Voir tous mes liens'],
    en: ['View statistics', 'Create another link', 'View all my links'],
  },
  updateShortLink: {
    fr: ['Voir les statistiques', 'Voir tous mes liens'],
    en: ['View statistics', 'View all my links'],
  },
};

export function getPostActionSuggestions(
  toolNames: string[],
  lang: LangType,
  max = 4,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tool of toolNames) {
    const suggestions = POST_ACTION_SUGGESTIONS[tool]?.[lang] ?? [];
    for (const s of suggestions) {
      if (!seen.has(s) && result.length < max) {
        seen.add(s);
        result.push(s);
      }
    }
  }

  return result;
}