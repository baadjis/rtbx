// utils/review-providers.ts

// =====================================================
// TYPES
// =====================================================

export type ReviewProviderId =
  | 'google'
  | 'trustpilot'
  | 'tripadvisor'
  | 'thefork'
  | 'yelp'

export type ReviewProvider = {

  id: ReviewProviderId

  name: string

  /**
   * Champ attendu
   *
   * Ex:
   * place_id
   * slug
   * url
   */
  field: string

  /**
   * URL review
   */
  reviewBaseUrl: string

  /**
   * Paramètre review
   *
   * null:
   * append direct
   */
  reviewUrlParameter?: string | null

  /**
   * URL publique
   */
  publicBaseUrl?: string

  /**
   * Paramètre public
   *
   * null:
   * append direct
   */
  publicUrlParameter?: string | null

  /**
   * Types compatibles
   */
  supported_business_types: string[]

  /**
   * Placeholder UI
   */
  placeholder?: string

}

// =====================================================
// PROVIDERS
// =====================================================

export const REVIEW_PROVIDERS:
Record<
  ReviewProviderId,
  ReviewProvider
> = {

  // ===================================================
  // GOOGLE
  // ===================================================

  google: {

    id: 'google',

    name: 'Google',

    field: 'place_id',

    reviewBaseUrl:
      'https://search.google.com/local/writereview',

    reviewUrlParameter:
      'placeid',

    publicBaseUrl:
      'https://www.google.com/maps/place/',

    publicUrlParameter:
      null,

    supported_business_types: [
      'all'
    ],

    placeholder:
      'ChIJN1t_tDeuEmsRUsoyG83frY4'

  },

  // ===================================================
  // TRUSTPILOT
  // ===================================================

  trustpilot: {

    id: 'trustpilot',

    name: 'Trustpilot',

    field: 'slug',

    reviewBaseUrl:
      'https://www.trustpilot.com/review/',

    reviewUrlParameter:
      null,

    publicBaseUrl:
      'https://www.trustpilot.com/review/',

    publicUrlParameter:
      null,

    supported_business_types: [
      'all'
    ],

    placeholder:
      'example.com'

  },

  // ===================================================
  // TRIPADVISOR
  // ===================================================

  tripadvisor: {

    id: 'tripadvisor',

    name: 'Tripadvisor',

    field: 'url',

    reviewBaseUrl: '',

    reviewUrlParameter:
      null,

    publicBaseUrl: '',

    publicUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'hotel',
      'tourism'
    ],

    placeholder:
      'https://tripadvisor.com/...'

  },
  thefork: {

  id: 'thefork',

name: 'TheFork',

 

  supported_business_types: [
    'restaurant',
    'cafe'
  ],

  field: 'slug',

  reviewBaseUrl:
    'https://www.thefork.fr/restaurant/',

  reviewUrlParameter: null,

  publicBaseUrl:
    'https://www.thefork.fr/restaurant/',

  publicUrlParameter: null

},
yelp: {

  id: 'yelp',

  name: 'Yelp',

  field: 'slug',

  reviewBaseUrl:
    'https://www.yelp.com/biz/',

  reviewUrlParameter:
    null,

  publicBaseUrl:
    'https://www.yelp.com/biz/',

  publicUrlParameter:
    null,

  supported_business_types: [
    'restaurant',
    'hotel',
    'cafe',
    'bar',
    'beauty',
    'local_business'
  ],

  placeholder:
    'pink-mamma-paris'

},

}

// =====================================================
// GET PROVIDER
// =====================================================

export function getReviewProvider(
  providerId: string
) {

  return REVIEW_PROVIDERS[
    providerId as ReviewProviderId
  ]

}

// =====================================================
// INTERNAL URL FORMATTER
// =====================================================

function formatProviderUrl({
  baseUrl,
  parameter,
  value
}: {
  baseUrl?: string
  parameter?: string | null
  value: string
}) {

  if (
    !baseUrl ||
    !value
  ) {
    return null
  }

  // ===============================================
  // WITH QUERY PARAM
  // ===============================================

  if (parameter) {

    return `${baseUrl}?${parameter}=${encodeURIComponent(value)}`

  }

  // ===============================================
  // DIRECT APPEND
  // ===============================================

  return `${baseUrl}${value}`

}

// =====================================================
// REVIEW URL
// =====================================================

export function formatReviewProviderUrl(
  providerId: string,
  value: string
) {

  const provider =
    getReviewProvider(providerId)

  if (!provider)
    return null

  return formatProviderUrl({

    baseUrl:
      provider.reviewBaseUrl,

    parameter:
      provider.reviewUrlParameter,

    value

  })

}

// =====================================================
// PUBLIC URL
// =====================================================

export function formatReviewProviderPublicUrl(
  providerId: string,
  value: string
) {

  const provider =
    getReviewProvider(providerId)

  if (!provider)
    return null

  return formatProviderUrl({

    baseUrl:
      provider.publicBaseUrl,

    parameter:
      provider.publicUrlParameter,

    value

  })

}