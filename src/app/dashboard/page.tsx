import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Image from 'next/image';
import LangSwitcher from '@/components/LangSwitch';
import Link from 'next/link';
import { MousePointer2, Link2, Calendar, Copy, ExternalLink, Plus, BarChart3 } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalClicks = links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;

  return (
    <div className="p-4 md:p-10 space-y-8 transition-colors duration-300">
      
      {/* HEADER DU DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.welcome}
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <p className="text-gray-500 dark:text-slate-400 font-medium">{t.sub_welcome}</p>
             <LangSwitcher currentLang={lang} />
          </div>
        </div>
        
        {/* CHANGEMENT : LE LIEN POINTE VERS LE SHORTENER LOCAL NEXTJS */}
        <Link href="/tools/shortener" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95">
          <Plus className="w-5 h-5" /> {t.create_link}
        </Link>
      </div>

      {/* CARTES DE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <MousePointer2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_clicks}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{totalClicks}</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{links?.length || 0}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.account_created}</p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2">MARS 2026</h3>
        </div>
      </div>

      {/* SECTION LISTE DES LIENS */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.recent_links}</h2>
          <button className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-widest">
            {t.view_all}
          </button>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {links && links.length > 0 ? links.map((link) => (
            <div key={link.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-gray-200 dark:border-slate-700">
                  <Image 
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${link.long_url}`}
                    alt="favicon" width={20} height={20} unoptimized={true}
                    className="dark:brightness-90"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">rtbx.space/s/{link.short_code}</h4>
                  <p className="text-sm text-gray-400 dark:text-slate-500 truncate max-w-md font-medium">{link.long_url}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end">
                <div className="text-right">
                  <span className="block text-xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all shadow-sm">
                        <Copy size={18} />
                   </button>
                   <Link href={`/stats/${link.short_code}`} className="p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all shadow-sm">
                        <BarChart3 size={18} />
                   </Link>
                   <a href={link.long_url} target="_blank" className="p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all shadow-sm">
                        <ExternalLink size={18} />
                   </a>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-gray-400 dark:text-slate-600 font-bold italic tracking-tight">
                {t.no_links}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}