// components/builders/flyer/data.ts
export const flyerData = {
  fr: {
    title: "Créateur de Flyer",
    description: "Concevez vos flyers professionnels rapidement",
    templatesSection: "Templates disponibles",
  },
  en: {
    title: "Flyer Builder",
    description: "Create professional flyers quickly",
    templatesSection: "Available Templates",
  },
} as const;

export type FlyerData = typeof flyerData;