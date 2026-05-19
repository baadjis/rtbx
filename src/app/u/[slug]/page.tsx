/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { LangType } from '@/lib/lang/types';
import { getLang } from '@/lib/lang/lang-getter';
import SpaceView from '@/components/spaces/SpaceView';


export default async function PublicSpacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const supabase = await createClient();
  const lang = await getLang() as LangType

  let { data: entity } = await supabase
    .from('spaces')
    .select("*")
    .eq('slug', lowerSlug)
    .maybeSingle();

  

  let isProfileOnly = false;

  if (!entity) {
    const { data: profile } = await supabase
      .from('profiles')
      .select("*")
      .eq('slug', lowerSlug)
      .maybeSingle();
    
    if (profile) {
      entity = profile;
      isProfileOnly = true;
    }
  }
    if (!entity) return notFound();


  return (

    <SpaceView  entity={entity} lang={lang} isProfileOnly={isProfileOnly} socialLinks={entity.social_data}
     avatar_url={entity?.avatar_url || null}
    />

    
  )
}