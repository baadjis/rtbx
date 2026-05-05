/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandLogo } from '@/components/BrandLogo';
import { formatSocialUrl, get_social_config } from '@/utils/social-config';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Data } from '../data';
import Image from 'next/image';

export default async function PublicSpacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'fr' | 'en';
  const t = Data[lang];

  // --- ÉTAPE 1 : RECHERCHE DYNAMIQUE ---
  
  // On cherche d'abord dans la table SPACES
  let { data: entity } = await supabase
    .from('spaces')
    .select("*")
    .eq('slug', lowerSlug)
    .maybeSingle();

  let isProfileOnly = false;

  // Si pas de Space, on cherche dans la table PROFILES
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

  // --- ÉTAPE 2 : LOGIQUE D'AFFICHAGE ---
  
  // Détermination du nom
  let displayName = "";
  if (isProfileOnly) {
    displayName = entity.full_name || `${entity.first_name || ''} ${entity.last_name || ''}`.trim() || entity.slug;
  } else {
    displayName = entity.account_type === 'organization' ? (entity.organization_name || entity.slug) : entity.slug;
  }

  // Détermination de l'image (Logo ou Avatar)
  const imageUrl = isProfileOnly ? entity.avatar_url : entity.logo_url;

  // Réglages visuels
  const themeColor = entity.theme_color || '#4f46e5';
  const bgColor = entity.bg_color || '#0f172a';
  const socialLinks = entity.social_data || [];
  const SOCIAL_CONFIG = get_social_config(lang);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
         style={{ backgroundColor: bgColor }}>
      
      {/* Background radial "Splendide" */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 50% 20%, ${themeColor} 0%, transparent 75%)` }}>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-12 text-center">
        
        {/* --- HEADER --- */}
        <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="w-28 h-28 mx-auto p-1 rounded-[2.8rem] shadow-2xl border-4 border-white/10" 
                 style={{ background: `linear-gradient(to tr, ${themeColor}, #9333ea)` }}>
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative text-white">
                  {imageUrl ? (
                    <Image src={imageUrl}
                     alt="Identity" fill className="object-contain" unoptimized 
                     width={100} height={100}
                     />
                  ) : (
                    <span className="text-4xl font-black uppercase">{displayName?.[0] || 'R'}</span>
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
        <div className="space-y-4 w-full">
            {socialLinks.length > 0 ? socialLinks.map((link: any, i: number) => {
                const config = SOCIAL_CONFIG[link.network];
                if (!config) return null;
                const finalUrl = formatSocialUrl(link.network, link.handle, lang);

                return (
                    <a key={i} href={finalUrl} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-5 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-[2rem] transition-all duration-500 backdrop-blur-md no-underline shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5">
                            <Image 
                              src={`/social_assets/${config.folder}/glyph/digital/png/full.png`}
                              alt={link.network} width={30} height={30} className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500" unoptimized
                            />
                        </div>
                        <div className="text-left">
                           <span className="block text-lg font-bold text-slate-200 group-hover:text-white">{link.network}</span>
                           <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-indigo-400">
                             {link.network === "WhatsApp" ? t.follow_action : t.view_action}
                           </span>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-40 transition-all pr-2 translate-x-2 group-hover:translate-x-0">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </div>
                    </a>
                )
            }) : (
              <div className="py-10 opacity-30 italic font-medium">No links available</div>
            )}
        </div>

        {/* --- FOOTER --- */}
        <div className="pt-10 space-y-6">
            <Link href="/" className="inline-block no-underline opacity-20 hover:opacity-100 transition-all duration-700">
                <BrandLogo />
            </Link>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">{t.footer_text}</p>
        </div>
      </div>
    </div>
  )
}