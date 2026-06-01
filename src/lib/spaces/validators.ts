import { z } from 'zod'

/* =========================================================
   SOCIAL LINKS
========================================================= */

export const SocialLinkSchema = z.object({

  id: z
    .string()
    .min(1),

  network: z
    .string()
    .min(1)
    .max(60),

  handle: z
    .string()
    .min(1)
    .max(120)

})

/* =========================================================
   SPACE TYPES
========================================================= */

export const SpaceTypeSchema = z.enum([
  'personal',
  'organization',
  'business',
  'developper',
  'startup'
])

/* =========================================================
   CREATE SPACE
========================================================= */

export const SpaceAddSchema = z.object({

  user_id: z
    .string()
    .nullable()
    .optional(),

  email: z
    .string()
    .min(3)
    .max(40),

  slug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/),

  space_type:
    SpaceTypeSchema,

  space_subtype: z
    .string()
    .max(80)
    .optional(),

  entity_name: z
    .string()
    .max(120)
    .nullable()
    .optional(),

  social_data: z
    .array(SocialLinkSchema)
    .optional()
    .default([]),

  theme_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/)
    .optional(),

  bg_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/)
    .optional(),

  avatar_url: z
    .string()
    .nullable()
    .optional(),

  edit_token: z
    .string()
    .optional(),

  legal_accepted_at: z
    .string()
    .optional(),

  is_authorized_representative: z
    .boolean()
    .optional()

})

/* =========================================================
   UPDATE SPACE
========================================================= */

export const SpaceUpdateSchema = z.object({

  entity_name: z
    .string()
    .max(120).nullable()
    .optional(),

  social_data: z
    .array(SocialLinkSchema)
    .optional(),

  theme_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/)
    .optional(),

  bg_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/)
    .optional(),

  avatar_url: z
    .string()
    .nullable()
    .optional(),

  

})

/* =========================================================
   TOKEN VALIDATION
========================================================= */

export const EditTokenSchema = z.object({

  token: z
    .string()
    .min(10)

})

export const spaceSearchSchema = z.object({
  q: z.string().optional(),
  space_type: z.enum(['personal', 'business', 'creator']).optional(),
  space_subtype: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const addSocialLinkSchema = z.object({
  network: z.string().min(1, 'Network requis'),
  handle: z.string().min(1, 'Handle requis'),
});

export const updateSocialLinkSchema = z.object({
  id: z.string().uuid('ID invalide'),
  network: z.string().optional(),
  handle: z.string().optional(),
});

export const deleteSocialLinkSchema = z.object({
  id: z.string().uuid('ID invalide'),
});

export type AddSocialLinkInput = z.infer<typeof addSocialLinkSchema>;
export type UpdateSocialLinkInput = z.infer<typeof updateSocialLinkSchema>;
export type DeleteSocialLinkInput = z.infer<typeof deleteSocialLinkSchema>;

export type SpaceSearchInput = z.infer<typeof spaceSearchSchema>;

/* =========================================================
   EXPORT TYPES
========================================================= */

export type SocialLinkInput =
  z.infer<typeof SocialLinkSchema>

export type SpaceAddInput =
  z.infer<typeof SpaceAddSchema>

export type SpaceUpdateInput =
  z.infer<typeof SpaceUpdateSchema>