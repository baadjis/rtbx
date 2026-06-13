// utils/booking-providers.ts

// =====================================================
// TYPES
// =====================================================

export type BookingProviderId =
  | 'thefork'
  | 'opentable'
  | 'resy'
  | 'calendly'
  | 'booking'
  | 'airbnb'
  | 'doctolib'
  | 'treatwell'
  | 'planity'
  | 'fresha'
  | 'booksy'

   

// =====================================================

export type BookingProvider = {

  id: BookingProviderId

  name: string

  /**
   * Champ attendu
   *
   * Ex:
   * slug
   * listing_id
   * url
   */
  field: string

  /**
   * URL booking
   */
  bookingBaseUrl: string

  /**
   * Paramètre URL
   *
   * null:
   * append direct
   */
  bookingUrlParameter?: string | null

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

export const BOOKING_PROVIDERS:
Record<
  BookingProviderId,
  BookingProvider
> = {

  // ===================================================
  // THEFORK
  // ===================================================

  thefork: {

    id: 'thefork',

    name: 'TheFork',

    field: 'slug',

    bookingBaseUrl:
      'https://www.thefork.fr/restaurant/',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'cafe'
    ],

    placeholder:
      'pink-mamma-paris-r12345'

  },

  // ===================================================
  // OPENTABLE
  // ===================================================

  opentable: {

    id: 'opentable',

    name: 'OpenTable',

    field: 'slug',

    bookingBaseUrl:
      'https://www.opentable.com/r/',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'restaurant'
    ],

    placeholder:
      'restaurant-name-city'

  },

  // ===================================================
  // RESY
  // ===================================================

  resy: {

    id: 'resy',

    name: 'Resy',

    field: 'slug',

    bookingBaseUrl:
      'https://resy.com/cities/',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'restaurant'
    ],

    placeholder:
      'restaurant-name'

  },

  // ===================================================
  // CALENDLY
  // ===================================================

  calendly: {

    id: 'calendly',

    name: 'Calendly',

    field: 'slug',

    bookingBaseUrl:
      'https://calendly.com/',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'consulting',
      'beauty',
      'fitness',
      'agency',
      'all'
    ],

    placeholder:
      'username'

  },

  // ===================================================
  // BOOKING.COM
  // ===================================================

  booking: {

    id: 'booking',

    name: 'Booking.com',

    field: 'url',

    bookingBaseUrl: '',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'hotel',
      'hospitality'
    ],

    placeholder:
      'https://booking.com/hotel/...'

  },

  // ===================================================
  // AIRBNB
  // ===================================================

  airbnb: {

    id: 'airbnb',

    name: 'Airbnb',

    field: 'url',

    bookingBaseUrl: '',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'hotel',
      'hospitality',
      'rental'
    ],

    placeholder:
      'https://airbnb.com/rooms/...'

  },

  // ===================================================
  // DOCTOLIB
  // ===================================================

  doctolib: {

    id: 'doctolib',

    name: 'Doctolib',

    field: 'slug',

    bookingBaseUrl:
      'https://www.doctolib.fr/',

    bookingUrlParameter:
      null,

    supported_business_types: [
      'medical',
      'healthcare'
    ],

    placeholder:
      'medecin/paris/dr-john-doe'

  },
  planity: {

  id: 'planity',

  name: 'Planity',

  field: 'slug',

  bookingBaseUrl:
    'https://www.planity.com/',

  bookingUrlParameter:
    null,

  supported_business_types: [
    'beauty',
    'hairdresser',
    'barber',
    'spa',
    'wellness'
  ],

  placeholder:
    'mon-salon-75011-paris'

},
treatwell: {

  id: 'treatwell',

  name: 'Treatwell',

  field: 'url',

  bookingBaseUrl: '',

  bookingUrlParameter:
    null,

  supported_business_types: [
    'beauty',
    'hairdresser',
    'spa',
    'massage',
    'wellness'
  ],

  placeholder:
    'https://www.treatwell.fr/salon/...'

},
fresha: {

  id: 'fresha',

  name: 'Fresha',

  field: 'slug',

  bookingBaseUrl:
    'https://www.fresha.com/a/',

  bookingUrlParameter:
    null,

  supported_business_types: [
    'beauty',
    'hairdresser',
    'barber',
    'spa',
    'nails',
    'massage',
    'wellness'
  ],

  placeholder:
    'business-name-city'

},

booksy: {

  id: 'booksy',

  name: 'Booksy',

  field: 'slug',

  bookingBaseUrl:
    'https://booksy.com/en-us/',

  bookingUrlParameter:
    null,

  supported_business_types: [
    'beauty',
    'hairdresser',
    'barber',
    'tattoo',
    'wellness'
  ],

  placeholder:
    'business-name'

},



}

// =====================================================
// GET PROVIDER
// =====================================================

export function getBookingProvider(
  providerId: string
) {

  return BOOKING_PROVIDERS[
    providerId as BookingProviderId
  ]

}

// =====================================================
// INTERNAL FORMATTER
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
    !value
  ) {
    return null
  }

  // ===============================================
  // RAW URL
  // ===============================================

  if (
    !baseUrl
  ) {

    return value

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
// FORMAT BOOKING URL
// =====================================================

export function formatBookingProviderUrl(
  providerId: string,
  value: string
) {

  const provider =
    getBookingProvider(providerId)

  if (!provider)
    return null

  return formatProviderUrl({

    baseUrl:
      provider.bookingBaseUrl,

    parameter:
      provider.bookingUrlParameter,

    value

  })

}