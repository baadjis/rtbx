// app/mcp/tools/shortener.ts
import { tool } from 'ai';
import { z } from 'zod';
import {
    LinkCreateInput,
  linkCreateSchema,
  LinkUpdateInput,
  linkUpdateSchema
} from '@/lib/shortener/validators';


// =====================================================
// CREATE SHORT LINK TOOL
// =====================================================
export const createShortLink = tool({
  description: 'Create a new shortened URL',
  inputSchema: linkCreateSchema.omit({
    // On laisse le backend gérer user_id et générer le code si besoin
  }),
  execute: async (args: LinkCreateInput) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shortener`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
// UPDATE SHORT LINK TOOL
// =====================================================
export const updateShortLink = tool({
  description: 'Update title and description of an existing short link',
  inputSchema: linkUpdateSchema.extend({
    short_code: z.string().describe('The short code of the link to update'),
  }),
  execute: async (args: LinkUpdateInput & { short_code: string }) => {
    const { short_code, ...data } = args;

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shortener/${short_code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
// GET USER SHORT LINKS TOOL
// =====================================================
export const getUserShortLinks = tool({
  description: 'Get all shortened links belonging to a user',
  inputSchema: z.object({
   
  }),
  execute: async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/shortener`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user short links');
    }

    return response.json();
  },
});

// =====================================================
// GET SHORT LINK STATS TOOL
// =====================================================
export const getShortLinkStats = tool({
  description: 'Get statistics and logs for a specific short link',
  inputSchema: z.object({
    short_code: z.string().describe('The short code of the link'),
  }),
  execute: async (args: { short_code: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/shortener/${args.short_code}/stats`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch link statistics');
    }

    return response.json();
  },
});