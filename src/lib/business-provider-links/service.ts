import { createClient }
from '@/utils/supabase/server'

import {
  businessProviderLinkSchema,
  BusinessProviderLinkInput
}
from './validators'

import {
  ProviderCategory
}
from './types'

// =====================================================
// GET ALL
// =====================================================

export async function getBusinessProviderLinks(
  businessId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_provider_links'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .order(
      'provider_category'
    )

}

// =====================================================
// GET BY CATEGORY
// =====================================================

export async function getBusinessProviderLinksByCategory(
  businessId: number,
  category: ProviderCategory
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_provider_links'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .eq(
      'provider_category',
      category
    )

}

// =====================================================
// GET ONE
// =====================================================

export async function getBusinessProviderLink(
  businessId: number,
  category: ProviderCategory,
  providerId: string
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_provider_links'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .eq(
      'provider_category',
      category
    )

    .eq(
      'provider_id',
      providerId
    )

    .maybeSingle()

}

// =====================================================
// CREATE
// =====================================================

export async function createBusinessProviderLink(
  payload: BusinessProviderLinkInput
) {

  const parsed =
    businessProviderLinkSchema
      .safeParse(payload)

  if (!parsed.success) {

    return {

      data: null,

      error:
        parsed.error.flatten()

    }

  }

  const supabase =
    await createClient()

  const {
    data,
    error
  } = await supabase

    .from(
      'business_provider_links'
    )

    .insert(parsed.data)

    .select()

    .single()

  return {
    data,
    error
  }

}

// =====================================================
// UPSERT
// =====================================================

export async function upsertBusinessProviderLink(
  payload: BusinessProviderLinkInput
) {

  const parsed =
    businessProviderLinkSchema
      .safeParse(payload)

  if (!parsed.success) {

    return {

      data: null,

      error:
        parsed.error.flatten()

    }

  }

  const supabase =
    await createClient()

  const {
    data,
    error
  } = await supabase

    .from(
      'business_provider_links'
    )

    .upsert(
      parsed.data,
      {
        onConflict:
          'business_id,provider_category,provider_id'
      }
    )

    .select()

    .single()

  return {
    data,
    error
  }

}

// =====================================================
// UPDATE VALUE
// =====================================================

export async function updateBusinessProviderLink(
  businessId: number,
  category: ProviderCategory,
  providerId: string,
  value: string
) {

  const supabase =
    await createClient()

  const {
    data,
    error
  } = await supabase

    .from(
      'business_provider_links'
    )

    .update({

      value

    })

    .eq(
      'business_id',
      businessId
    )

    .eq(
      'provider_category',
      category
    )

    .eq(
      'provider_id',
      providerId
    )

    .select()

    .single()

  return {
    data,
    error
  }

}

// =====================================================
// DELETE
// =====================================================

export async function deleteBusinessProviderLink(
  businessId: number,
  category: ProviderCategory,
  providerId: string
) {

  const supabase =
    await createClient()

  const {
    error
  } = await supabase

    .from(
      'business_provider_links'
    )

    .delete()

    .eq(
      'business_id',
      businessId
    )

    .eq(
      'provider_category',
      category
    )

    .eq(
      'provider_id',
      providerId
    )

  return {
    error
  }

}