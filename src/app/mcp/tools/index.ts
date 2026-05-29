/* eslint-disable @typescript-eslint/no-explicit-any */
import { createShortenerTools } from './shortener';
import { createSpaceTools } from './spaces';
import { createBusinessTools } from './businesses';
import { createEventTools } from './events';
import { createFormTools } from './forms';

export const tools = {
  ...createShortenerTools(),
  ...createSpaceTools(),
  ...createBusinessTools(),
  ...createEventTools(),
  ...createFormTools(),
};

export const getRelevantTools = (
  messages: any[],
  accessToken?: string,
  userId?: string
) => {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMessage.match(/lien|link|short|url|raccourci/))
    return createShortenerTools(accessToken);
  if (lastMessage.match(/space|profil|slug|identit/))
    return createSpaceTools(accessToken, userId);
  if (lastMessage.match(/business|entreprise|société|compan/))
    return createBusinessTools(accessToken);
  if (lastMessage.match(/event|événement|agenda|badge|invit|inscription/))
    return createEventTools(accessToken);
  if (lastMessage.match(/form|formulaire|sondage|survey|réponse|response/))
    return createFormTools(accessToken);

  return {
    ...createShortenerTools(accessToken),
    ...createSpaceTools(accessToken, userId),
    ...createBusinessTools(accessToken),
    ...createEventTools(accessToken),
    ...createFormTools(accessToken),
  };
};