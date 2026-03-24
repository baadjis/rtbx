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
  Store, ChevronRight, Wifi, ArrowRight
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 1. Récupération des données en parallèle (Performance)
  const [linksResponse, businessesResponse] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('businesses').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  ]);

  const links = linksResponse.data || [];
  const businesses = businessesResponse.data || [];
  
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  // On simule une note moyenne (plus tard, tu pourras la fetcher via API pour chaque business)
  const avgRating = businesses.length > 0 ? "4.8" : "--";

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
          {t.back_to_tools}
        </Link>
      </div>

      {/* --- SECTION 2 : KPI GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MousePointer2 className="w-6 h-6" />
            </div>
            <div className="text-green-500 font-black text-xs flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} /> Live
            </div>
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_clicks}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{totalClicks}</h3>
        </div>
        
        {/* Liens Actifs */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{links.length}</h3>
        </div>

        {/* Note Moyenne (Agrégation) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.average_rating}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{avgRating}<span className="text-sm text-gray-400">/5</span></h3>
        </div>

        {/* Nombre de boutiques */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.linked_businesses}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{businesses.length}</h3>
        </div>
      </div>

      {/* --- SECTION 3 : ÉTABLISSEMENTS & LIENS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Liste des Liens (2/3 de la largeur) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.recent_links}</h2>
            <Link href="/dashboard/links" className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest">
              {t.view_all}
            </Link>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {links.slice(0, 5).map((link) => (
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
                    <p className="text-sm text-gray-400 dark:text-slate-500 truncate max-w-md font-medium tracking-tight">{link.long_url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <span className="block text-xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                  </div>
                  <Link href={`/stats/${link.short_code}`} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                      <BarChart3 size={18} />
                  </Link>
                </div>
              </div>
            ))}
            {links.length === 0 && (
              <div className="p-20 text-center text-gray-400 italic font-bold tracking-tight">{t.no_links}</div>
            )}
          </div>
        </div>

        {/* Section Mes Commerces (1/3 de la largeur) */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.my_retail_spaces}</h2>
                <Link href="/dashboard/businesses" className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline">
                    {t.view_all_biz}
                </Link>
            </div>
            
            {businesses.length > 0 ? (
                <div className="space-y-4 flex-1">
                    {businesses.slice(0, 3).map((biz) => (
                        <div key={biz.id} className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-800 group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <Store size={16} className="text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{biz.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                                    <Star size={12} fill="currentColor" /> 4.8
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Link href="/tools/google-reviews" className="flex-1 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-center text-gray-500 border border-gray-100 dark:border-slate-700 hover:text-indigo-600 transition-all no-underline">
                                    Avis QR
                                </Link>
                                <Link href="/tools/wifi" className="flex-1 py-2 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black text-center text-gray-500 border border-gray-100 dark:border-slate-700 hover:text-indigo-600 transition-all no-underline">
                                    WiFi QR
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    <Link href="/tools/google-reviews" className="w-full py-4 mt-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all no-underline font-bold text-sm">
                        <Plus size={16} /> {t.add_business}
                    </Link>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <Store size={40} className="text-gray-200" />
                    <p className="text-sm text-gray-400 font-medium italic">{t.no_businesses}</p>
                    <Link href="/tools/google-reviews" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                        Lier mon premier commerce
                    </Link>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{lang=='fr'?"Espace Retail Manager":"Retail Manager Space"}</p>
            </div>
        </div>

      </div>
    </div>
  );
}