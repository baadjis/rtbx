import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Data} from './data';
import { Store, MapPin, Star, Plus, ChevronRight, Settings2 } from 'lucide-react';
import Link from 'next/link';

export default async function MyBusinessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  // Récupérer les établissements de l'utilisateur
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.my_businesses}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            {businesses?.length || 0} {t.business_total}
          </p>
        </div>
        
        <Link href="/tools/google-reviews" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95 no-underline">
          <Plus size={18} /> {t.add_business}
        </Link>
      </div>

      {/* GRILLE DES ÉTABLISSEMENTS */}
      {businesses && businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((biz) => (
            <div key={biz.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="text-indigo-600 dark:text-indigo-400" size={28} />
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-black">
                  <Star size={14} fill="currentColor" /> 4.8
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{biz.name}</h3>
              <div className="flex items-start gap-2 text-gray-400 dark:text-slate-500 mb-8">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <p className="text-sm font-medium leading-relaxed">{biz.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href={`/tools/google-reviews`} className="py-3 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-xl text-xs font-black text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all no-underline flex items-center justify-center gap-2">
                   QR Avis
                </Link>
                <Link href={`/tools/wifi`} className="py-3 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-xl text-xs font-black text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all no-underline flex items-center justify-center gap-2">
                   QR WiFi
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
            <Store size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400 dark:text-slate-600 font-bold italic text-lg">{t.no_businesses}</p>
            <Link href="/tools/google-reviews" className="mt-6 inline-block text-indigo-600 font-black uppercase text-xs tracking-widest hover:underline">
                Rechercher mon premier commerce →
            </Link>
        </div>
      )}
    </div>
  );
}