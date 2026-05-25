// lib/events/categories.ts

import { LangType } from "../lang/types";

// Dans Data.fr et Data.en
const Data={
fr: {
  // ... tes autres traductions ...

  // Catégories d'événements
  cat_sales: "Ventes & Prospection",
  cat_training: "Formation & Atelier",
  cat_networking: "Networking & Rencontre",
  cat_conference: "Conférence",
  cat_party: "Soirée / Événement festif",
  cat_other: "Autre",
},

en: {
  // ... tes autres traductions ...

  cat_sales: "Sales & Prospecting",
  cat_training: "Training & Workshop",
  cat_networking: "Networking & Meetup",
  cat_conference: "Conference",
  cat_party: "Party / Festive Event",
  cat_other: "Other",
},

}
export const eventCategories = [
  { value: 'sales', translationKey: 'cat_sales' },
  { value: 'training', translationKey: 'cat_training' },
  { value: 'networking', translationKey: 'cat_networking' },
  { value: 'conference', translationKey: 'cat_conference' },
  { value: 'party', translationKey: 'cat_party' },
  { value: 'other', translationKey: 'cat_other' },
] as const;

export type EventCategory = typeof eventCategories[number]['value'];

/**
 * Retourne le label traduit selon la langue
 */
export const getEventCategoryLabel = (value: EventCategory, lang: LangType) => {
  const category = eventCategories.find(cat => cat.value === value);
  if (!category) return value;

  const t = Data[lang]; // Data doit être importé
  return t[category.translationKey] || value;
};