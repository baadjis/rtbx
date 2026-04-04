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
  Store, Utensils, Scissors, ShoppingBag, Sparkles,
  ChevronRight, Wifi, ArrowRight, MapPin, Award, Clock
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 1. Récupération des données en parallèle (Performance Maximale)
  const [linksResponse, businessesResponse, pointsResponse] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('businesses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('loyalty_points').select('*, businesses(name, business_type)').eq('user_id', user.id).order('updated_at', { ascending: false })
  ]);

  const links = linksResponse.data || [];
  const businesses = businessesResponse.data || [];
  const points = pointsResponse.data || [];
  
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  // Fonction utilitaire pour l'icône dynamique du business
  const getBusinessConfig = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type?.toLowerCase()) {
      case 'restaurant':
      case 'food':
      case 'cafe':
      case 'bar':
        return { icon: <Utensils className={iconClass} />, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" };
      case 'hair_care':
      case 'beauty_salon':
      case 'spa':
        return { icon: <Scissors className={iconClass} />, color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400" };
      case 'clothing_store':
      case 'store':
      case 'shoe_store':
        return { icon: <ShoppingBag className={iconClass} />, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" };
      default:
        return { icon: <Store className={iconClass} />, color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 space-y-10 transition-colors duration-300">
      
      {/* --- SECTION 1 : HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all group">
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
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all group">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{links.length}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all group">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6 text-yellow-500 fill-current" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{lang === 'fr' ? 'Mes Points' : 'My Points'}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{points.length} <span className="text-sm text-gray-400">{lang =='fr' ? 'Cartes':'Cards'}</span></h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all group">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{lang === 'fr' ? 'Mes Commerces' : 'My Businesses'}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{businesses.length}</h3>
        </div>
      </div>

      {/* --- SECTION 3 : CONTENU --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE (2/3) : LIENS RÉCENTS + POINTS RÉCENTS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. MES LIENS RÉCENTS */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.recent_links}</h2>
              <Link href="/dashboard/links" className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest no-underline">
                {t.view_all}
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {links.slice(0, 3).map((link) => (
                <div key={link.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 relative border border-gray-200 dark:border-slate-700">
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
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                      <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                    </div>
                    <Link href={`/stats/${link.short_code}`} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <BarChart3 size={18} />
                    </Link>
                  </div>
                </div>
              ))}
              {links.length === 0 && <div className="p-12 text-center text-gray-400 italic font-bold">{t.no_links}</div>}
            </div>
          </div>

          {/* 2. MES POINTS ET VISITES RÉCENTES (NOUVELLE SECTION) */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <Clock className="text-indigo-600" size={24} /> {lang === 'fr' ? 'Points & Visites' : 'Points & Visits'}
              </h2>
              <Link href="/dashboard/points" className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest no-underline">
                {t.view_all}
              </Link>
            </div>
            <div className="p-2 space-y-2">
              {points.slice(0, 3).map((p) => {
                const config = getBusinessConfig(p.businesses?.business_type);
                const progress = (p.points_count / p.max_points) * 100;
                return (
                  <div key={p.id} className="p-6 bg-gray-50/50 dark:bg-slate-800/30 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${config.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                        {config.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{p.businesses?.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-24 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progress}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-gray-400 uppercase">{p.points_count} / {p.max_points}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.last_scan}</p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{t.today}</p>
                        </div>
                        <ChevronRight className="text-gray-300" size={20} />
                    </div>
                  </div>
                );
              })}
              {points.length === 0 && <div className="p-12 text-center text-gray-400 italic font-bold">{t.no_loyalty_activity}</div>}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (1/3) : MES COMMERCES */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 flex flex-col h-fit lg:sticky lg:top-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{lang === 'fr' ? 'Mes Commerces' : 'My Businesses'}</h2>
                <Link href="/dashboard/businesses" className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline no-underline">
                    {lang === 'fr' ? 'Voir tout' : 'View all'}
                </Link>
            </div>
            
            <div className="space-y-4 flex-1">
                {businesses.slice(0, 3).map((biz) => {
                    const config = getBusinessConfig(biz.business_type);
                    return (
                        <Link key={biz.id} href={`/dashboard/businesses/${biz.id}`} className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-800 group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300 no-underline block">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 ${config.color}`}>
                                        {config.icon}
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{biz.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                                    <Star size={12} fill="currentColor" /> 4.8
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-center text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700">QR Avis</div>
                                <div className="flex-1 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-center text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700">Scan</div>
                            </div>
                        </Link>
                    );
                })}
                <Link href="/tools/google-reviews" className="w-full py-4 mt-2 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-all no-underline font-bold text-sm">
                    <Plus size={16} /> {lang === 'fr' ? 'Ajouter un commerce' : 'Add a business'}
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}