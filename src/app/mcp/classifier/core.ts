// app/mcp/classifier/classifier.ts
import { normalize, wordMatch, hasNegation } from './normalize';

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

const CONFIRMATION_QUESTIONS: Record<string, string> = {
  // Events
  create_event: 'Tu veux créer un nouvel événement ?',
  update_event: 'Tu veux modifier cet événement ?',
  publish_event: 'Tu veux publier cet événement ?',
  cancel_event: 'Tu veux annuler cet événement ?',
  delete_event: 'Tu veux supprimer définitivement cet événement ?',
  send_badges: 'Tu veux envoyer les badges à tous les participants ?',
  send_invite: 'Tu veux envoyer une invitation ?',
  add_agenda_item: "Tu veux ajouter un créneau à l'agenda ?",
  update_agenda_item: 'Tu veux modifier ce créneau ?',
  delete_agenda_item: "Tu veux supprimer ce créneau de l'agenda ?",
  // Shortener
  create_short_link: 'Tu veux créer un nouveau lien court ?',
  update_short_link: 'Tu veux modifier ce lien court ?',
  delete_short_link: 'Tu veux supprimer ce lien court ?',
  // Forms
  create_form: 'Tu veux créer un nouveau formulaire ?',
  delete_form: 'Tu veux supprimer ce formulaire et toutes ses réponses ?',
  publish_form: 'Tu veux publier ce formulaire ?',
  // Business
  create_business: 'Tu veux créer une nouvelle fiche business ?',
  update_business: 'Tu veux modifier cette fiche business ?',
  delete_business_loyalty_reward: 'Tu veux supprimer cette récompense fidélité ?',
  // Space
  create_space: 'Tu veux créer un nouveau Space ?',
  delete_space: 'Tu veux supprimer ce Space définitivement ?',
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

  predict(message: string, agentName: string, fallbackTools: string[] = []): ClassifyResult {
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
    const confirmationQuestion = needsConfirmation
      ? (CONFIRMATION_QUESTIONS[bestIntent] ?? `Tu veux effectuer : "${message}" ? Confirme-moi s'il te plaît.`)
      : null;

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