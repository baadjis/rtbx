import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Image from 'next/image';
import LangSwitcher from '@/components/LangSwitch';
import Link from 'next/link';
import { 
  MousePointer2, Link2, Calendar, 
  Copy, ExternalLink, Plus, 
  BarChart3, Star, ArrowUpRight,
  Store, ChevronRight, AlertCircle,
  Wifi
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 1. Récupération des données en parallèle (Performance)
  const [linksResponse, businessResponse] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('businesses').select('*').eq('user_id', user.id).single()
  ]);

  const links = linksResponse.data || [];
  const business = businessResponse.data;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 space-y-10 transition-colors duration-300">
      
      {/* --- SECTION 1 : HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.welcome}
          </h1>
          <div className="flex items-center gap-3">
             <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">{t.sub_welcome}</p>
             <LangSwitcher currentLang={lang} />
          </div>
        </div>
        
        <Link href="/tools" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95 no-underline">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          {lang === 'fr' ? 'Accéder aux outils' : 'Access Tools'}
        </Link>
      </div>

      {/* --- SECTION 2 : KPI GRID (AGRÉGATION) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget Clics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MousePointer2 className="w-6 h-6" />
            </div>
            <div className="text-green-500 font-black text-xs flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} /> Active
            </div>
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_clicks}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{totalClicks}</h3>
        </div>
        
        {/* Widget Liens */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{links.length}</h3>
        </div>

        {/* Widget Google Reviews (Dynamique) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{lang === 'fr' ? 'Note Moyenne' : 'Average Rating'}</p>
          {business ? (
             <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                4.8<span className="text-sm text-gray-400 font-bold ml-1">/5</span>
             </h3>
          ) : (
            <Link href="/tools/google-reviews" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2 block hover:underline">
               + {lang === 'fr' ? 'Lier mon commerce' : 'Link business'}
            </Link>
          )}
        </div>

        {/* Compte Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Membre depuis</p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2 uppercase tracking-tighter">Mars 2026</h3>
        </div>
      </div>

      {/* --- SECTION 3 : ÉTABLISSEMENT & LIENS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Liste des Liens (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.recent_links}</h2>
            <button className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest">
              {t.view_all}
            </button>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {links.length > 0 ? links.map((link) => (
              <div key={link.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 relative border border-gray-200 dark:border-slate-700">
                    <Image 
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${link.long_url}`}
                      alt="favicon" width={24} height={24} unoptimized={true}
                      className="dark:brightness-90"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">rtbx.space/s/{link.short_code}</h4>
                    <p className="text-sm text-gray-400 dark:text-slate-500 truncate max-w-md font-medium">{link.long_url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between w-full md:w-auto">
                  <div className="text-right">
                    <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                        <Copy size={18} />
                     </button>
                     <Link href={`/stats/${link.short_code}`} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                        <BarChart3 size={18} />
                     </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-gray-400 italic font-bold tracking-tight">{t.no_links}</div>
            )}
          </div>
        </div>

        {/* Section Commerce (Prend 1 colonne) */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-8">{lang=='fr'?"Mon Commerce":"My business"}</h2>
            
            {business ? (
                <div className="space-y-6 flex-1">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Store className="text-indigo-600 dark:text-indigo-400" size={20} />
                            <span className="font-black text-indigo-900 dark:text-indigo-100 truncate">{business.name}</span>
                        </div>
                        <p className="text-xs text-indigo-400 font-bold leading-relaxed">{business.address}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Accès Rapides</p>
                        <Link href="/tools/wifi" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all no-underline text-gray-600 dark:text-slate-300 font-bold group">
                            <div className="flex items-center gap-3">
                                <Wifi size={18} className="group-hover:text-indigo-600" /> { lang=='fr' ?"Imprimer le Qrcode Wi-Fi":"Print your Wi-Fi Qrcode"}
                            </div>
                            <ChevronRight size={16} />
                        </Link>
                        <Link href="/tools/google-reviews" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all no-underline text-gray-600 dark:text-slate-300 font-bold group">
                            <div className="flex items-center gap-3">
                                <Star size={18} className="group-hover:text-indigo-600" /> QR Avis Google
                            </div>
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300">
                        <Store size={32} />
                    </div>
                    <p className="text-sm text-gray-400 font-medium italic">{lang =='fr' ?'Aucun établissement lié.':"No linked business"}</p>
                    <Link href="/tools/google-reviews" className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest">
                        {lang=='fr'?'Lancer la recherche':'Search'}
                    </Link>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4 text-center">{lang=='fr'?"Propulsé par Google Maps API":"Powered by Google Maps API"}</p>
            </div>
        </div>

      </div>
    </div>
  );
}