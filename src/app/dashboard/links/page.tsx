import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Image from 'next/image';
import { Link2, Copy, BarChart3, ExternalLink, Search, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function MyLinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // Récupérer TOUS les liens de l'utilisateur
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {lang === 'fr' ? 'Mes Liens Raccourcis' : 'My Shortened Links'}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            {links?.length || 0} {lang === 'fr' ? 'liens actifs au total' : 'total active links'}
          </p>
        </div>
        
        <Link href="/tools/shortener" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95 no-underline">
          <Plus size={18} /> {t.create_link}
        </Link>
      </div>

      {/* LISTE DES LIENS DÉDIÉE */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {links && links.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {links.map((link) => (
              <div key={link.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Info du lien */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800">
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

                {/* Actions & Stats */}
                <div className="flex items-center gap-6 justify-between w-full md:w-auto">
                  <div className="text-right">
                    <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{link.clicks}</span>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">clics</span>
                  </div>
                  
                  <div className="flex gap-2">
                     {/* Bouton Copier */}
                     <button className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <Copy size={18} />
                     </button>
                     
                     {/* Bouton Stats */}
                     <Link href={`/stats/${link.short_code}`} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <BarChart3 size={18} />
                     </Link>

                     {/* Bouton Visiter */}
                     <a href={link.long_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                        <ExternalLink size={18} />
                     </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Link2 size={32} className="text-gray-300 dark:text-slate-600" />
              </div>
              <p className="text-gray-400 dark:text-slate-600 font-bold italic text-lg">{t.no_links}</p>
          </div>
        )}
      </div>
    </div>
  );
}