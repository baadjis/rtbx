// app/mcp/tools/spaces.ts
import { tool } from 'ai';
import { z } from 'zod';
import { SpaceAddSchema, spaceSearchSchema, SpaceUpdateSchema } from '@/lib/spaces/validators';

const BASE = process.env.NEXT_PUBLIC_APP_URL;

const authHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const createSpaceTools = (
  accessToken?: string,
  userId?: string,
  userEmail?: string // ← nouveau
) => ({

  createSpace: tool({
    description: `Create a new Space. Required: slug, space_type (personal/business/creator).
Email and user_id are injected automatically from the session.
Social links must be added separately using addSpaceSocialLink after creation.
Available networks: Instagram, TikTok, WhatsApp, YouTube, LinkedIn, X (Twitter), Facebook, Threads, Pinterest, Twitch, Spotify, Website.`,
    inputSchema: SpaceAddSchema.omit({
      edit_token: true,
      user_id: true,
      email: true,
      social_data: true,
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/spaces/activate`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
          ...args,
          user_id: userId || null,
          email: userEmail || null, // ← injecté automatiquement
          social_data: [],
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

searchSpaces: tool({
  description: `Search public spaces by name or slug.
Filters: q (text search on entity_name and slug), space_type (personal/business/creator), space_subtype.
Supports pagination via limit (default 20) and offset.
Use when user searches for a specific space or profile.`,
  inputSchema: spaceSearchSchema,
  execute: async (args) => {
    const params = new URLSearchParams();
    if (args.q) params.set('q', args.q);
    if (args.space_type) params.set('space_type', args.space_type);
    if (args.space_subtype) params.set('space_subtype', args.space_subtype);
    if (args.limit) params.set('limit', args.limit.toString());
    if (args.offset) params.set('offset', args.offset.toString());

    const response = await fetch(`${BASE}/api/spaces/search?${params.toString()}`, {
      method: 'GET',
      headers: authHeaders(accessToken),
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to search spaces');
    }
    return response.json();
  },
}),
getSpaceSocialLinks: tool({
    description: `Get all social links for a specific space.
Requires the space ID (UUID).`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Space ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/spaces/${args.id}/socials`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch social links');
      }
      return response.json();
    },
  }),

  addSpaceSocialLink: tool({
    description: `Add a social link to a space.
Requires space ID, network name and handle (username or full URL).
Available networks: Instagram, TikTok, WhatsApp, YouTube, LinkedIn, X (Twitter), Facebook, Threads, Pinterest, Twitch, Spotify, Website.
handle can be just the username (e.g. "johndoe") or a full URL.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Space ID'),
      network: z.string().describe('Network name e.g. Instagram, TikTok'),
      handle: z.string().describe('Username or full URL'),
    }),
    execute: async (args) => {
      const { id, ...data } = args;
      const response = await fetch(`${BASE}/api/spaces/${id}/socials`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to add social link');
      }
      return response.json();
    },
  }),

  updateSpaceSocialLink: tool({
    description: `Update an existing social link on a space.
Requires space ID and link ID. network and handle are optional.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Space ID'),
      linkId: z.string().uuid().describe('Social link ID'),
      network: z.string().optional(),
      handle: z.string().optional(),
    }),
    execute: async (args) => {
      const { id, linkId, ...data } = args;
      const response = await fetch(`${BASE}/api/spaces/${id}/socials/${linkId}`, {
        method: 'PATCH',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to update social link');
      }
      return response.json();
    },
  }),

  deleteSpaceSocialLink: tool({
    description: `Delete a social link from a space.
Requires space ID and link ID.`,
    inputSchema: z.object({
      id: z.string().uuid().describe('Space ID'),
      linkId: z.string().uuid().describe('Social link ID to delete'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/spaces/${args.id}/socials/${args.linkId}`, {
        method: 'DELETE',
        headers: authHeaders(accessToken),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete social link');
      }
      return response.json();
    },
  }),


});