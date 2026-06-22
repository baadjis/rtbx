import { createClient }
from '@/utils/supabase/server'

import {

  loyaltySettingsSchema,

  loyaltyRewardSchema,

  LoyaltySettingsInput,

  LoyaltyRewardInput

} from './validators'



export async function getBusinessLoyaltySettings(
  businessId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_loyalty_settings'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .single()

}


export async function saveBusinessLoyaltySettings(
  payload: LoyaltySettingsInput
) {

  const parsed =
    loyaltySettingsSchema.safeParse(
      payload
    )

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
      'business_loyalty_settings'
    )

    .upsert({

      ...parsed.data,

      updated_at:
        new Date()
          .toISOString()

    })

    .select()

    .single()

  return {
    data,
    error
  }

}


export async function getBusinessLoyaltyRewards(
  businessId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_loyalty_rewards'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .order(
      'points_required'
    )

}


export async function createBusinessLoyaltyReward(
  payload: LoyaltyRewardInput
) {

  const parsed =
    loyaltyRewardSchema.safeParse(
      payload
    )

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
      'business_loyalty_rewards'
    )

    .insert(
      parsed.data
    )

    .select()

    .single()

  return {
    data,
    error
  }

}


export async function updateBusinessLoyaltyReward(

  rewardId: number,

  payload: Partial<LoyaltyRewardInput>

) {

  const supabase =
    await createClient()

  const {
    data,
    error
  } = await supabase

    .from(
      'business_loyalty_rewards'
    )

    .update({

      ...payload,

      updated_at:
        new Date()
          .toISOString()

    })

    .eq(
      'id',
      rewardId
    )

    .select()

    .single()

  return {
    data,
    error
  }

}


export async function deleteBusinessLoyaltyReward(
  rewardId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_loyalty_rewards'
    )

    .delete()

    .eq(
      'id',
      rewardId
    )

}