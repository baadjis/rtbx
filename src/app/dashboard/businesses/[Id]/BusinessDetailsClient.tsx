/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'

import Script from 'next/script'
import BusinessHeader from './BusinessHeader'
import Kpi from './Kpi'
import { LatestGoogleReviews } from './LatestGoogleReviews'
import LoyaltyHistory from './LoyaltyHistory'

interface Props {
  business: any;
  t: any;
  loyaltyStats: {
    totalCustomers: number;
    totalPoints: number;
  };
  history: any[];
}

export default function BusinessDetailsClient({ business, t, loyaltyStats, history }: Props) {
  const [reviews, setReviews] = useState<any[]>([])
  const [googleMeta, setGoogleMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  

  /*const fetchGoogleData = () => {
    if (!window.google || !business.place_id) return
    
    const service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails({
      placeId: business.place_id,
      fields: ['review', 'rating', 'user_ratings_total']
    }, (place: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setReviews(place.reviews || [])
        setGoogleMeta({
            rating: place.rating,
            total: place.user_ratings_total
        })
      }
      setLoading(false)
    })
  }*/

  const fetchGoogleData = () => {

  if (
    typeof window === 'undefined' ||
    !window.google ||
    !window.google.maps ||
    !window.google.maps.places ||
    !business.place_id
  ) {
    return
  }

  const service =
    new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

  service.getDetails(
    {
      placeId: business.google_place_id,
      fields: [
        'reviews',
        'rating',
        'user_ratings_total'
      ]
    },
    (place: any, status: any) => {

      if (
        status ===
        window.google.maps.places.PlacesServiceStatus.OK
      ) {

        setReviews(
          place.reviews || []
        )

        setGoogleMeta({
          rating: place.rating,
          total: place.user_ratings_total
        })

      }

      setLoading(false)

    }
  )
}

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-in fade-in duration-700">
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onReady={fetchGoogleData}
      />

      {/* --- SECTION 1 : HEADER & ACTIONS --- */}
      <BusinessHeader   t={t} business={business}/>

      {/* --- SECTION 2 : KPI RÉEL (FIDÉLITÉ) --- */}
      <Kpi  googleMeta={googleMeta} t={t} loyaltyStats={loyaltyStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLONNE : AVIS GOOGLE (2/3) --- */}
        <LatestGoogleReviews  t={t} reviews={reviews} loading={loading}/>

        {/* --- SIDEBAR : ACTIVITÉ RÉCENTE (1/3) --- */}
        <LoyaltyHistory  t={t} history={history}/>
      </div>
    </div>
  )
}