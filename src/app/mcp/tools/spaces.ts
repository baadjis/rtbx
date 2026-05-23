// app/mcp/tools/spaces.ts
import { tool } from 'ai';
import { z } from 'zod';
import {
  SpaceAddSchema,
  SpaceUpdateSchema
} from '@/lib/spaces/validators';
import type {
  SpaceAddPayload,
  SpaceUpdatePayload
} from '@/lib/spaces/types';


// =====================================================
// CREATE SPACE TOOL
// =====================================================
export const createSpace = tool({
  description: 'Create a new Space (Digital ID / Profile)',
  inputSchema: SpaceAddSchema.omit({ edit_token: true }),
  execute: async (args) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create space');
    }

    return response.json();
  },
});

// =====================================================
// UPDATE SPACE TOOL
// =====================================================
export const updateSpace = tool({
  description: 'Update an existing Space using its edit token',
  inputSchema: SpaceUpdateSchema.extend({
    token: z.string().describe('Edit token of the space (required)'),
  }),
  execute: async (args) => {
    const { token, ...data } = args;

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/spaces/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, payload: data }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update space');
    }

    return response.json();
  },
});
// =====================================================
// GET SPACE BY SLUG TOOL
// =====================================================
export const getSpaceBySlug = tool({
  description: 'Get a space by its public slug',
  inputSchema: z.object({
    slug: z.string().describe('Public slug of the space'),
  }),
  execute: async (args: { slug: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/spaces?slug=${args.slug}`
    );

    if (!response.ok) {
      throw new Error('Space not found or error occurred');
    }

    return response.json();
  },
});

// =====================================================
// GET SPACE BY TOKEN TOOL
// =====================================================
export const getSpaceByToken = tool({
  description: 'Get a space using its edit token (private access)',
  inputSchema: z.object({
    token: z.string().describe('Edit token of the space'),
  }),
  execute: async (args: { token: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/spaces?token=${args.token}`
    );

    if (!response.ok) {
      throw new Error('Invalid token or space not found');
    }

    return response.json();
  },
});