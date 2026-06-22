import { z } from 'zod'

export const openingHourSchema =
  z.object({

    id:
      z.number()
        .optional(),

    business_id:
      z.number(),

    day_of_week:
      z.number()
        .min(0)
        .max(6),

    is_closed:
      z.boolean(),

    open_time:
      z.string()
        .nullable()
        .optional(),

    close_time:
      z.string()
        .nullable()
        .optional()

  })

export type OpeningHourInput =
  z.infer<
    typeof openingHourSchema
  >