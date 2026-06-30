// app/mcp/classifier/core.ts
import { normalize, wordMatch, hasNegation } from './normalize';
import type { LangType } from '@/lib/lang/types';

export type IntentData = {
  intent: string;
  action_verbs: string[];
  keywords: string[];
  boost_words: string[];
  tools: string[];
  weight?: number;
};

export type ClassifyResult = {
  intent: string;
  tools: string[];
  confidence: number;
  raw_score: number;
  needs_confirmation: boolean;
  confirmation_question: string | null;
};

const MAX_SCORE = 19.3;
const CONFIDENCE_THRESHOLD = 0.65;

// Confirmations bilingues — étendre ici quand on ajoute une langue
const CONFIRMATION_QUESTIONS: Record<string, Record<LangType, string>> = {
  // Events
  create_event: { fr: 'Tu veux créer un nouvel événement ?', en: 'Do you want to create a new event?' },
  update_event: { fr: 'Tu veux modifier cet événement ?', en: 'Do you want to update this event?' },
  publish_event: { fr: 'Tu veux publier cet événement ?', en: 'Do you want to publish this event?' },
  cancel_event: { fr: 'Tu veux annuler cet événement ?', en: 'Do you want to cancel this event?' },
  delete_event: { fr: 'Tu veux supprimer définitivement cet événement ?', en: 'Do you want to permanently delete this event?' },
  send_badges: { fr: 'Tu veux envoyer les badges à tous les participants ?', en: 'Do you want to send badges to all participants?' },
  send_invite: { fr: 'Tu veux envoyer une invitation ?', en: 'Do you want to send an invitation?' },
  add_agenda_item: { fr: "Tu veux ajouter un créneau à l'agenda ?", en: 'Do you want to add a slot to the agenda?' },
  update_agenda_item: { fr: 'Tu veux modifier ce créneau ?', en: 'Do you want to update this slot?' },
  delete_agenda_item: { fr: "Tu veux supprimer ce créneau de l'agenda ?", en: 'Do you want to delete this slot from the agenda?' },
  register_event: { fr: 'Tu veux t\'inscrire à cet événement ?', en: 'Do you want to register for this event?' },

  // Shortener
  create_short_link: { fr: 'Tu veux créer un nouveau lien court ?', en: 'Do you want to create a new short link?' },
  update_short_link: { fr: 'Tu veux modifier ce lien court ?', en: 'Do you want to update this short link?' },
  delete_short_link: { fr: 'Tu veux supprimer ce lien court ?', en: 'Do you want to delete this short link?' },

  // Forms
  create_form: { fr: 'Tu veux créer un nouveau formulaire ?', en: 'Do you want to create a new form?' },
  update_form: { fr: 'Tu veux modifier ce formulaire ?', en: 'Do you want to update this form?' },
  delete_form: { fr: 'Tu veux supprimer ce formulaire et toutes ses réponses ?', en: 'Do you want to delete this form and all its responses?' },
  publish_form: { fr: 'Tu veux publier ce formulaire ?', en: 'Do you want to publish this form?' },
  send_form_invites: { fr: 'Tu veux envoyer ce formulaire par email ?', en: 'Do you want to send this form by email?' },

  // Business
  create_business: { fr: 'Tu veux créer une nouvelle fiche business ?', en: 'Do you want to create a new business?' },
  update_business: { fr: 'Tu veux modifier cette fiche business ?', en: 'Do you want to update this business?' },
  upsert_business_provider_link: { fr: 'Tu veux enregistrer ce lien provider ?', en: 'Do you want to save this provider link?' },
  upsert_business_app_link: { fr: 'Tu veux enregistrer ce lien app ?', en: 'Do you want to save this app link?' },
  save_business_opening_hours: { fr: 'Tu veux enregistrer ces horaires ?', en: 'Do you want to save these opening hours?' },
  save_business_loyalty_settings: { fr: 'Tu veux enregistrer ces paramètres de fidélité ?', en: 'Do you want to save these loyalty settings?' },
  create_business_loyalty_reward: { fr: 'Tu veux créer cette récompense fidélité ?', en: 'Do you want to create this loyalty reward?' },
  update_business_loyalty_reward: { fr: 'Tu veux modifier cette récompense ?', en: 'Do you want to update this reward?' },
  delete_business_loyalty_reward: { fr: 'Tu veux supprimer cette récompense fidélité ?', en: 'Do you want to delete this loyalty reward?' },
  delete_business_app_link: { fr: 'Tu veux supprimer ce lien app ?', en: 'Do you want to delete this app link?' },

  // Spaces
  create_space: { fr: 'Tu veux créer un nouveau Space ?', en: 'Do you want to create a new Space?' },
  update_space: { fr: 'Tu veux modifier ce Space ?', en: 'Do you want to update this Space?' },
  delete_space: { fr: 'Tu veux supprimer ce Space définitivement ?', en: 'Do you want to permanently delete this Space?' },
  add_space_social_link: { fr: 'Tu veux ajouter ce lien social ?', en: 'Do you want to add this social link?' },
  update_space_social_link: { fr: 'Tu veux modifier ce lien social ?', en: 'Do you want to update this social link?' },
  delete_space_social_link: { fr: 'Tu veux supprimer ce lien social ?', en: 'Do you want to delete this social link?' },
};

const DEFAULT_CONFIRMATION: Record<LangType, (msg: string) => string> = {
  fr: (msg) => `Tu veux effectuer : "${msg}" ? Confirme-moi s'il te plaît.`,
  en: (msg) => `Do you want to do: "${msg}"? Please confirm.`,
};

function scoreIntent(intent: IntentData, text: string): number {
  const verbMatch = intent.action_verbs.some(
    v => wordMatch(v, text) && !hasNegation(text, v)
  );
  const keywordMatch = intent.keywords.some(k => wordMatch(k, text));
  const boostMatch = intent.boost_words.some(b => wordMatch(b, text));

  let score = 0;
  if (verbMatch)    score += 3.8;
  if (keywordMatch) score += 2.2;
  if (boostMatch)   score += 2.8;

  if (verbMatch && (keywordMatch || boostMatch)) score += 7.0;
  if (verbMatch && keywordMatch)                  score += 3.5;

  return Math.round(score * 100) / 100;
}

export class LightIntentClassifier {
  private agents: Map<string, IntentData[]> = new Map();

  addAgent(agentName: string, intents: IntentData[]): void {
    this.agents.set(agentName, intents);
    console.log(`✅ Classifier: ${intents.length} intents chargés pour "${agentName}"`);
  }

  predict(
    message: string,
    agentName: string,
    fallbackTools: string[] = [],
    lang: LangType = 'fr',
  ): ClassifyResult {
    const intents = this.agents.get(agentName);

    if (!intents) {
      return {
        intent: 'unknown',
        tools: fallbackTools,
        confidence: 0.3,
        raw_score: 0,
        needs_confirmation: false,
        confirmation_question: null,
      };
    }

    const text = normalize(message);
    let bestScore = -1;
    let bestIntent = 'unknown';
    let bestTools = fallbackTools;

    for (const intentData of intents) {
      const score = scoreIntent(intentData, text);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intentData.intent;
        bestTools = intentData.tools;
      }
    }

    const confidence = bestScore > 0
      ? Math.min(0.97, Math.round((bestScore / MAX_SCORE) * 1000) / 1000)
      : 0.3;

    const needsConfirmation = confidence < CONFIDENCE_THRESHOLD;

    let confirmationQuestion: string | null = null;
    if (needsConfirmation) {
      const q = CONFIRMATION_QUESTIONS[bestIntent];
      confirmationQuestion = q
        ? q[lang]
        : DEFAULT_CONFIRMATION[lang](message);
    }

    return {
      intent: bestIntent,
      tools: bestTools,
      confidence,
      raw_score: bestScore,
      needs_confirmation: needsConfirmation,
      confirmation_question: confirmationQuestion,
    };
  }

  agentsList(): string[] {
    return Array.from(this.agents.keys());
  }

  stats(): Record<string, number> {
    const result: Record<string, number> = {};
    this.agents.forEach((intents, name) => { result[name] = intents.length; });
    return result;
  }
}