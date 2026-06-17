// app/mcp/tools/businesses.ts
import { tool } from 'ai';
import { z } from 'zod';
import { businessSchema, BusinessInput } from '@/lib/businesses/validators';

// =====================================================
// CREATE BUSINESS TOOL
// =====================================================
const authHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
export const createBusinessTools = (accessToken?: string) => ({
createBusiness : tool({
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
      headers: authHeaders(accessToken) ,       // ← Ajout cookies
        // ← Ajout cookies
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create business');
    }
    return response.json();
  },
}),

// =====================================================
// UPDATE BUSINESS TOOL
// =====================================================
updateBusiness : tool({
  description: 'Update an existing business',
  inputSchema: businessSchema.partial().extend({
    id: z.string().describe('The ID of the business to update'),
  }),
  execute: async (args: Partial<BusinessInput> & { id: string }) => {
    const { id, ...data } = args;
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/businesses/${id}`, {
      method: 'PATCH',
      headers: authHeaders(accessToken) ,       // ← Ajout cookies
      // ← Ajout cookies
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update business');
    }
    return response.json();
  },
}),

// =====================================================
// GET USER BUSINESSES TOOL
// =====================================================
getUserBusinesses: tool({
  description: `Get all businesses of the  user.
  Use limit to control number of businesses to return (default 10, max 20).
  Returns name, category,adress  only ,other field of user explicitly asked for.
  `,
  inputSchema: z.object({
     limit: z.number().int().min(1).max(20).default(10)
          .describe('Number of businesses to return (default 10, max 20)'),
        offset: z.number().int().min(0).default(0)
          .describe('Offset for pagination (default 0)'),
  }), // ← vide, pas de paramètres
  execute: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/businesses/me`, {
      method: 'GET',
      headers: authHeaders(accessToken),
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch businesses');
    }
    return response.json();
  },
}),})