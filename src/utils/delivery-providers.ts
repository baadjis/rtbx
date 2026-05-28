// utils/delivery-providers.ts

// =====================================================
// TYPES
// =====================================================

export type DeliveryProviderId =
  | 'ubereats'
  | 'deliveroo'
  | 'doordash'
  | 'glovo'
  | 'justeat'

// =====================================================

export type DeliveryProvider = {

  id: DeliveryProviderId

  name: string

  /**
   * Champ attendu
   *
   * Ex:
   * slug
   * url
   * store_id
   */
  field: string

  /**
   * URL commande/livraison
   */
  deliveryBaseUrl: string

  /**
   * Paramètre URL
   *
   * null:
   * append direct
   */
  deliveryUrlParameter?: string | null

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

export const DELIVERY_PROVIDERS:
Record<
  DeliveryProviderId,
  DeliveryProvider
> = {

  // ===================================================
  // UBER EATS
  // ===================================================

  ubereats: {

    id: 'ubereats',

    name: 'Uber Eats',

    field: 'url',

    deliveryBaseUrl: '',

    deliveryUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'cafe',
      'bakery',
      'food'
    ],

    placeholder:
      'https://www.ubereats.com/store/...'

  },

  // ===================================================
  // DELIVEROO
  // ===================================================

  deliveroo: {

    id: 'deliveroo',

    name: 'Deliveroo',

    field: 'url',

    deliveryBaseUrl: '',

    deliveryUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'cafe',
      'bakery',
      'food'
    ],

    placeholder:
      'https://deliveroo.fr/menu/...'

  },

  // ===================================================
  // DOORDASH
  // ===================================================

  doordash: {

    id: 'doordash',

    name: 'DoorDash',

    field: 'url',

    deliveryBaseUrl: '',

    deliveryUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'food'
    ],

    placeholder:
      'https://www.doordash.com/store/...'

  },

  // ===================================================
  // GLOVO
  // ===================================================

  glovo: {

    id: 'glovo',

    name: 'Glovo',

    field: 'url',

    deliveryBaseUrl: '',

    deliveryUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'food',
      'grocery'
    ],

    placeholder:
      'https://glovoapp.com/...'

  },

  // ===================================================
  // JUST EAT
  // ===================================================

  justeat: {

    id: 'justeat',

    name: 'Just Eat',

    field: 'url',

    deliveryBaseUrl: '',

    deliveryUrlParameter:
      null,

    supported_business_types: [
      'restaurant',
      'food'
    ],

    placeholder:
      'https://www.just-eat.fr/menu/...'

  }

}

// =====================================================
// GET PROVIDER
// =====================================================

export function getDeliveryProvider(
  providerId: string
) {

  return DELIVERY_PROVIDERS[
    providerId as DeliveryProviderId
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

  if (!value)
    return null

  // ===============================================
  // RAW URL
  // ===============================================

  if (!baseUrl) {

    return value

  }

  // ===============================================
  // QUERY PARAM
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
// FORMAT DELIVERY URL
// =====================================================

export function formatDeliveryProviderUrl(
  providerId: string,
  value: string
) {

  const provider =
    getDeliveryProvider(providerId)

  if (!provider)
    return null

  return formatProviderUrl({

    baseUrl:
      provider.deliveryBaseUrl,

    parameter:
      provider.deliveryUrlParameter,

    value

  })

}