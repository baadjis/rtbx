export type SocialLink={
    id:string
    network:string
    handle:string
}

export type SpaceUpdatePayload={
  
  entity_name?: string
  social_data?: SocialLink[]
  theme_color?: string
  bg_color?: string,
  updatedAt:string
}

export type SpaceAddPayload={

  user_id?:string
  email:string
  slug:string
  space_type:string
  space_subtype:string


  entity_name: string
  social_data?: SocialLink[]
  theme_color: string
  bg_color?: string
  edit_token:string
  avatar_url?:string
       

legal_accepted_at?:string
is_authorized_representative:boolean
}