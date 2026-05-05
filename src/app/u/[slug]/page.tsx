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
  // 1. Résolution du slug
  const { slug } = await params;
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'fr' | 'en';
  const t = Data[lang];

  // 2. Requête simple sans jointure (Plus d'erreur 42501 ou de données privées)
  const { data: space, error } = await supabase
    .from('spaces')
    .select("*")
    .eq('slug', slug.toLowerCase())
    .maybeSingle();

  if (error || !space) {
    return notFound();
  }

  // 3. LOGIQUE DE NOM SIMPLE ET ROBUSTE
  // Priorité : Nom de l'organisation > Slug (Pseudo)
  let displayName = space.slug; 
  const isOrg = space.account_type === 'organization';
  
  if (isOrg && space.organization_name) {
    displayName = space.organization_name;
  }

  const SOCIAL_CONFIG = get_social_config(lang);
  const socialLinks = space.social_data || [];
  const themeColor = space.theme_color || '#4f46e5';
  const bgColor = space.bg_color || '#0f172a';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
         style={{ backgroundColor: bgColor }}>
      
      {/* Background radial dynamique */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 50% 20%, ${themeColor} 0%, transparent 75%)` }}>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-12 text-center">
        
        {/* --- HEADER PROFIL --- */}
        <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            {/* Avatar avec ton dégradé signature */}
            <div className="w-28 h-28 mx-auto p-1 rounded-[2.8rem] shadow-2xl border-4 border-white/10" 
                 style={{ background: `linear-gradient(to tr, ${themeColor}, #9333ea)` }}>
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative">
                  {space.logo_url ? (
                    <Image
                      src={space.logo_url}
                      alt="Logo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-4xl font-black uppercase tracking-tighter">
                      {displayName?.[0] || 'R'}
                    </span>
                  )}
                </div>
            </div>

            {/* Affichage du Nom / Pseudo */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic drop-shadow-sm">
                    {displayName}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      {isOrg ? 'Verified Organization' : t.badge_label}
                   </span>
                </div>
            </div>
        </div>

        {/* --- LISTE DES LIENS SOCIAUX --- */}
        <div className="space-y-4 w-full">
            {socialLinks.map((link: any, i: number) => {
                const config = SOCIAL_CONFIG[link.network];
                if (!config) return null;

                const iconPath = `/social_assets/${config.folder}/glyph/digital/png/full.png`;
                const finalUrl = formatSocialUrl(link.network, link.handle, lang);

                return (
                    <a 
                      key={i} 
                      href={finalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-5 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-[2rem] transition-all duration-500 backdrop-blur-md no-underline shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shadow-inner">
                            <Image 
                              src={iconPath}
                              alt={link.network}
                              width={30}
                              height={30}
                              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                              unoptimized
                            />
                        </div>
                        <div className="text-left">
                           <span className="block text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                             {link.network}
                           </span>
                           <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                             {link.network === "WhatsApp" ? t.follow_action : t.view_action}
                           </span>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-40 transition-all pr-2 translate-x-2 group-hover:translate-x-0">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </div>
                    </a>
                )
            })}
        </div>

        {/* --- FOOTER BRANDING --- */}
        <div className="pt-10 space-y-6">
            <Link href="/" className="inline-block no-underline opacity-20 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0">
                <BrandLogo />
            </Link>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">
              {t.footer_text}
            </p>
        </div>
      </div>
    </div>
  )
}