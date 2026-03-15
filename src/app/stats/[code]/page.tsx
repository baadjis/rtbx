import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Link from 'next/link';
import { BarChart3, ArrowRight, MousePointer2 } from 'lucide-react';

export default async function PublicStatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = DICT[lang];

  // Récupérer les infos du lien
  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', code)
    .single();

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t.link_not_found}</h1>
          <Link href="/" className="text-indigo-600 mt-4 block font-bold">{t.back_to_home}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex flex-col items-center justify-center"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <div className="max-w-2xl w-full space-y-8">
        
        {/* CARD STATS - DESIGN MODERNE */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden">
          <div className="inline-flex p-4 bg-indigo-50 rounded-2xl mb-6 relative z-10">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2 relative z-10">
            {t.stats_for} /{code}
          </h1>
          <div className="text-8xl font-black text-gray-900 mb-4 tracking-tighter relative z-10">
            {link.clicks}
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-8 relative z-10">
            {t.clicks_registered}
          </p>
          
          <div className="p-5 bg-gray-50 rounded-2xl text-sm text-gray-500 font-medium break-all border border-gray-100 relative z-10">
             <span className="text-gray-400 mr-2">{t.destination_label}</span> 
             <span className="text-gray-900">{link.long_url}</span>
          </div>

          {/* Décoration subtile en arrière-plan de la carte */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl"></div>
        </div>

        {/* CTA : LE PIÈGE À ABONNÉS (DYNAMIQUE) */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
                {t.cta_stats_title}
            </h2>
            <p className="text-indigo-100 mb-8 text-base font-medium leading-relaxed opacity-90">
                {t.cta_stats_desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-center hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg">
                {t.create_free_account} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Icône décorative géante */}
          <MousePointer2 className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>

        {/* FOOTER LINK */}
        <Link href="/" className="flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-indigo-600 transition-colors uppercase text-xs tracking-widest">
           {t.back_to_home}
        </Link>
      </div>
    </div>
  );
}