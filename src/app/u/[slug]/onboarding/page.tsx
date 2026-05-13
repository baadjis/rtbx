import { createClient } from '@supabase/supabase-js'

import { notFound } from 'next/navigation'

import { LangType } from '@/lib/lang/types'

import { getLang } from '@/lib/lang/lang-getter'

import SpaceOnBoardingPage from './SpaceOnBoardingPage'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const lang =
    await getLang() as LangType

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: space, error } =
    await supabase
      .from('spaces')
      .select(`
        id,
        slug,
        entity_name,
        space_type,
        space_subtype,
        avatar_url,
        theme_color,
        social_data,
        edit_token
      `)
      .eq('slug', slug)
      .single()

  if (error || !space) {
    notFound()
  }

  return (
    <SpaceOnBoardingPage
      space={space}
      lang={lang}
      token={space.edit_token}
    />
  )
}