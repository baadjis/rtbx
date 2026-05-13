/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Data } from '../data';
import RenderSocialLink from './RenderSocialLink';
import { LangType } from '@/lib/lang/types';
import { SpaceAvatar } from './SpaceAvatar';
import Footer from './Footer';
import { getLang } from '@/lib/lang/lang-getter';


export default async function PublicSpacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const supabase = await createClient();
  const lang = await getLang() as LangType
  const t = Data[lang];

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

  let displayName = "";
  if (isProfileOnly) {
    displayName = entity.full_name || `${entity.first_name || ''} ${entity.last_name || ''}`.trim() || entity.slug;
  } else {
    displayName = entity.space_type === 'organization' ? (entity.entity_name || entity.slug) : entity.slug;
  }



  const imageUrl = isProfileOnly ? entity.avatar_url : entity.avatar_url;

  const themeColor = entity.theme_color || '#4f46e5';
  const bgColor = entity.bg_color || '#0f172a';
  const socialLinks = entity.social_data || [];



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
         style={{ backgroundColor: bgColor }}>
      
      {/* 🌈 Background desktop */}
      <div 
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: `
            radial-gradient(circle at 50% 15%, ${themeColor} 0%, transparent 55%),
            radial-gradient(circle at 85% 85%, rgba(147,51,234,0.35) 0%, transparent 60%),
            radial-gradient(circle at 15% 85%, rgba(79,70,229,0.35) 0%, transparent 60%)
          `
        }}
      ></div>

      {/* 🌈 Background mobile */}
      <div 
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background: `
            radial-gradient(circle at 50% 10%, ${themeColor} 0%, transparent 45%)
          `
        }}
      ></div>

      {/* 🌑 Overlay contraste (FIX LISIBILITÉ) */}
     <div className="absolute inset-0 pointer-events-none bg-black/40 md:bg-black/20"></div>
      <div className="relative z-10 w-full max-w-md space-y-12 text-center">
        
        {/* --- HEADER --- */}
        <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            
            <SpaceAvatar imageUrl={imageUrl}  themeColor={themeColor} displayName={displayName} variant='circle'/>
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic">
                    {displayName}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      {isProfileOnly ? t.badge_personal : (entity.space_type === 'organization' ? 'Verified Organization' : t.badge_label)}
                   </span>
                </div>
            </div>
        </div>

        {/* --- LIENS --- */}
        <div className="space-y-4 w-full px-1 md:px-0">
            {socialLinks.length > 0 ? socialLinks.map((link: any, i: number) => {
               return <RenderSocialLink link={link} themeColor={themeColor} 
               lang={lang}
                 key={i} />
                

            }) : (
              <div className="py-10 opacity-30 italic font-medium">No links available</div>
            )}
        </div>

{/* --- FOOTER --- */}
       <Footer t={t}/>
{/*end footer*/}
      </div>
    </div>
  )
}