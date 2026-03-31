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

  const { data: rewards } = await supabase
    .from('loyalty_points')
    .select('*, businesses(name, business_type)')
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 font-bold mb-8 no-underline">
            <ArrowLeft size={16} /> {lang === 'fr' ? 'Mon Dashboard' : 'My Dashboard'}
        </Link>
        
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-10">
            {lang === 'fr' ? 'Mes Points Fidélité' : 'My Loyalty Points'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards && rewards.length > 0 ? rewards.map((reward, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                    <Store className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white leading-none">{reward.businesses?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{reward.businesses?.business_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600">{reward.points_count}</span>
                  <span className="text-gray-400 text-xs font-bold"> / {reward.max_points}</span>
                </div>
              </div>

              <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${(reward.points_count / reward.max_points) * 100}%` }}
                ></div>
              </div>

              {reward.points_count >= reward.max_points && (
                <div className="flex items-center justify-center gap-2 text-green-500 font-black text-xs uppercase bg-green-50 dark:bg-green-900/20 py-2 rounded-xl border border-green-100">
                  <Gift size={16} /> {lang === 'fr' ? 'Cadeau disponible !' : 'Reward ready!'}
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-full p-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
               <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-bold italic">{lang === 'fr' ? 'Aucun point pour le moment.' : 'No points yet.'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}