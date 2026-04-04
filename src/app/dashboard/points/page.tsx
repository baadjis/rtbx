import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Store, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PointsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  // Récupération des points de fidélité
  const { data: rewards } = await supabase
    .from('loyalty_points')
    .select('*, businesses(name, business_type)')
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      
      {/* HEADER : Uniquement sur Ordinateur */}
      <div className="hidden lg:block">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 lg:py-20 relative z-10 flex-1 w-full">
        
        {/* BOUTON RETOUR : Aligné avec le reste */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 dark:text-slate-500 font-bold mb-8 no-underline hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> {lang === 'fr' ? 'Mon Dashboard' : 'My Dashboard'}
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-10 tracking-tight leading-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent w-fit">
            {lang === 'fr' ? 'Mes Points Fidélité' : 'My Loyalty Points'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards && rewards.length > 0 ? rewards.map((reward, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shadow-sm">
                    <Store className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 dark:text-white leading-none truncate">{reward.businesses?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{reward.businesses?.business_type}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{reward.points_count}</span>
                  <span className="text-gray-400 text-xs font-bold"> / {reward.max_points}</span>
                </div>
              </div>

              {/* BARRE DE PROGRESSION */}
              <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-50 dark:border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(reward.points_count / reward.max_points) * 100}%` }}
                ></div>
              </div>

              {/* BADGE CADEAU */}
              {reward.points_count >= reward.max_points ? (
                <div className="flex items-center justify-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 dark:bg-green-900/20 py-3 rounded-2xl border border-green-100 dark:border-green-900/30 animate-pulse">
                  <Gift size={16} /> {lang === 'fr' ? 'Cadeau disponible !' : 'Reward ready!'}
                </div>
              ) : (
                <div className="text-center py-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {lang === 'fr' ? 'Plus que' : 'Only'} {reward.max_points - reward.points_count} {lang === 'fr' ? 'points' : 'points to go'}
                    </p>
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-full p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
               <Star className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
               <p className="text-gray-400 dark:text-slate-500 font-bold italic">{lang === 'fr' ? 'Aucun point pour le moment.' : 'No points yet.'}</p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER : Uniquement sur Ordinateur */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* ESPACE DE SÉCURITÉ : Uniquement sur Mobile (BottomNav) */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}