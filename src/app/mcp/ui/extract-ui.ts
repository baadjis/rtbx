/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/ui/extract-ui.ts
// Fonction commune à tous les agents pour extraire le payload UI

type UIPayload = {
  type: string;
  data: any;
} | null;

// Mapping tool → type UI
const TOOL_UI_MAP: Record<string, string> = {
  // Shortener
  getUserShortLinks: 'short_link_list',
  createShortLink: 'short_link_card',
  updateShortLink: 'short_link_card',
  getShortLinkStats: 'short_link_stats',
  getShortLinkLogs: 'short_link_logs',

  // Events
  getMyEvents: 'event_list',
  searchPublicEvents: 'event_list',
  searchOrganizerEvents: 'event_list',
  getEventRegistrations: 'participants_table',
  getEventInvitations: 'invitations_table',
  getEventAgenda: 'agenda_list',

  // Spaces
  getMySpaces: 'space_list',
  searchSpaces: 'space_list',

  
  // Forms
getMyForms: 'form_list',
searchForms: 'form_list',
getFormById: 'form_card',
getFormResponses: 'form_responses_table',
createForm: 'form_card',

// Business
getUserBusinesses: 'business_list',
createBusiness: 'business_card',
updateBusiness: 'business_card',
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