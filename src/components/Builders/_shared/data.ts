// components/builders/_shared/data.ts
export const sharedBuilderData = {
  fr: {
    title: "Créateur de Design",
    templates: "Templates",
    toolbar: {
      text: "Texte",
      shape: "Forme",
      image: "Image",
      export: "Exporter",
      templatesBtn: "Templates",
    },
    preview: "Aperçu",
    actions: {
      addText: "Ajouter du texte",
      addRectangle: "Ajouter un rectangle",
    },
  },
  en: {
    title: "Design Builder",
    templates: "Templates",
    toolbar: {
      text: "Text",
      shape: "Shape",
      image: "Image",
      export: "Export",
      templatesBtn: "Templates",
    },
    preview: "Preview",
    actions: {
      addText: "Add text",
      addRectangle: "Add rectangle",
    },
  },
} as const;

export type SharedBuilderData = typeof sharedBuilderData;