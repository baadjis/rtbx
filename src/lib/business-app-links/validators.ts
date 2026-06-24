// lib/business-app-links/validators.ts

import { z } from 'zod'

export const createBusinessAppLinkSchema =
  z.object({

    business_id:
      z.number(),

    provider_id:
      z.string()
        .min(1),

    value:
      z.string()
        .url()

  })

export const updateBusinessAppLinkSchema =
  z.object({

    value:
      z.string()
        .url()

  })

export type CreateBusinessAppLinkInput =
  z.infer<
    typeof createBusinessAppLinkSchema
  >

export type UpdateBusinessAppLinkInput =
  z.infer<
    typeof updateBusinessAppLinkSchema
  >