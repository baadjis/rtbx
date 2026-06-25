// app/mcp/tools/businesses.ts
import { tool } from 'ai';
import { z } from 'zod';
import { businessSchema, BusinessInput } from '@/lib/businesses/validators';
import { ProviderCategorySchema } from '@/lib/business-provider-links/validators';

const BASE=process.env.NEXT_PUBLIC_APP_URL
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
  Returns name, category,adress  only ,other field if user explicitly asked for.
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
}),

  // =====================================================
  // GET PROVIDER LINKS
  // =====================================================
  getBusinessProviderLinks: tool({
    description: `Get all provider links for a business (booking, delivery, review, marketplace platforms).
Call when user says: "liens providers", "provider links", "plateformes", "booking links", "delivery links", "mes plateformes".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/provider-links`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch provider links');
      }
      return response.json();
    },
  }),

  // =====================================================
  // UPSERT PROVIDER LINK
  // =====================================================
  upsertBusinessProviderLink: tool({
    description: `Add or update a provider link for a business.
Call when user says: "ajouter un lien booking", "ajouter Uber Eats", "add delivery link", "add review link", "ajouter TripAdvisor", "ajouter Google Maps".
provider_category: 'review' (Google, TripAdvisor), 'booking' (OpenTable, Resy), 'delivery' (Uber Eats, Deliveroo), 'marketplace' (Amazon, Etsy).
provider_id: the platform identifier (e.g. 'uber_eats', 'google', 'tripadvisor').
value: the URL or ID on that platform.
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      provider_category: ProviderCategorySchema.describe('Category: review | booking | delivery | marketplace'),
      provider_id: z.string().describe('Platform identifier e.g. uber_eats, google, tripadvisor'),
      value: z.string().describe('URL or platform-specific ID'),
    }),
    execute: async (args) => {
      const { id, ...data } = args;
      const response = await fetch(`${BASE}/api/businesses/${id}/provider-links`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to upsert provider link');
      }
      return response.json();
    },
  }),

  // =====================================================
  // GET OPENING HOURS
  // =====================================================
  getBusinessOpeningHours: tool({
    description: `Get opening hours for a business.
Call when user says: "horaires", "heures d'ouverture", "opening hours", "quand est-ce ouvert".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/opening-hours`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch opening hours');
      }
      return response.json();
    },
  }),

  // =====================================================
  // SAVE OPENING HOURS
  // =====================================================
  saveBusinessOpeningHours: tool({
    description: `Save opening hours for a business.
Call when user says: "modifier les horaires", "changer les heures", "update opening hours", "save hours".
hours is an array of { day, open, close, is_closed }.
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      hours: z.array(z.object({
        day: z.string().describe('Day name e.g. monday, tuesday'),
        open: z.string().optional().describe('Opening time e.g. 09:00'),
        close: z.string().optional().describe('Closing time e.g. 18:00'),
        is_closed: z.boolean().optional().describe('True if closed that day'),
      })).describe('Array of opening hours per day'),
    }),
    execute: async (args) => {
      const { id, hours } = args;
      const response = await fetch(`${BASE}/api/businesses/${id}/opening-hours`, {
        method: 'PUT',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ hours }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save opening hours');
      }
      return response.json();
    },
  }),

  // =====================================================
  // GET LOYALTY SETTINGS
  // =====================================================
  getBusinessLoyaltySettings: tool({
    description: `Get loyalty program settings for a business.
Call when user says: "programme fidélité", "loyalty settings", "points fidélité", "paramètres fidélité".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/loyalty-settings`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch loyalty settings');
      }
      return response.json();
    },
  }),

  // =====================================================
  // SAVE LOYALTY SETTINGS
  // =====================================================
  saveBusinessLoyaltySettings: tool({
    description: `Save loyalty program settings for a business.
Call when user says: "configurer fidélité", "activer programme points", "setup loyalty", "modifier points par visite".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      is_enabled: z.boolean().optional().describe('Enable/disable loyalty program'),
      points_per_visit: z.number().optional().describe('Points earned per visit'),
      points_per_euro: z.number().optional().describe('Points earned per euro spent'),
      expiry_days: z.number().optional().describe('Days before points expire'),
    }),
    execute: async (args) => {
      const { id, ...data } = args;
      const response = await fetch(`${BASE}/api/businesses/${id}/loyalty-settings`, {
        method: 'PUT',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save loyalty settings');
      }
      return response.json();
    },
  }),

  // =====================================================
  // GET LOYALTY REWARDS
  // =====================================================
  getBusinessLoyaltyRewards: tool({
    description: `Get all loyalty rewards for a business.
Call when user says: "récompenses fidélité", "loyalty rewards", "voir les récompenses", "what rewards do I have".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/loyalty-rewards`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch loyalty rewards');
      }
      return response.json();
    },
  }),

  // =====================================================
  // CREATE LOYALTY REWARD
  // =====================================================
  createBusinessLoyaltyReward: tool({
    description: `Create a new loyalty reward for a business.
Call when user says: "créer une récompense", "ajouter récompense", "create reward", "add reward".
Requires business id, name, points_required.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      name: z.string().describe('Reward name e.g. "Café offert"'),
      description: z.string().optional().describe('Reward description'),
      points_required: z.number().describe('Points needed to redeem'),
      is_active: z.boolean().optional().default(true),
    }),
    execute: async (args) => {
      const { id, ...data } = args;
      const response = await fetch(`${BASE}/api/businesses/${id}/loyalty-rewards`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create loyalty reward');
      }
      return response.json();
    },
  }),

  // =====================================================
  // UPDATE LOYALTY REWARD
  // =====================================================
  updateBusinessLoyaltyReward: tool({
    description: `Update an existing loyalty reward.
Call when user says: "modifier la récompense", "update reward", "changer les points requis".
Requires business id and reward id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      rewardId: z.number().describe('Reward ID'),
      name: z.string().optional(),
      description: z.string().optional(),
      points_required: z.number().optional(),
      is_active: z.boolean().optional(),
    }),
    execute: async (args) => {
      const { id, rewardId, ...data } = args;
      const response = await fetch(`${BASE}/api/businesses/${id}/loyalty-rewards/${rewardId}`, {
        method: 'PUT',
        headers: authHeaders(accessToken),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to update loyalty reward');
      }
      return response.json();
    },
  }),

  // =====================================================
  // DELETE LOYALTY REWARD
  // =====================================================
  deleteBusinessLoyaltyReward: tool({
    description: `Delete a loyalty reward.
Call when user says: "supprimer la récompense", "delete reward", "remove reward".
Requires business id and reward id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
      rewardId: z.number().describe('Reward ID to delete'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/loyalty-rewards/${args.rewardId}`, {
        method: 'DELETE',
        headers: authHeaders(accessToken),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete loyalty reward');
      }
      return response.json();
    },
  }),

  // =====================================================
  // GET LOYALTY HISTORY
  // =====================================================
  getBusinessLoyaltyHistory: tool({
    description: `Get loyalty scan history for a business (last 50 scans).
Call when user says: "historique fidélité", "derniers scans", "loyalty history", "qui a scanné", "recent scans".
Requires business id.`,
    inputSchema: z.object({
      id: z.number().describe('Business ID'),
    }),
    execute: async (args) => {
      const response = await fetch(`${BASE}/api/businesses/${args.id}/loyalty-history`, {
        method: 'GET',
        headers: authHeaders(accessToken),
        cache: 'no-store',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to fetch loyalty history');
      }
      return response.json();
    },
  }),

  // =====================================================
  // APP Links
  // =====================================================
  // GET APP LINKS
getBusinessAppLinks: tool({
  description: `Get all app links for a business (mobile apps, platforms).
Call when user says: "liens app", "app links", "mes applications", "voir les apps".
Requires business id.`,
  inputSchema: z.object({
    id: z.number().describe('Business ID'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/businesses/${args.id}/app-links`, {
      method: 'GET',
      headers: authHeaders(accessToken),
      cache: 'no-store',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch app links');
    }
    return response.json();
  },
}),

// UPSERT APP LINK
upsertBusinessAppLink: tool({
  description: `Add or update an app link for a business.
Call when user says: "ajouter un lien app", "add app link", "ajouter l'app", "lier une application".
provider_id: platform identifier (e.g. 'ios_app', 'android_app', 'web_app').
value: the URL or store link.
Requires business id.`,
  inputSchema: z.object({
    id: z.number().describe('Business ID'),
    provider_id: z.string().describe('App platform identifier e.g. ios_app, android_app'),
    value: z.string().describe('App URL or store link'),
  }),
  execute: async (args) => {
    const { id, ...data } = args;
    const response = await fetch(`${BASE}/api/businesses/${id}/app-links`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to upsert app link');
    }
    return response.json();
  },
}),

// DELETE APP LINK
deleteBusinessAppLink: tool({
  description: `Delete an app link for a business.
Call when user says: "supprimer le lien app", "delete app link", "enlever l'application".
Requires business id and link id.`,
  inputSchema: z.object({
    id: z.number().describe('Business ID'),
    linkId: z.number().describe('App link ID to delete'),
  }),
  execute: async (args) => {
    const response = await fetch(`${BASE}/api/businesses/${args.id}/app-links/${args.linkId}`, {
      method: 'DELETE',
      headers: authHeaders(accessToken),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete app link');
    }
    return response.json();
  },
}),

});



