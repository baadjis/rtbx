export const EVENT_EXAMPLES = [
  {
    id: "get_my_events",
    intent: "get_my_events",
    examples: [
      "montre-moi mes événements", "quels sont mes événements", "liste mes événements",
      "mes events", "my events", "show my events", "événements que j'organise",
      "je veux voir mes events"
    ],
    tools: ["getMyEvents"]
  },
  {
    id: "search_public_events",
    intent: "search_public_events",
    examples: [
      "cherche des événements", "trouve un événement", "événements à Paris",
      "events près de moi", "masterclass", "formations disponibles", "search events"
    ],
    tools: ["searchPublicEvents"]
  },
  {
    id: "search_organizer_events",
    intent: "search_organizer_events",
    examples: [
      "recherche dans mes événements", "filtrer mes events", "mes événements organisés",
      "search my events", "mes events en brouillon"
    ],
    tools: ["searchOrganizerEvents"]
  },
  {
    id: "create_event",
    intent: "create_event",
    examples: [
      "créer un nouvel événement", "je veux créer un event", "nouveau événement",
      "organiser une masterclass", "create new event", "commencer la création"
    ],
    tools: ["createEvent"]
  },
  {
    id: "update_event",
    intent: "update_event",
    examples: [
      "modifier un événement", "update event", "changer la date", "éditer l'événement",
      "mettre à jour les infos", "modifier le titre"
    ],
    tools: ["updateEvent"]
  },
  {
    id: "publish_event",
    intent: "publish_event",
    examples: [
      "publier l'événement", "publish event", "rendre public", "mettre en ligne",
      "publier maintenant"
    ],
    tools: ["publishEvent"]
  },
  {
    id: "delete_event",
    intent: "delete_event",
    examples: [
      "supprimer l'événement", "delete event", "effacer définitivement",
      "supprimer ce draft"
    ],
    tools: ["deleteEvent"]
  },
  {
    id: "cancel_event",
    intent: "cancel_event",
    examples: [
      "annuler l'événement", "cancel event", "annuler la masterclass",
      "annulation", "je veux annuler"
    ],
    tools: ["cancelEvent"]
  },
  {
    id: "send_invite",
    intent: "send_invite",
    examples: [
      "envoyer une invitation", "inviter quelqu'un", "send invite",
      "invitation par email", "envoyer des invitations", "inviter des participants"
    ],
    tools: ["sendInvite"]
  },
  {
    id: "send_badges",
    intent: "send_badges",
    examples: [
      "envoyer les badges", "send badges", "envoyer les badges aux participants",
      "générer et envoyer les badges", "badges pour les inscrits",
      "je veux envoyer les attestations"
    ],
    tools: ["sendBadges"]
  },
  {
    id: "register_event",
    intent: "register_event",
    examples: [
      "s'inscrire à l'événement", "je veux m'inscrire", "register",
      "inscription participant", "register to event"
    ],
    tools: ["registerEvent"]
  },
  {
    id: "get_registrations",
    intent: "get_registrations",
    examples: [
      "qui est inscrit", "liste des participants", "voir les inscriptions",
      "registrations", "combien de personnes", "liste des inscrits"
    ],
    tools: ["getEventRegistrations"]
  },
  {
    id: "get_invitations",
    intent: "get_invitations",
    examples: [
      "voir les invitations", "liste des invitations envoyées",
      "invitations en cours", "qui a été invité"
    ],
    tools: ["getEventInvitations"]
  },
  {
    id: "get_agenda",
    intent: "get_agenda",
    examples: [
      "voir l'agenda", "programme de l'événement", "horaires",
      "quoi au programme", "agenda détaillé"
    ],
    tools: ["getEventAgenda"]
  },
  {
    id: "add_agenda_item",
    intent: "add_agenda_item",
    examples: [
      "ajouter un créneau", "ajouter au programme", "nouvelle session",
      "add agenda item", "programmer un speaker"
    ],
    tools: ["addAgendaItem"]
  },
  {
    id: "update_agenda_item",
    intent: "update_agenda_item",
    examples: [
      "modifier un créneau", "update agenda item", "changer l'horaire",
      "modifier une session"
    ],
    tools: ["updateAgendaItem"]
  },
  {
    id: "delete_agenda_item",
    intent: "delete_agenda_item",
    examples: [
      "supprimer un créneau", "enlever du programme", "delete agenda item"
    ],
    tools: ["deleteAgendaItem"]
  }
];