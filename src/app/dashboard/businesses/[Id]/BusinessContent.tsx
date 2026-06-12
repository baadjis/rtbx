/* eslint-disable @typescript-eslint/no-explicit-any */

import { LatestGoogleReviews } from './LatestGoogleReviews'
import LoyaltyHistory from './LoyaltyHistory'

type Props = {
  business: any
  reviews: any[]
  loading: boolean
  history: any[]
  t: any
}

export default function BusinessContent({
  business,
  reviews,
  loading,
  history,
  t
}: Props) {

  // =====================================================
  // NO GOOGLE
  // =====================================================

  if (!business.google_place_id) {

    return (

      <div className="max-w-3xl">

        <LoyaltyHistory
          t={t}
          history={history}
        />

      </div>

    )

  }

  // =====================================================
  // GOOGLE ENABLED
  // =====================================================

  return (

    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-[1.6fr_0.9fr]
        gap-8
        items-start
      "
    >

      <LatestGoogleReviews
        t={t}
        reviews={reviews}
        loading={loading}
      />

      <LoyaltyHistory
        t={t}
        history={history}
      />

    </div>

  )

}