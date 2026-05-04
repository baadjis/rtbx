/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandLogo } from '@/components/BrandLogo';
import { formatSocialUrl, get_social_config } from '@/utils/social-config';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Data } from '../data';
import Image from 'next/image';
import { LangType } from '@/lib/lang/types';

export default async function PublicSpacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. On attend la résolution de params et on récupère 'slug'
  const { slug } = await params;
  const cleanSlug = slug;

  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'fr' | 'en';
  const t = Data[lang];

  // 2. La requête Supabase (Attention aux backticks et aux parenthèses)
  // On récupère tout de 'spaces' et juste le nécessaire de 'profiles'
  
  // 1. LEFT JOIN (Pas de !inner) : On récupère le Space même si le Profil est vide
  const { data: space, error } = await supabase
    .from('spaces')
    .select(`
      *,
      profiles (
        first_name,
        last_name
      )
    `)
    .eq('slug', cleanSlug)
    .maybeSingle();

  if (error) console.error("Erreur DB:", error.message);
  if (!space) return notFound();

  // 2. LOGIQUE DE NOM DYNAMIQUE (Gère le cas où profiles est null)
  let displayName = "";
  const isOrg=space.account_type === 'organization'

  if (isOrg) {
    // Priorité au nom de l'entreprise
    displayName = space.organization_name || "Organization";
  } else {
    // Mode personnel : on regarde si on a un profil (membre) ou pas (guest)
    if (space.profiles) {
      displayName = `${space.profiles.first_name} ${space.profiles.last_name}`.trim();
    } 
    
    // Si toujours vide (cas du Guest), on utilise le slug comme pseudo
    if (!displayName) {
      displayName = space.slug || "User";
    }
  }
 
  
    const SOCIAL_CONFIG = get_social_config(lang)
    const socialLinks = space.social_data || [];
    

   return (
     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* ... Background dégradé ... */}
      
      <div className="relative z-10 w-full max-w-md space-y-10 text-center">
        <div className="space-y-6">
            {/* Avatar / Logo */}
            <div className="w-28 h-28 mx-auto p-1 rounded-[2.8rem] shadow-2xl border-4 border-white/10" style={{ background: `linear-gradient(to tr, ${space.theme_color || '#4f46e5'}, #9333ea)` }}>
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                  {space.logo_url ? 
                  <Image
                   src={space.logo_url} className="w-full h-full object-cover" alt="Logo"
                    /> : 
                    <span className="text-3xl font-black uppercase">{displayName?.[0] || 'R'}</span>}
                </div>
            </div>

            {/* NOM AFFICHÉ */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                    {displayName || "RetailBox Space"}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: space.theme_color }}></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                      {isOrg ? 'Verified Organization' : t.badge_label}
                   </span>
                </div>
            </div>
        </div>

        {/* Liste des Liens Sociaux Contrôlés */}
        <div className="space-y-4">
            {socialLinks.map((link: any, i: number) => {
                const config = SOCIAL_CONFIG[link.network];
                if (!config) return null;

                const iconPath = `/social_assets/${config.folder}/glyph/digital/png/full.png`;
                const finalUrl = formatSocialUrl(link.network, link.handle,lang);

                return (
                    <a 
                      key={i} 
                      href={finalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-5 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-[2rem] transition-all duration-500 backdrop-blur-md no-underline"
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
                    </a>
                )
            })}
        </div>

        {/* Footer */}
        <div className="pt-10">
            <Link href="/" className="no-underline opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 block">
                <BrandLogo />
            </Link>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mt-4">
              {t.footer_text}
            </p>
        </div>
      </div>
    </div>
  )
}
