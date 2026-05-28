/* eslint-disable @typescript-eslint/no-explicit-any */
import { createShortenerTools } from './shortener';
import { createSpaceTools } from './spaces';
import { createBusinessTools } from './businesses';
import { createEventTools } from './events';

export const tools = {
  ...createShortenerTools(),
  ...createSpaceTools(),
  ...createBusinessTools(),
  ...createEventTools(),
};

export const getRelevantTools = (messages: any[], accessToken?: string) => {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMessage.match(/lien|link|short|url|raccourci/))
    return createShortenerTools(accessToken);
  if (lastMessage.match(/space|profil|slug|identit/))
    return createSpaceTools(accessToken);
  if (lastMessage.match(/business|entreprise|société|compan/))
    return createBusinessTools(accessToken);
  if (lastMessage.match(/event|événement|agenda|badge|invit|inscription/))
    return createEventTools(accessToken);

  return {
    ...createShortenerTools(accessToken),
    ...createSpaceTools(accessToken),
    ...createBusinessTools(accessToken),
    ...createEventTools(accessToken),
  };
};