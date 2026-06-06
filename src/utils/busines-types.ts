// utils/business-types.ts

import {
  REVIEW_PROVIDERS
} from './review-providers'

import {
  BOOKING_PROVIDERS
} from './booking-providers'

import {
  DELIVERY_PROVIDERS
} from './delivery-providers'

import {
  MARKETPLACE_PROVIDERS
} from './marketplace-providers'
import { LangType } from '@/lib/lang/types'

// =====================================================
// BUSINESS TYPES
// =====================================================

export const BUSINESS_TYPES = [

  // FOOD

  'restaurant',
  'cafe',
  'bakery',

  // HOSPITALITY

  'hotel',
  'hospitality',
  'rental',

  // BEAUTY

  'beauty',
  'hairdresser',
  'barber',
  'spa',

  // HEALTH

  'medical',
  'healthcare',

  // FITNESS

  'fitness',

  // BUSINESS

  'agency',
  'consulting',

  // CREATOR

  'creator',

  // EDUCATION

  'education',

  // COMMERCE

  'retail'

] as const

export type BusinessType =
  typeof BUSINESS_TYPES[number]

// =====================================================
// LABELS
// =====================================================

export const BUSINESS_TYPE_LABELS = {

  en: {

    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bakery: 'Bakery',

    hotel: 'Hotel',
    hospitality: 'Hospitality',
    rental: 'Rental',

    beauty: 'Beauty',
    hairdresser: 'Hairdresser',
    barber: 'Barber',
    spa: 'Spa',

    medical: 'Medical',
    healthcare: 'Healthcare',

    fitness: 'Fitness',

    agency: 'Agency',
    consulting: 'Consulting',

    creator: 'Content Creator',

    education: 'Education',

    retail: 'Retail Store'

  },

  fr: {

    restaurant: 'Restaurant',
    cafe: 'Café',
    bakery: 'Boulangerie',

    hotel: 'Hôtel',
    hospitality: 'Hôtellerie',
    rental: 'Location',

    beauty: 'Beauté',
    hairdresser: 'Coiffeur',
    barber: 'Barbier',
    spa: 'Spa',

    medical: 'Médical',
    healthcare: 'Santé',

    fitness: 'Fitness',

    agency: 'Agence',
    consulting: 'Consultant',

    creator: 'Créateur de contenu',

    education: 'Éducation',

    retail: 'Commerce'

  }

} as const

// =====================================================
// GET LABEL
// =====================================================

export function getBusinessTypeLabel(
  type: string,
  lang: LangType = 'en'
) {

  return (

    BUSINESS_TYPE_LABELS[
      lang
    ]?.[
      type as keyof typeof BUSINESS_TYPE_LABELS.en
    ] ||

    type

  )

}

// =====================================================
// OPTIONS FOR SELECT
// =====================================================

export function getBusinessTypeOptions(
  lang: LangType = 'en'
) {

  return BUSINESS_TYPES.map(
    (type) => ({

      value: type,

      label:
        getBusinessTypeLabel(
          type,
          lang
        )

    })
  )

}

// =====================================================
// GET PROVIDERS
// =====================================================

export function getProviders(
  businessType: string
) {

  const reviews =
    Object.values(
      REVIEW_PROVIDERS
    ).filter(

      provider =>

        provider.supported_business_types.includes(
          businessType
        ) ||

        provider.supported_business_types.includes(
          'all'
        )

    )

  const bookings =
    Object.values(
      BOOKING_PROVIDERS
    ).filter(

      provider =>

        provider.supported_business_types.includes(
          businessType
        ) ||

        provider.supported_business_types.includes(
          'all'
        )

    )

  const delivery =
    Object.values(
      DELIVERY_PROVIDERS
    ).filter(

      provider =>

        provider.supported_business_types.includes(
          businessType
        ) ||

        provider.supported_business_types.includes(
          'all'
        )

    )

  const marketplaces =
    Object.values(
      MARKETPLACE_PROVIDERS
    ).filter(

      provider =>

        provider.supported_business_types.includes(
          businessType
        ) ||

        provider.supported_business_types.includes(
          'all'
        )

    )

  return {

    reviews,

    bookings,

    delivery,

    marketplaces

  }

}

// =====================================================
// GET ALL PROVIDERS FLAT
// =====================================================

export function getAllProviders(
  businessType: string
) {

  const {
    reviews,
    bookings,
    delivery,
    marketplaces
  } = getProviders(
    businessType
  )

  return [

    ...reviews,

    ...bookings,

    ...delivery,

    ...marketplaces

  ]

}