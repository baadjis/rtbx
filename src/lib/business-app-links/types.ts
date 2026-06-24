// lib/business-app-links/types.ts

export type BusinessAppLink = {

  id: number

  business_id: number

  provider_id: string

  value: string

  created_at: string

  updated_at: string

}

export type CreateBusinessAppLinkInput = {

  business_id: number

  provider_id: string

  value: string

}

export type UpdateBusinessAppLinkInput = {

  value: string

}