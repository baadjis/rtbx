// lib/businesses/types.ts

import { CountryCode } from "libphonenumber-js/core"

export type BusinessSource =
  | 'google'
  | 'manual'

export type BusinessStatus =
  | 'draft'
  | 'active'
  | 'archived'

export type BusinessSocialLink = {
  id: string

  network: string

  handle: string
}

export type BusinessLocation = {
  lat?: number | null
  lng?: number | null
}

export type BusinessType = {
  // =====================================================
  // CORE
  // =====================================================

  id?: string

  user_id?: string

  created_at?: string

  updated_at?: string

  // =====================================================
  // BUSINESS IDENTITY
  // =====================================================

  name: string

  slug?: string | null

  description?: string | null

  business_type?: string | null

  // =====================================================
  // CONTACT
  // =====================================================

  phone?: string | null

  email?: string | null

  website?: string | null

  // =====================================================
  // ADDRESS
  // =====================================================

  address?: string | null

  city?: string | null

  country?: string | null
  country_code?:CountryCode|null

  postal_code?: string | null

  location?: BusinessLocation | null

  // =====================================================
  // MEDIA
  // =====================================================

  avatar_url?: string | null
  logo_url?: string | null

  banner_url?: string | null

  // =====================================================
  // SOCIAL
  // =====================================================

  social_links?: BusinessSocialLink[]

  // =====================================================
  // GOOGLE
  // =====================================================

  source?: BusinessSource

  google_connected?: boolean

  google_place_id?: string | null

  google_rating?: number | null

  google_reviews_total?: number | null

  // =====================================================
  // UI / CUSTOMIZATION
  // =====================================================

  theme_color?: string | null

  bg_color?: string | null

  // =====================================================
  // STATE
  // =====================================================

  status?: BusinessStatus

  verified?: boolean
}