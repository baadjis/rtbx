import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Data } from './data';
import { 
  Store, MapPin, Star, Plus, 
  Utensils, Scissors, ShoppingBag, 
  Wifi, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import RenderBusiness from './RenderBusiness';

export default async function MyBusinessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  //const cookieStore = await cookies();
  const lang = await getLang() as LangType;
  const t = Data[lang];

  // Récupérer les établissements de l'utilisateur
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

 

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.my_businesses}
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 font-medium mt-2">
            {businesses?.length || 0} {t.business_total}
          </p>
        </div>
        
        <Link href="/dasshboard/businesses/create" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 no-underline">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          {t.add_business}
        </Link>
      </div>

      {/* GRILLE DES ÉTABLISSEMENTS */}
      {businesses && businesses.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {businesses.map((biz) => {
      return (
        <RenderBusiness  biz={biz} key={biz.id}/>
      );
    })}
  </div>
) : 
       (
        <div className="p-20 md:p-32 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Store size={48} className="text-gray-300 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.no_businesses}</h3>
            <p className="text-gray-500 dark:text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                {t.link_google_avis}
            </p>
            <Link href="/tools/google-reviews" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all no-underline">
                {t.search_my_business} <ArrowRight size={20} />
            </Link>
        </div>
      )}

      {/* FOOTER INFO SEO */}
      <div className="pt-10 border-t border-gray-50 dark:border-slate-900 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Google Business Integration • {lang.toUpperCase()}
        </p>
      </div>
    </div>
  );
}