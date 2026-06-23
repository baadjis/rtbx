// utils/marketplace-providers.ts

// =====================================================
// TYPES
// =====================================================

export type MarketplaceProviderId =
  | 'amazon'
  | 'etsy'
  | 'ebay'
  | 'vinted'
  | 'leboncoin'
  | 'gumroad'
  | 'creative_market'

// =====================================================

export type MarketplaceProvider = {

  id: MarketplaceProviderId

  name: string

  /**
   * Champ attendu
   *
   * slug
   * shop
   * url
   */
  field: string

  /**
   * URL marketplace
   */
  marketplaceBaseUrl: string

  /**
   * Paramètre URL
   */
  marketplaceUrlParameter?: string | null

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

export const MARKETPLACE_PROVIDERS:
Record<
  MarketplaceProviderId,
  MarketplaceProvider
> = {

  // ===================================================
  // AMAZON
  // ===================================================

  amazon: {

    id: 'amazon',

    name: 'Amazon',

    field: 'url',

    marketplaceBaseUrl: '',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'retail',
      'ecommerce',
      'brand',
      'all'
    ],

    placeholder:
      'https://www.amazon.com/stores/...'

  },

  // ===================================================
  // ETSY
  // ===================================================

  etsy: {

    id: 'etsy',

    name: 'Etsy',

    field: 'shop',

    marketplaceBaseUrl:
      'https://www.etsy.com/shop/',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'craft',
      'art',
      'creator',
      'jewelry',
      
    ],

    placeholder:
      'MyShop'

  },

  // ===================================================
  // EBAY
  // ===================================================

  ebay: {

    id: 'ebay',

    name: 'eBay',

    field: 'url',

    marketplaceBaseUrl: '',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'retail',
      'ecommerce',
      
    ],

    placeholder:
      'https://www.ebay.com/usr/...'

  },

  // ===================================================
  // VINTED
  // ===================================================

  vinted: {

    id: 'vinted',

    name: 'Vinted',

    field: 'url',

    marketplaceBaseUrl: '',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'fashion',
      'clothing',
      'second_hand'
    ],

    placeholder:
      'https://www.vinted.fr/member/...'

  },

  // ===================================================
  // LEBONCOIN
  // ===================================================

  leboncoin: {

    id: 'leboncoin',

    name: 'Leboncoin',

    field: 'url',

    marketplaceBaseUrl: '',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'retail',
      'local_business',
      'second_hand'
    ],

    placeholder:
      'https://www.leboncoin.fr/profil/...'

  },

  // ===================================================
  // GUMROAD
  // ===================================================

  gumroad: {

    id: 'gumroad',

    name: 'Gumroad',

    field: 'slug',

    marketplaceBaseUrl:
      'https://',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'creator',
      'digital_products',
      'education'
    ],

    placeholder:
      'username.gumroad.com'

  },

  // ===================================================
  // CREATIVE MARKET
  // ===================================================

  creative_market: {

    id: 'creative_market',

    name: 'Creative Market',

    field: 'slug',

    marketplaceBaseUrl:
      'https://creativemarket.com/',

    marketplaceUrlParameter: null,

    supported_business_types: [
      'designer',
      'creator',
      'digital_products'
    ],

    placeholder:
      'username'

  }

}

// =====================================================
// GET PROVIDER
// =====================================================

export function getMarketplaceProvider(
  providerId: string
) {

  return MARKETPLACE_PROVIDERS[
    providerId as MarketplaceProviderId
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

  if (!baseUrl) {
    return value
  }

  if (parameter) {
    return `${baseUrl}?${parameter}=${encodeURIComponent(value)}`
  }

  return `${baseUrl}${value}`
}

// =====================================================
// FORMAT MARKETPLACE URL
// =====================================================

export function formatMarketplaceProviderUrl(
  providerId: string,
  value: string
) {

  const provider =
    getMarketplaceProvider(providerId)

  if (!provider)
    return null

  return formatProviderUrl({

    baseUrl:
      provider.marketplaceBaseUrl,

    parameter:
      provider.marketplaceUrlParameter,

    value

  })

}