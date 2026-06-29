
// app/mcp/classifier/index.ts
// Instance globale du classifier — initialisée une seule fois au démarrage

import { LightIntentClassifier } from './core';
import { EVENT_INTENTS } from './intents/events';
import { SHORTENER_INTENTS } from './intents/shortener';
import { SPACES_INTENTS } from './intents/spaces';
import { FORM_INTENTS } from './intents/forms';
import { BUSINESS_INTENTS } from './intents/business';

export const classifier = new LightIntentClassifier();

classifier.addAgent('event', EVENT_INTENTS);
classifier.addAgent('shortener', SHORTENER_INTENTS);
classifier.addAgent('space', SPACES_INTENTS);
classifier.addAgent('form', FORM_INTENTS);
classifier.addAgent('business', BUSINESS_INTENTS);

export { LightIntentClassifier } from './core';
export type { ClassifyResult, IntentData } from './core';

