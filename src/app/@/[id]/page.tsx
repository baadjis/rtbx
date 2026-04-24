/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { BrandLogo } from '@/components/BrandLogo';
import { SOCIAL_CONFIG, formatSocialUrl } from '@/utils/social-config';
import { Data } from './data';

export default async function PublicSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, social_data')
    .eq('id', id)
    .single();

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-black">
      {t.not_found}
    </div>
  );

  const socialLinks = profile.social_data || [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      
      {/* Background Splendide */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-black z-0"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md space-y-10 text-center">
        
        {/* Header Profil */}
        <div className="space-y-6">
            <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl border-4 border-white/20 p-1">
                <div className="w-full h-full bg-slate-900 rounded-[2.2rem] flex items-center justify-center">
                  <span className="text-4xl font-black uppercase tracking-tighter">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </span>
                </div>
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
                    {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] opacity-80">
                  {t.badge_label}
                </p>
            </div>
        </div>

        {/* Liste des Liens Sociaux Contrôlés */}
        <div className="space-y-4">
            {socialLinks.map((link: any, i: number) => {
                const config = SOCIAL_CONFIG[link.network];
                if (!config) return null;

                const iconPath = `/social_assets/${config.folder}/glyph/digital/png/full.png`;
                const finalUrl = formatSocialUrl(link.network, link.handle);

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