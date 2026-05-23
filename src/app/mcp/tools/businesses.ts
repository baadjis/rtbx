// app/mcp/tools/businesses.ts
import { tool } from 'ai';
import { z } from 'zod';
import { businessSchema, BusinessInput } from '@/lib/businesses/validators';

// =====================================================
// CREATE BUSINESS TOOL
// =====================================================
export const createBusiness = tool({
  description: 'Create a new business for the user',
  inputSchema: businessSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
  }),
  execute: async (args: BusinessInput) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create business');
    }

    return response.json();
  },
});

// =====================================================
// UPDATE BUSINESS TOOL
// =====================================================
export const updateBusiness = tool({
  description: 'Update an existing business',
  inputSchema: businessSchema.partial().extend({
    id: z.string().describe('The ID of the business to update'),
  }),
  execute: async (args: Partial<BusinessInput> & { id: string }) => {
    const { id, ...data } = args;

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update business');
    }

    return response.json();
  },
});

// =====================================================
// GET USER BUSINESSES TOOL
// =====================================================
export const getUserBusinesses = tool({
  description: 'Get all businesses belonging to a user',
  inputSchema: z.object({
    user_id: z.string().describe('The user ID'),
  }),
  execute: async (args: { user_id: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/businesses?user_id=${args.user_id}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch businesses');
    }

    return response.json();
  },
});