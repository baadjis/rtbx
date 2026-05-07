/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandLogo } from '@/components/BrandLogo';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Data } from '../data';
import Image from 'next/image';
import RenderSocialLink from './RenderSocialLink';
import { LangType } from '@/lib/lang/types';


export default async function PublicSpacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as LangType;
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
    displayName = entity.account_type === 'organization' ? (entity.organization_name || entity.slug) : entity.slug;
  }



  const imageUrl = isProfileOnly ? entity.avatar_url : entity.logo_url;

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
            <div
  className="w-28 h-28 mx-auto p-[2px] rounded-[2.8rem] shadow-2xl border border-white/10"
  style={{
    background: `linear-gradient(135deg, ${themeColor}, #9333ea)`
  }}
>
  <div className="w-full h-full rounded-[2.6rem] flex items-center justify-center overflow-hidden relative bg-white/5 backdrop-blur-md">
    {imageUrl ? (
      <Image
        src={imageUrl}
        alt="Identity"
        fill
        className="object-contain p-2"
        unoptimized
      />
    ) : (
      <span className="text-4xl font-black uppercase text-white">
        {displayName?.[0] || "R"}
      </span>
    )}
  </div>
</div>

            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic">
                    {displayName}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      {isProfileOnly ? t.badge_personal : (entity.account_type === 'organization' ? 'Verified Organization' : t.badge_label)}
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
{/* --- FOOTER --- */}
<div className="pt-4 pb-24 md:pb-10 space-y-4 flex flex-col items-center">
  <Link
    href="/"
    className="
      inline-flex flex-col items-start gap-2
      px-5 py-4
      rounded-[2rem]
      bg-white/10
      hover:bg-white/15
      border border-white/10
      backdrop-blur-xl
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-lg
      no-underline
      max-w-full
    "
  >
    {/* Logo + domain */}
    <div className="flex items-center gap-3">
      <div className="-mb-6">
        <BrandLogo />
      </div>

      <p className="text-sm font-bold text-white leading-none -translate-y-[1px]">
        rtbx.space
      </p>
    </div>

    {/* CTA */}
    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 leading-tight text-center">
      Your modern social space
    </p>
  </Link>

  {/* Footer text */}
  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] text-center px-4">
    {t.footer_text}
  </p>
</div>
{/*end footer*/}
      </div>
    </div>
  )
}