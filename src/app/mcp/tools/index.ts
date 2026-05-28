/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/tools/index.ts
import * as businessTools from './businesses';
import * as spaceTools from './spaces';
import * as shortenerTools from './shortener';
import * as eventTools from './events'

export const tools = {
  ...businessTools,
  ...spaceTools,
  ...shortenerTools,
  ...eventTools
};

export const getRelevantTools = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMessage.match(/lien|link|short|url|raccourci/)) return shortenerTools;
  if (lastMessage.match(/space|profil|slug|identit/)) return spaceTools;
  if (lastMessage.match(/business|entreprise|société|compan/)) return businessTools;
  if (lastMessage.match(/event|événement|agenda|badge|invit|inscription/)) return eventTools;

  // Par défaut — tools légers seulement
  return Object.values( {
    ...shortenerTools,
    ...spaceTools,
    ...businessTools,
    ...eventTools,
  });
};

export const allTools = Object.values(tools);