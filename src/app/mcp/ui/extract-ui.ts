/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/ui/extract-ui.ts
// Fonction commune à tous les agents pour extraire le payload UI

type UIPayload = {
  type: string;
  data: any;
} | null;

// Mapping tool → type UI
export const TOOL_UI_MAP: Record<string, string> = {
  // Shortener — READ
  getUserShortLinks: 'short_link_list',
  getShortLinkStats: 'short_link_stats',
  getShortLinkLogs: 'short_link_logs',
  // Shortener — WRITE
  createShortLink: 'short_link_card',
  updateShortLink: 'short_link_card',

  // Events — READ
  getMyEvents: 'event_list',
  searchPublicEvents: 'event_list',
  searchOrganizerEvents: 'event_list',
  getEventRegistrations: 'participants_table',
  getEventInvitations: 'invitations_table',
  getEventAgenda: 'agenda_list',
  // Events — WRITE
  createEvent: 'event_card',
  updateEvent: 'event_card',
  publishEvent: 'event_card',

  // Spaces — READ
  getMySpaces: 'space_list',
  searchSpaces: 'space_list',
  getSpaceSocialLinks: 'space_social_links',
  // Spaces — WRITE
  createSpace: 'space_card',
  updateSpace: 'space_card',

  // Forms — READ
  getMyForms: 'form_list',
  getFormById: 'form_card',
  getFormResponses: 'form_responses_table',
  searchForms: 'form_list',
  // Forms — WRITE
  createForm: 'form_card',
  updateForm: 'form_card',

  // Business — READ
  getUserBusinesses: 'business_list',
  // Business — WRITE
  createBusiness: 'business_card',
  updateBusiness: 'business_card',
  // Business — READ

getBusinessProviderLinks: 'business_provider_links',
getBusinessOpeningHours: 'business_opening_hours',
getBusinessLoyaltySettings: 'business_loyalty_settings',
getBusinessLoyaltyRewards: 'business_loyalty_rewards',
getBusinessLoyaltyHistory: 'business_loyalty_history',

// Business — WRITE

upsertBusinessProviderLink: 'business_provider_links',
createBusinessLoyaltyReward: 'business_loyalty_rewards',
};

export function extractUIFromSteps(steps: any[]): UIPayload {
  if (!steps || steps.length === 0) return null;

  // Chercher le dernier tool call avec un résultat
  for (const step of steps.slice().reverse()) {
    const toolCalls = step.toolCalls ?? [];
    const toolResults = step.toolResults ?? [];

    for (let i = toolCalls.length - 1; i >= 0; i--) {
      const toolName = toolCalls[i]?.toolName;
      const result = (toolResults[i] as any)?.output ?? (toolResults[i] as any)?.result;

      if (!toolName || result === undefined) continue;

      const uiType = TOOL_UI_MAP[toolName];
      if (!uiType) continue;

      // Extraire les données selon le type
      let data = result;
      if (result?.data) data = result.data;
      if (result?.success && result?.data) data = result.data;

      return { type: uiType, data };
    }
  }

  return null;
}