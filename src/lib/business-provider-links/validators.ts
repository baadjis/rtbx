import { z } from 'zod'

export const businessProviderLinkSchema =
  z.object({

    id:
      z.string()
        .optional(),

    business_id:
      z.number(),

    provider_category:
      z.enum([
        'review',
        'booking',
        'delivery',
        'marketplace'
      ]),

    provider_id:
      z.string()
        .min(1),

    value:
      z.string()
        .min(1),

    created_at:
      z.string()
        .optional(),

    updated_at:
      z.string()
        .optional()

  })

export type BusinessProviderLinkInput =
  z.infer<
    typeof businessProviderLinkSchema
  >