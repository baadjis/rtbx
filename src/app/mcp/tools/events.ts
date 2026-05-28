/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/tools/events.ts
import { tool } from 'ai';
import { z } from 'zod';
import {
  eventCreateSchema,
  eventUpdateSchema,
  eventPublishSchema,
  eventCancelSchema,
  sendInviteSchema,
  sendBadgesSchema,
  registerEventSchema,
  agendaItemSchema,
  eventPublicSearchSchema,
  eventOrganizerSearchSchema,
  agendaUpdateSchema,
} from '@/lib/events/validators';
const BASE = process.env.NEXT_PUBLIC_APP_URL;

// =====================================================
// CREATE EVENT
// =====================================================
export const createEvent = tool({
  description: `Create a new event for the authenticated organizer.
The event is created as a draft (not published).
start_date must be a full ISO 8601 datetime string (e.g. 2026-06-15T10:00:00Z).`,
  inputSchema: eventCreateSchema,
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create event');
    }
    return response.json();
  },
});

// =====================================================
// PUBLISH EVENT
// =====================================================
export const publishEvent = tool({
  description: `Publish a draft event and automatically send pending invitations.
Requires the event to be in draft state (is_published: false).
Provide eventId (UUID) and lang ('fr' or 'en').`,
  inputSchema: eventPublishSchema,
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to publish event');
    }
    return response.json();
  },
});

// =====================================================
// UPDATE EVENT
// =====================================================
export const updateEvent = tool({
  description: `Update an existing event. All fields are optional — only send what needs to change.
Requires the event id and at least one field to update.
Only the organizer of the event can update it.`,
  inputSchema: eventUpdateSchema.extend({
    id: z.string().describe('The ID of the event to update'),
  }),
  execute: async (args) => {
    const { id, ...data } = args;
    const response = await fetch(`${BASE}/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update event');
    }
    return response.json();
  },
});

// =====================================================
// DELETE EVENT
// =====================================================
export const deleteEvent = tool({
  description: `Hard delete a draft event.
Only works if the event is NOT published (is_published: false).
For published events, use cancelEvent instead.
Only the organizer can delete their event.`,
  inputSchema: z.object({
    id: z.string().describe('The ID of the event to delete'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/${args.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete event');
    }
    return response.json();
  },
});

// =====================================================
// CANCEL EVENT
// =====================================================
export const cancelEvent = tool({
  description: `Cancel a published event and notify all registered participants and invited contacts.
Emails are sent to a merged deduplicated list of registrations + invitations.
reason is optional — if provided it will appear in the cancellation email.
Only works on published events. For drafts, use deleteEvent.`,
  inputSchema: eventCancelSchema,
  execute: async (args) => {
    const { eventId, ...data } = args;
    const response = await fetch(`${BASE}/api/events/${eventId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to cancel event');
    }
    return response.json();
  },
});

// =====================================================
// SEND INVITE
// =====================================================
export const sendInvite = tool({
  description: `Send a personalized invitation email to a single recipient for a specific event.
Generates a unique magic link token and saves the invitation as 'pending'.
Only the organizer of the event can send invitations.`,
  inputSchema: sendInviteSchema,
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/send-invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to send invitation');
    }
    return response.json();
  },
});

// =====================================================
// SEND BADGES
// =====================================================
export const sendBadges = tool({
  description: `Send badge PDFs to all registered participants of an event.
Calls the Python badge generation API for each participant,
then sends the PDF as an email attachment via Resend.
Only the organizer can trigger badge sending.
Returns sent and failed counts.`,
  inputSchema: sendBadgesSchema,
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/send-badges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to send badges');
    }
    return response.json();
  },
});

// =====================================================
// REGISTER EVENT
// =====================================================
export const registerEvent = tool({
  description: `Register a participant to a public or invite-only event.
Does NOT require authentication — anyone with access to the event page can register.
Automatically creates a badge entry and sends a confirmation email.
If the event has badge_automation_type='immediate', the badge PDF is sent right away.`,
  inputSchema: registerEventSchema,
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to register to event');
    }
    return response.json();
  },
});

// =====================================================
// GET MY EVENTS
// =====================================================
export const getMyEvents = tool({
  description: `Get all events related to the authenticated user in one call.
Returns three lists:
- organized: events the user created as organizer
- registered: events the user registered to (matched by email)
- invited: events the user was invited to (matched by email)`,
  inputSchema: z.object({}),
  execute: async () => {
    const response = await fetch(`${BASE}/api/events/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch user events');
    }
    return response.json();
  },
});

// =====================================================
// GET EVENT REGISTRATIONS
// =====================================================
export const getEventRegistrations = tool({
  description: `Get the full list of participants registered to a specific event.
Only accessible by the organizer of the event.
Returns registration details including name, email, company, role, and opt-in status.`,
  inputSchema: z.object({
    id: z.string().describe('The ID of the event'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/${args.id}/registrations`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch registrations');
    }
    return response.json();
  },
});

// =====================================================
// GET EVENT INVITATIONS
// =====================================================
export const getEventInvitations = tool({
  description: `Get the full list of invitations sent for a specific event.
Only accessible by the organizer of the event.
Returns invitation details including email, status (pending/sent/accepted) and token.`,
  inputSchema: z.object({
    id: z.string().describe('The ID of the event'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/${args.id}/invitations`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch invitations');
    }
    return response.json();
  },
});

// =====================================================
// GET EVENT AGENDA
// =====================================================
export const getEventAgenda = tool({
  description: `Get the full agenda for a specific event, ordered by start_time ascending.
Public endpoint — no authentication required.
Returns all agenda slots with label, room, speakers, description and times.`,
  inputSchema: z.object({
    id: z.string().describe('The ID of the event'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/${args.id}/agenda`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch agenda');
    }
    return response.json();
  },
});

// =====================================================
// ADD AGENDA ITEM
// =====================================================
export const addAgendaItem = tool({
  description: `Add a new agenda slot to an event.
Only accessible by the organizer of the event.
start_time must be a full ISO 8601 datetime string (e.g. 2026-06-15T10:00:00Z).
speakers is an optional JSON array.`,
  inputSchema: agendaItemSchema.extend({
    id: z.string().describe('The ID of the event'),
  }),
  execute: async (args) => {
    const { id, ...data } = args;
    const response = await fetch(`${BASE}/api/events/${id}/agenda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to add agenda item');
    }
    return response.json();
  },
});

// =====================================================
// UPDATE AGENDA ITEM
// =====================================================
export const updateAgendaItem = tool({
  description: `Update an existing agenda slot.
Requires the agenda item ID (not the event ID).
All fields are optional — only send what needs to change.
Only the organizer of the event can update its agenda.`,
  inputSchema: agendaUpdateSchema.extend({
    itemId: z.string().describe('The ID of the agenda item to update'),
  }),
  execute: async (args) => {
    const { itemId, ...data } = args;
    const response = await fetch(`${BASE}/api/events/agenda/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update agenda item');
    }
    return response.json();
  },
});

// =====================================================
// DELETE AGENDA ITEM
// =====================================================
export const deleteAgendaItem = tool({
  description: `Delete an agenda slot from an event.
Requires the agenda item ID (not the event ID).
Only the organizer of the event can delete its agenda items.`,
  inputSchema: z.object({
    itemId: z.string().describe('The ID of the agenda item to delete'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/events/agenda/${args.itemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete agenda item');
    }
    return response.json();
  },
});

// =====================================================
// SEARCH PUBLIC EVENTS
// =====================================================
export const searchPublicEvents = tool({
  description: `Search public published events with filters.
Always restricted to visibility=public and is_published=true.
Filters: q (title search), category, location, org_name, start_date.
Supports pagination via limit (default 20, max 100) and offset.
Use this for public event discovery pages or when a user searches for events.`,
  inputSchema: eventPublicSearchSchema,
  execute: async (args) => {
    const params = new URLSearchParams();
    if (args.q) params.set('q', args.q);
    if (args.category) params.set('category', args.category);
    if (args.location) params.set('location', args.location);
    if (args.org_name) params.set('org_name', args.org_name);
    if (args.start_date) params.set('start_date', args.start_date);
    if (args.limit) params.set('limit', args.limit.toString());
    if (args.offset) params.set('offset', args.offset.toString());

    const response = await fetch(`${BASE}/api/events/search?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to search events');
    }
    return response.json();
  },
});

// =====================================================
// SEARCH ORGANIZER EVENTS
// =====================================================
export const searchOrganizerEvents = tool({
  description: `Search the authenticated organizer's own events with filters.
Always restricted to the authenticated user's events.
Filters: q (title search), category, org_name, status (draft/published/cancelled/completed), start_date, end_date.
Supports pagination via limit (default 20, max 100) and offset.
Use this for dashboard filtering or when the user asks about their own events.`,
  inputSchema: eventOrganizerSearchSchema,
  execute: async (args) => {
    const params = new URLSearchParams();
    if (args.q) params.set('q', args.q);
    if (args.category) params.set('category', args.category);
    if (args.org_name) params.set('org_name', args.org_name);
    if (args.status) params.set('status', args.status);
    if (args.start_date) params.set('start_date', args.start_date);
    if (args.end_date) params.set('end_date', args.end_date);
    if (args.limit) params.set('limit', args.limit.toString());
    if (args.offset) params.set('offset', args.offset.toString());

    const response = await fetch(`${BASE}/api/events/me/search?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to search organizer events');
    }
    return response.json();
  },
});