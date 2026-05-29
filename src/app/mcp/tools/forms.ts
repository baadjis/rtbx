/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/tools/forms.ts
import { tool } from 'ai';
import { z } from 'zod';
import {
  formCreateSchema,
  formUpdateSchema,
  formPublishSchema,
  sendFormInviteSchema,
  formSearchSchema,
} from '@/lib/forms/validators';

const BASE = process.env.NEXT_PUBLIC_APP_URL;

const authHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const createFormTools = (accessToken?: string) => ({

  createForm: tool({
    description: `Create a new form for the authenticated user.
title is required. category defaults to 'survey'.
visibility: public, private, or invite_only.
The form is created as draft (is_published: false).`,
    inputSchema: formCreateSchema,
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/forms`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create form');
      }
      return response.json();
    },
  }),

  updateForm: tool({
    description: `Update an existing form. All fields optional — only send what changes.
Requires form id.`,
    inputSchema: formUpdateSchema.extend({
      id: z.string().uuid().describe('Form ID to update'),
    }),
    execute: async (args) => {
      const { id, ...data } = args;
      const response = await fetch(`${BASE}/api/forms/${id}`, {
        method: 'PATCH',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to update form');
      }
      return response.json();
    },
  }),

  deleteForm: tool({
    description: `Hard delete a form and all its responses and invitations.
Requires form id. This action is irreversible.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Form ID to delete'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/forms/${args.id}`, {
        method: 'DELETE',
        headers: authHeaders(accessToken),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete form');
      }
      return response.json();
    },
  }),

  publishForm: tool({
    description: `Publish a draft form and send pending invitations.
Requires formId (UUID) and lang ('fr' or 'en').`,
    inputSchema: formPublishSchema,
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/forms/publish`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to publish form');
      }
      return response.json();
    },
  }),

  sendFormInvites: tool({
    description: `Send invitation emails to a list of recipients for a specific form.
Requires formId and emails array.
Only call when user explicitly asks to send invitations.`,
    inputSchema: sendFormInviteSchema,
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/forms/send-invites`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to send invitations');
      }
      return response.json();
    },
  }),

  getMyForms: tool({
    description: `Get all forms belonging to the authenticated user.
Only call when user explicitly asks to see their forms.
Returns id, title, category, is_published, visibility, org_name.`,
    inputSchema: z.object({}),
    execute: async () => {
      const response = await fetch(`${BASE}/api/forms`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch forms');
      }
      return response.json();
    },
  }),

  getFormResponses: tool({
    description: `Get all responses for a specific form.
Only call when user explicitly asks to see responses or analytics.
Requires form id.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Form ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/forms/${args.id}/responses`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch responses');
      }
      return response.json();
    },
  }),

  searchForms: tool({
    description: `Search public published forms.
Filters: q (title search), category.
Supports pagination via limit (default 20) and offset.`,
    inputSchema: formSearchSchema,
    execute: async (args) => {
      const params = new URLSearchParams();
      if (args.q) params.set('q', args.q);
      if (args.category) params.set('category', args.category);
      if (args.limit) params.set('limit', args.limit.toString());
      if (args.offset) params.set('offset', args.offset.toString());

      const response = await fetch(`${BASE}/api/forms/search?${params.toString()}`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to search forms');
      }
      return response.json();
    },
  }),


getFormById: tool({
description: `Get a specific form by its ID.
Public forms are accessible without auth.
Private forms require ownership.
Use when user asks about a specific form by ID.`,
  inputSchema: z.object({
    id: z.string().uuid().describe('Form ID'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/forms/${args.id}`, {
      method: 'GET',
      headers: authHeaders(accessToken),
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch form');
    }
    return response.json();
  },
}),

});