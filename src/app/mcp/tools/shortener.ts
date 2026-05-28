/* eslint-disable @typescript-eslint/no-explicit-any */
// app/mcp/tools/shortener.ts
import { tool } from 'ai';
import { z } from 'zod';
import {
  linkCreateSchema,
  LinkCreateInput,
  linkUpdateSchema,
  LinkUpdateInput,
} from '@/lib/shortener/validators';
const BASE = process.env.NEXT_PUBLIC_APP_URL;

// =====================================================
// CREATE SHORT LINK
// =====================================================
export const createShortLink = tool({
  description: `Create a new shortened URL for the authenticated user.
Provide long_url (required). title, description, and custom_alias are optional.
custom_alias must be alphanumeric with dashes or underscores only.`,
  inputSchema: linkCreateSchema.omit({ user_id: true }),
  execute: async (args: LinkCreateInput) => {
    const response = await fetch(`${BASE}/api/shortener`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create short link');
    }
    return response.json();
  },
});

// =====================================================
// UPDATE SHORT LINK
// =====================================================
export const updateShortLink = tool({
  description: `Update the title and/or description of an existing shortened link.
Requires the short_code of the link to update.
Only title and description are editable.`,
  inputSchema: linkUpdateSchema.extend({
    short_code: z.string().describe('The short code of the link to update'),
  }),
  execute: async (args: LinkUpdateInput & { short_code: string }) => {
    const { short_code, ...data } = args;
    const response = await fetch(`${BASE}/api/shortener/${short_code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update short link');
    }
    return response.json();
  },
});

// =====================================================
// DELETE SHORT LINK
// =====================================================
export const deleteShortLink = tool({
  description: `Soft delete a shortened link.
The link becomes inaccessible after deletion but is not permanently removed.
Requires the short_code of the link to delete.
Only call this when the user explicitly asks to delete a link.`,
  inputSchema: z.object({
    short_code: z.string().describe('The short code of the link to delete'),
  }),
  execute: async (args: { short_code: string }) => {
    const response = await fetch(`${BASE}/api/shortener/${args.short_code}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete short link');
    }
    return response.json();
  },
});

// =====================================================
// GET USER SHORT LINKS
// =====================================================
export const getUserShortLinks = tool({
  description: `Get paginated shortened links belonging to the authenticated user.
Only call this when the user explicitly asks to see their links.
Returns short_code, title, long_url and clicks count only.
Use limit to control how many links to return (default 10, max 20).`,
  inputSchema: z.object({
    limit: z.number().int().min(1).max(20).default(10)
      .describe('Number of links to return (default 10, max 20)'),
    offset: z.number().int().min(0).default(0)
      .describe('Offset for pagination (default 0)'),
  }),
  execute: async (args) => {
    const response = await fetch(
      `${BASE}/api/shortener?limit=${args.limit}&offset=${args.offset}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',        // ← Ajout cookies
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch user short links');
    }
    const json = await response.json();
    const links = (json?.data ?? []).map((link: any) => ({
      short_code: link.short_code,
      title: link.title || link.long_url,
      long_url: link.long_url,
      clicks: link.clicks ?? 0,
    }));
    return { count: links.length, total: json?.count ?? 0, links };
  },
});

// =====================================================
// GET SHORT LINK STATS
// =====================================================
export const getShortLinkStats = tool({
  description: `Get statistics for a specific shortened link.
Returns clicks count, last_clicked_at, created_at, long_url, title and description.
Requires the short_code of the link.`,
  inputSchema: z.object({
    short_code: z.string().describe('The short code of the link'),
  }),
  execute: async (args: { short_code: string }) => {
    const response = await fetch(`${BASE}/api/shortener/${args.short_code}/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',        // ← Ajout cookies
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch link statistics');
    }
    return response.json();
  },
});

// =====================================================
// GET SHORT LINK LOGS
// =====================================================
export const getShortLinkLogs = tool({
  description: `Get detailed click logs for a specific shortened link.
Returns country, referrer, device and browser per click, ordered by most recent.
Requires the short_code of the link.
Only call this when the user explicitly asks for click details or analytics.`,
  inputSchema: z.object({
    short_code: z.string().describe('The short code of the link'),
    limit: z.number().int().min(1).max(100).default(50)
      .describe('Number of log entries to return (default 50, max 100)'),
  }),
  execute: async (args: { short_code: string; limit: number }) => {
    const response = await fetch(
      `${BASE}/api/shortener/${args.short_code}/logs?limit=${args.limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',        // ← Ajout cookies
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch link logs');
    }
    return response.json();
  },
});