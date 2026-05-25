/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'

import Script from 'next/script'

import BusinessHeader from './BusinessHeader'
import Kpi from './Kpi'
import { LatestGoogleReviews } from './LatestGoogleReviews'
import LoyaltyHistory from './LoyaltyHistory'

interface Props {

  business: any

  t: any

  loyaltyStats: {
    totalCustomers: number
    totalPoints: number
  }

  history: any[]

}

export default function BusinessDetailsClient({

  business,
  t,
  loyaltyStats,
  history

}: Props) {

  // =====================================================
  // GOOGLE REVIEWS
  // =====================================================

  const [reviews, setReviews] =
    useState<any[]>([])

  const [googleMeta, setGoogleMeta] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  // =====================================================
  // REVIEW PROVIDERS
  // =====================================================

  const reviewProviders = useMemo(() => {

    const providers: any[] = []

    // GOOGLE

    if (googleMeta) {

      providers.push({

        provider: 'google',

        rating:
          googleMeta.rating,

        total:
          googleMeta.total

      })

    }

    // FUTURE:
    // trustpilot
    // booking
    // tripadvisor
    // etc

    return providers

  }, [googleMeta])

  // =====================================================
  // GOOGLE FETCH
  // =====================================================

  const fetchGoogleData = () => {

    if (

      typeof window === 'undefined' ||

      !window.google ||

      !window.google.maps ||

      !window.google.maps.places ||

      !business.google_place_id

    ) {

      setLoading(false)

      return

    }

    const service =

      new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

    service.getDetails(

      {

        placeId:
          business.google_place_id,

        fields: [

          'reviews',

          'rating',

          'user_ratings_total'

        ]

      },

      (
        place: any,
        status: any
      ) => {

        if (

          status ===

          window.google.maps.places
            .PlacesServiceStatus.OK

        ) {

          setReviews(
            place.reviews || []
          )

          setGoogleMeta({

            rating:
              place.rating,

            total:
              place.user_ratings_total

          })

        }

        setLoading(false)

      }

    )

  }

  return (

    <div className="
      max-w-7xl mx-auto
      px-4 md:px-6
      py-8
      space-y-8
      animate-in fade-in
      duration-700
    ">

      {/* GOOGLE SCRIPT */}

      {!!business.google_place_id && (

        <Script

          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}

          onReady={fetchGoogleData}

        />

      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <BusinessHeader
        t={t}
        business={business}
      />

      {/* =====================================================
          KPI
      ===================================================== */}

      <Kpi

        t={t}

        loyaltyStats={
          loyaltyStats
        }

        reviewProviders={
          reviewProviders
        }

      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="
        grid grid-cols-1
        lg:grid-cols-3
        gap-8
      ">

        {/* GOOGLE REVIEWS */}

        <LatestGoogleReviews

          t={t}

          reviews={reviews}

          loading={loading}

        />

        {/* LOYALTY HISTORY */}

        <LoyaltyHistory

          t={t}

          history={history}

        />

      </div>

    </div>

  )

}