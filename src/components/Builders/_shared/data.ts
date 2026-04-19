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
    properties: "Propriétés",
    noSelection: "Aucun élément sélectionné",
    actions: {
      addText: "Ajouter du texte",
      addRectangle: "Ajouter un rectangle",
    },
    delete: "Supprimer",
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
    properties: "Properties",
    noSelection: "No element selected",
    actions: {
      addText: "Add text",
      addRectangle: "Add rectangle",
    },
    delete: "Delete",
  },
} as const;

export type SharedBuilderData = typeof sharedBuilderData;