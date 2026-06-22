export type BusinessLoyaltySettings = {

  business_id: number

  enabled: boolean

  points_per_visit: number

  welcome_bonus_points: number

  created_at?: string

  updated_at?: string

}

export type BusinessLoyaltyReward = {

  id?: number

  business_id: number

  title: string

  description?: string | null

  points_required: number

  active: boolean

  created_at?: string

  updated_at?: string

}