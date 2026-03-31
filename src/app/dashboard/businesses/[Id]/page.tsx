import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import BusinessDetailsClient from './BusinessDetailsClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function BusinessPage({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const supabase = await createClient();
  
  // 1. Vérification de l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 2. Récupération des données en parallèle (Optimisation Performance)
  const [businessRes, pointsRes, historyRes] = await Promise.all([
    // Le business
    supabase.from('businesses').select('*').eq('id', Id).eq('user_id', user.id).single(),
    // Les stats de fidélité liées à ce business
    supabase.from('loyalty_points').select('points_count').eq('business_id', Id),
    // L'historique récent des scans
    supabase.from('loyalty_history').select('*').eq('business_id', Id).order('created_at', { ascending: false }).limit(5)
  ]);

  const business = businessRes.data;
  if (!business) redirect('/dashboard/businesses');

  // 3. Calcul des statistiques de fidélité
  const loyaltyStats = {
    totalCustomers: pointsRes.data?.length || 0,
    totalPoints: pointsRes.data?.reduce((acc, curr) => acc + (curr.points_count || 0), 0) || 0
  };

  const history = historyRes.data || [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* BOUTON RETOUR ALIGNÉ */}
        <div className="max-w-7xl mx-auto mb-8">
            <Link href="/dashboard/businesses" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft size={18} />
                </div>
                {lang === 'fr' ? 'Retour à mes commerces' : 'Back to my businesses'}
            </Link>
        </div>

        {/* COMPOSANT CLIENT AVEC TOUTES LES DATA RÉCUPÉRÉES */}
        <BusinessDetailsClient 
          business={business} 
          t={t} 
          lang={lang} 
          loyaltyStats={loyaltyStats}
          history={history}
        />
      </main>

      <Footer />
    </div>
  );
}