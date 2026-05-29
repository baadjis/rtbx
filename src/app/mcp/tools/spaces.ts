// app/mcp/tools/spaces.ts
import { tool } from 'ai';
import { z } from 'zod';
import { SpaceAddSchema, SpaceUpdateSchema } from '@/lib/spaces/validators';

const BASE = process.env.NEXT_PUBLIC_APP_URL;

const authHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const createSpaceTools = (accessToken?: string, userId?: string) => ({

  createSpace: tool({
    description: `Create a new Space (Digital ID / Profile) for the authenticated user.
email is required — ask the user if not provided.
slug is required — must be unique, lowercase, alphanumeric with dashes only.
space_type is required: 'personal', 'business', or 'creator'.`,
    inputSchema: SpaceAddSchema.omit({ edit_token: true, user_id: true }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/spaces/activate`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
          ...args,
          user_id: userId || null, // ← injecté automatiquement
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create space');
      }
      return response.json();
    },
  }),

  updateSpace: tool({
    description: `Update an existing Space using its edit token.
edit_token is required — the user must provide it.
Only text fields can be updated (no avatar upload via MCP).
Updatable fields: entity_name, slug, theme_color, social_data, space_type, space_subtype.`,
    inputSchema: SpaceUpdateSchema.extend({
      token: z.string().describe('Edit token of the space (required)'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/spaces/update-mcp`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to update space');
      }
      return response.json();
    },
  }),

  getSpaceBySlug: tool({
    description: 'Get a space by its public slug.',
    inputSchema: z.object({
      slug: z.string().describe('Public slug of the space'),
    }),
    execute: async (args: { slug: string }) => {
      const response = await fetch(
        `${BASE}/api/spaces?slug=${args.slug}`,
        { method: 'GET', headers: authHeaders(accessToken) }
      );
      if (!response.ok) throw new Error('Space not found or error occurred');
      return response.json();
    },
  }),

  getSpaceByToken: tool({
    description: 'Get a space using its edit token (private access).',
    inputSchema: z.object({
      token: z.string().describe('Edit token of the space'),
    }),
    execute: async (args: { token: string }) => {
      const response = await fetch(
        `${BASE}/api/spaces?token=${args.token}`,
        { method: 'GET', headers: authHeaders(accessToken) }
      );
      if (!response.ok) throw new Error('Invalid token or space not found');
      return response.json();
    },
  }),

  getMySpaces: tool({
  description: `Get all spaces belonging to the authenticated user.
Only call when the user asks to see their spaces or profiles.
Returns id, slug, entity_name, space_type and edit_token for each space.`,
  inputSchema: z.object({}),
  execute: async () => {
    const response = await fetch(`${BASE}/api/spaces/me`, {
      method: 'GET',
      headers: authHeaders(accessToken),
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch spaces');
    }
    return response.json();
  },
}),

});