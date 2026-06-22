import { createClient }
from '@/utils/supabase/server'

import {
  OpeningHourInput
} from './validators'

export async function
getBusinessOpeningHours(
  businessId: number
) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_opening_hours'
    )

    .select('*')

    .eq(
      'business_id',
      businessId
    )

    .order(
      'day_of_week'
    )

}


export async function
saveBusinessOpeningHours(

  businessId: number,

  hours: OpeningHourInput[]

) {

  const supabase =
    await createClient()

  return supabase

    .from(
      'business_opening_hours'
    )

    .upsert(

      hours.map(
        item => ({

          ...item,

          business_id:
            businessId

        })
      ),

      {

        onConflict:
          'business_id,day_of_week'

      }

    )

}