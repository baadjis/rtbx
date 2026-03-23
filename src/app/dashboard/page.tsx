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
  BarChart3, Star, ArrowUpRight 
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // Récupération des liens
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalClicks = links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 space-y-10 transition-colors duration-300">
      
      {/* --- SECTION 1 : EN-TÊTE DYNAMIQUE --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.welcome || "Content de vous revoir ! 👋"}
          </h1>
          <div className="flex items-center gap-3">
             <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">{t.sub_welcome}</p>
             <LangSwitcher currentLang={lang} />
          </div>
        </div>
        
        <Link href="/tools/shortener" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          {t.create_link}
        </Link>
      </div>

      {/* --- SECTION 2 : GRILLE D'AGRÉGATION (STATS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <MousePointer2 className="w-6 h-6" />
            </div>
            <div className="text-green-500 font-black text-xs flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} /> +12%
            </div>
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_clicks}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{totalClicks}</h3>
        </div>
        
        {/* Liens Actifs */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{links?.length || 0}</h3>
        </div>

        {/* Note Google (Placeholder) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-4">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Note Google</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">4.9<span className="text-sm text-gray-400">/5</span></h3>
        </div>

        {/* Date Inscription */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.account_created}</p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2 uppercase tracking-tighter">Mars 2026</h3>
        </div>
      </div>

      {/* --- SECTION 3 : LISTE DES LIENS --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.recent_links}</h2>
          <button className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest">
            {t.view_all}
          </button>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {links && links.length > 0 ? links.map((link) => (
            <div key={link.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-slate-700">
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

              <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                <div className="text-right">
                  <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                  <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <Copy size={18} />
                   </button>
                   <Link href={`/stats/${link.short_code}`} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <BarChart3 size={18} />
                   </Link>
                   <a href={link.long_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <ExternalLink size={18} />
                   </a>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-24 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Link2 className="w-10 h-10 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-gray-400 dark:text-slate-600 font-bold italic text-lg tracking-tight">
                    {t.no_links}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}