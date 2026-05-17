export type SocialLink = {
  id: string
  network: string
  handle: string
}

export type SpaceType =
  | 'personal'
  | 'organization'
  | 'business'
  | 'developper'



export type SpaceSubtype =
  | string

export type SpaceUpdatePayload = {

  entity_name?: string

  social_data?: SocialLink[]

  theme_color?: string

  bg_color?: string

  avatar_url?: string


}

export type SpaceAddPayload = {

  user_id?: string | null

  email: string

  slug: string

  space_type: SpaceType

  space_subtype?: SpaceSubtype

  entity_name?: string

  social_data?: SocialLink[]

  theme_color?: string

  bg_color?: string

  avatar_url?: string

  edit_token?: string

  legal_accepted_at?: string

  is_authorized_representative?: boolean
}

export type SpaceEntity = {

  id: string

  user_id?: string | null

  email: string

  slug: string

  space_type: SpaceType

  space_subtype?: SpaceSubtype

  entity_name?: string

  social_data: SocialLink[]

  theme_color?: string

  bg_color?: string

  avatar_url?: string

  edit_token?: string

  created_at?: string

  updated_at?: string

  deleted_at?: string | null

  legal_accepted_at?: string

  is_authorized_representative?: boolean
}