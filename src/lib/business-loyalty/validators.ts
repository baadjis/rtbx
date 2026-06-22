import { z } from 'zod'

export const loyaltySettingsSchema =
  z.object({

    business_id:
      z.number(),

    enabled:
      z.boolean(),

    points_per_visit:
      z.number()
        .min(1),

    welcome_bonus_points:
      z.number()
        .min(0)

  })

export const loyaltyRewardSchema =
  z.object({

    business_id:
      z.number(),

    title:
      z.string()
        .min(1)
        .max(120),

    description:
      z.string()
        .nullable()
        .optional(),

    points_required:
      z.number()
        .min(1),

    active:
      z.boolean()
        .default(true)

  })

export type LoyaltySettingsInput =
  z.infer<
    typeof loyaltySettingsSchema
  >

export type LoyaltyRewardInput =
  z.infer<
    typeof loyaltyRewardSchema
  >