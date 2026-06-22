export type ProviderCategory =
  | 'review'
  | 'booking'
  | 'delivery'
  | 'marketplace'

export type BusinessProviderLink = {

  id?: string

  business_id: number

  provider_category: ProviderCategory

  provider_id: string

  value: string

  created_at?: string

  updated_at?: string

}