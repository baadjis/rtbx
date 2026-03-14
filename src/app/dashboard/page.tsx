import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Image from 'next/image';
import LangSwitcher from '@/components/LangSwitch';
import { MousePointer2, Link2, Calendar, Copy, ExternalLink, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Récupération de la langue depuis les cookies
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr';
  const t = DICT[lang];

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalClicks = links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;

  return (
    <div className="p-4 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{t.welcome}</h1>
          <div className="flex items-center gap-3">
             <p className="text-gray-500 font-medium">{t.sub_welcome}</p>
             <LangSwitcher currentLang={lang} />
          </div>
        </div>
        <a href="https://baadjis-utilitybox.hf.space" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
          <Plus className="w-5 h-5" /> {t.create_link}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <MousePointer2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.total_clicks}</p>
          <h3 className="text-4xl font-black text-gray-900">{totalClicks}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.active_links}</p>
          <h3 className="text-4xl font-black text-gray-900">{links?.length || 0}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.account_created}</p>
          <h3 className="text-xl font-black text-gray-900 mt-2">March 2026</h3>
        </div>
      </div>

      {/* Liste des liens avec Image Next.js */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t.recent_links}</h2>
          <button className="text-indigo-600 font-bold text-sm hover:underline">{t.view_all}</button>
        </div>

        <div className="divide-y divide-gray-50">
          {links && links.length > 0 ? links.map((link) => (
            <div key={link.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <Image 
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${link.long_url}`}
                    alt="favicon" width={20} height={20} unoptimized={true}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">rtbx.space/s/{link.short_code}</h4>
                  <p className="text-sm text-gray-400 truncate max-w-md">{link.long_url}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end">
                <div className="text-right">
                  <span className="block text-lg font-black text-gray-900">{link.clicks}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">clics</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 border border-gray-100 rounded-xl hover:text-indigo-600 transition-colors"><Copy className="w-5 h-5" /></button>
                   <a href={link.long_url} className="p-2 border border-gray-100 rounded-xl hover:text-indigo-600 transition-colors"><ExternalLink className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-gray-400 font-medium">{t.no_links}</div>
          )}
        </div>
      </div>
    </div>
  );
}