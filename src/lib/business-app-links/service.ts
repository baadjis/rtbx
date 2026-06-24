// lib/business-app-links/service.ts

import { createClient }
from '@/utils/supabase/server'

import {
  createBusinessAppLinkSchema,
  updateBusinessAppLinkSchema
} from './validators'

import {
  CreateBusinessAppLinkInput,
  UpdateBusinessAppLinkInput
} from './types'

// =====================================================
// GET LINKS
// =====================================================

export async function getBusinessAppLinks(
  businessId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_app_links'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .order(
      'provider_id'
    )

}

// =====================================================
// UPSERT
// =====================================================

export async function upsertBusinessAppLink(
  input: CreateBusinessAppLinkInput
) {

  const validated =
    createBusinessAppLinkSchema.parse(
      input
    )

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_app_links'
    )

    .upsert(

      validated,

      {

        onConflict:
          'business_id,provider_id'

      }

    )

    .select()

    .single()

}

// =====================================================
// UPDATE
// =====================================================

export async function updateBusinessAppLink(

  id: number,

  input: UpdateBusinessAppLinkInput

) {

  const validated =
    updateBusinessAppLinkSchema.parse(
      input
    )

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_app_links'
    )

    .update(
      validated
    )

    .eq(
      'id',
      id
    )

    .select()

    .single()

}

// =====================================================
// DELETE
// =====================================================

export async function deleteBusinessAppLink(
  id: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_app_links'
    )

    .delete()

    .eq(
      'id',
      id
    )

}