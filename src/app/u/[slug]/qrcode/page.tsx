
import { LangType } from '@/lib/lang/types'
import SpaceQRCodePage from './SpaceQRCodePage'
import { getLang } from '@/lib/lang/lang-getter'
import { createClient } from '@supabase/supabase-js'
import notFound from '@/app/not-found'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params


  const lang = await getLang()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  // fetch ton space ici
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
        qr_logo,
        theme_color,
        bg_color,
        social_data
      `)
      .eq('slug', slug)
      .single()

  if (error || !space) {
    notFound()
  }


  
  return (
    <SpaceQRCodePage
      space={space}
      lang={lang as LangType}
    />
  )
}