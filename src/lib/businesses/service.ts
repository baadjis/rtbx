// lib/businesses/service.ts

//import { createClient } from '@/utils/supabase/client'

import { createClient }
from '@/utils/supabase/admin'

import {
  businessSchema,
  BusinessInput
} from './validators'

// =====================================================
// CREATE
// =====================================================

export async function createBusiness(
  payload: BusinessInput
) {

  const supabase =
    createClient()

  // VALIDATION

  const parsed =
    businessSchema.safeParse(
      payload
    )

  if (!parsed.success) {

    return {

      data: null,

      error:
        parsed.error.flatten()

    }

  }

  // INSERT

  const {
    data,
    error
  } = await supabase

    .from('businesses')

    .insert(parsed.data)

    .select()

    .single()
  console.error(error)
  console.log(error)

  return {
    data,
    error
  }

}

// =====================================================
// UPDATE
// =====================================================

export async function updateBusiness(
  id: string,
  user_id: string,
  payload: Partial<BusinessInput>
) {

  const supabase =
    createClient()

  // VALIDATION

  const parsed =
    businessSchema
      .partial()
      .safeParse(payload)

  if (!parsed.success) {

    return {

      data: null,

      error:
        parsed.error.flatten()

    }

  }

  // UPDATE + OWNERSHIP CHECK

  const {
    data,
    error
  } = await supabase

    .from('businesses')

    .update({

      ...parsed.data,

      updated_at:
        new Date()
          .toISOString()

    })

    .eq('id', id)

    .eq(
      'user_id',
      user_id
    )

    .select()

    .single()

  // NOT FOUND / UNAUTHORIZED

  if (!data) {

    return {

      data: null,

      error:
        'Business not found or unauthorized'

    }

  }

  return {
    data,
    error
  }

}

// =====================================================
// DELETE
// =====================================================

export async function deleteBusiness(
  id: string,
  user_id: string
) {

  const supabase =
    createClient()

  const {
    data,
    error
  } = await supabase

    .from('businesses')

    .delete()

    .eq('id', id)

    .eq(
      'user_id',
      user_id
    )

    .select()

    .single()

  if (!data) {

    return {

      error:
        'Business not found or unauthorized'

    }

  }

  return {
    error
  }

}

// =====================================================
// GET ONE
// =====================================================

export async function getBusiness(
  id: string,
  user_id: string
) {

  const supabase =
    createClient()

  const {
    data,
    error
  } = await supabase

    .from('businesses')

    .select('*')

    .eq('id', id)

    .eq(
      'user_id',
      user_id
    )

    .single()

  if (!data) {

    return {

      data: null,

      error:
        'Business not found or unauthorized'

    }

  }

  return {
    data,
    error
  }

}

// =====================================================
// GET USER BUSINESSES
// =====================================================

export async function getUserBusinesses(
  user_id: string, limit: number = 10,
  offset: number = 0
) {

  const supabase =
    createClient()

  const {
    data,
    error
  } = await supabase

    .from('businesses')

    .select('*')

    .eq(
      'user_id',
      user_id
    ).order(
      'created_at',
      {
        ascending: false
      }
    ).range(offset, offset + limit - 1)

  return {
    data,
    error
  }

}