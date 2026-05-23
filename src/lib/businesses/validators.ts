// lib/businesses/validators.ts

import { z } from 'zod'

// =====================================================
// SOCIAL LINK
// =====================================================

export const businessSocialLinkSchema =
  z.object({

    id:
      z.string(),

    network:
      z.string()
        .min(1),

    handle:
      z.string()
        .min(1)

  })

// =====================================================
// LOCATION
// =====================================================

export const businessLocationSchema =
  z.object({

    lat:
      z.number()
        .nullable()
        .optional(),

    lng:
      z.number()
        .nullable()
        .optional()

  })

// =====================================================
// BUSINESS
// =====================================================

export const businessSchema =
  z.object({

    // =================================================
    // CORE
    // =================================================

    id:
      z.string()
        .optional(),

    user_id:
      z.string()
        .optional(),

    created_at:
      z.string()
        .optional(),

    updated_at:
      z.string()
        .optional(),

    // =================================================
    // IDENTITY
    // =================================================

    name:
      z.string()
        .min(2),

    slug:
      z.string()
        .nullable()
        .optional(),

    description:
      z.string()
        .max(500)
        .nullable()
        .optional(),

    business_type:
      z.string()
        .nullable()
        .optional(),

    // =================================================
    // CONTACT
    // =================================================

    phone:
      z.string()
        .max(30)
        .nullable()
        .optional(),

    email:
      z.string()
        .nullable()
        .optional(),

    website:
      z.url()
        .nullable()
        .optional(),

    // =================================================
    // ADDRESS
    // =================================================

    address:
      z.string()
        .nullable()
        .optional(),

    city:
      z.string()
        .nullable()
        .optional(),

    country:
      z.string()
        .nullable()
        .optional(),
    country_code:z.string().nullable().optional(),

    postal_code:
      z.string()
        .nullable()
        .optional(),

    location:
      businessLocationSchema
        .nullable()
        .optional(),

    // =================================================
    // MEDIA
    // =================================================

    avatar_url:
      z.string()
        .nullable()
        .optional(),
        
    logo_url:
      z.string()
        .nullable()
        .optional(),

    banner_url:
      z.string()
        .nullable()
        .optional(),

    // =================================================
    // SOCIAL
    // =================================================

    social_links:
      z.array(
        businessSocialLinkSchema
      )
      .optional(),

    // =================================================
    // GOOGLE
    // =================================================

    source:
      z.enum([
        'google',
        'manual'
      ])
      .optional(),

    google_connected:
      z.boolean()
        .optional(),

    google_place_id:
      z.string()
        .nullable()
        .optional(),

    google_rating:
      z.number()
        .nullable()
        .optional(),

    google_reviews_total:
      z.number()
        .nullable()
        .optional(),

    // =================================================
    // UI
    // =================================================

    theme_color:
      z.string()
        .nullable()
        .optional(),

    bg_color:
      z.string()
        .nullable()
        .optional(),

    // =================================================
    // STATE
    // =================================================

    status:
      z.enum([
        'draft',
        'active',
        'archived'
      ])
      .optional(),

    verified:
      z.boolean()
        .optional()

  })

// =====================================================
// TYPES
// =====================================================

export type BusinessInput =
  z.infer<
    typeof businessSchema
  >