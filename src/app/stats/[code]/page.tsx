/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Data } from './data';
import Link from 'next/link';
import { 
  BarChart3, ArrowRight, MousePointer2, 
  Link2, ArrowLeft, LayoutDashboard, 
  Globe, Smartphone, LockKeyhole, ShieldCheck
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PublicStatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  // 1. Récupérer les informations du lien
  const { data: link } = await supabase
    .from('links')
    .select('id, clicks, long_url, short_code')
    .eq('short_code', code)
    .single();

  if (!link) {
    return <div className="min-h-screen flex items-center justify-center">Lien introuvable</div>;
  }

  // 2. Récupérer les logs réels pour les pays et appareils
  // Note : On récupère les données même si non connecté pour préparer le rendu, 
  // mais on les masquera visuellement si l'user n'est pas connecté.
  const { data: logs } = await supabase
    .from('link_logs')
    .select('country, device')
    .eq('link_id', link.id);

  // 3. Logique d'agrégation des données réelles
  const aggregateData = (arr: any[], key: string) => {
    const counts = arr?.reduce((acc, obj) => {
      const val = obj[key] || (lang === 'fr' ? 'Non défini' : 'Not set');
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    
    if (!counts) return [];
    const total = arr.length;
    return Object.entries(counts)
      .map(([name, count]) => ({ name, percentage: Math.round(((count as number) / total) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // On garde le top 5
  };

  const countryStats = aggregateData(logs || [], 'country');
  const deviceStats = aggregateData(logs || [], 'device');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col items-center">
        
        <div className="max-w-4xl w-full space-y-12">
          
          {/* --- HEADER & COMPTEUR --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Grand Compteur (Donnée de la table links) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 text-center relative overflow-hidden flex flex-col justify-center">
                <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-6 mx-auto">
                    <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">
                    {t.stats_for || 'Stats'} <span className="text-indigo-600 dark:text-indigo-400">/{code}</span>
                </h1>
                <div className="text-8xl md:text-9xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                    {link.clicks}
                </div>
                <p className="text-gray-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    {t.clicks_registered || 'Clics enregistrés'}
                </p>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl"></div>
            </div>

            {/* Info Destination */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 flex flex-col justify-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-700">
                    <Link2 size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                    <p className="text-sm font-bold truncate dark:text-slate-300 leading-tight">{link.long_url}</p>
                </div>
                <a href={link.long_url} target="_blank" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                    Visiter le lien <ArrowRight size={14} />
                </a>
            </div>
          </div>

          {/* --- SECTION ANALYTICS DÉTAILLÉES --- */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            
            {/* OVERLAY DE VERROUILLAGE SI PAS CONNECTÉ */}
            {!isLoggedIn && (
                <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transition-all">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl flex items-center justify-center mb-6">
                        <LockKeyhole className="text-indigo-600 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                        {lang === 'fr' ? 'Analyses détaillées verrouillées' : 'Detailed Analytics Locked'}
                    </h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                        {lang === 'fr' ? 'Connectez-vous pour débloquer l\'origine géographique et les appareils de vos visiteurs.' : 'Sign in to unlock geographic origin and device data for your visitors.'}
                    </p>
                    <Link href="/register" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/30 no-underline hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
                        {lang === 'fr' ? "S'inscrire gratuitement" : "Sign up for free"}
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Pays */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Globe className="text-indigo-600 dark:text-indigo-400" size={24} />
                        <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">{lang === 'fr' ? 'Top Pays' : 'Top Countries'}</h2>
                    </div>
                    <div className="space-y-6">
                        {countryStats.length > 0 ? countryStats.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-600 dark:text-slate-300">{item.name}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">{item.percentage}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000" style={{width: `${item.percentage}%`}}></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No data yet</p>
                        )}
                    </div>
                </div>

                {/* Appareils */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Smartphone className="text-indigo-600 dark:text-indigo-400" size={24} />
                        <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">{lang === 'fr' ? 'Appareils' : 'Devices'}</h2>
                    </div>
                    <div className="space-y-6">
                        {deviceStats.length > 0 ? deviceStats.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-600 dark:text-slate-300">{item.name}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">{item.percentage}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000" style={{width: `${item.percentage}%`}}></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No data yet</p>
                        )}
                    </div>
                </div>
            </div>
          </div>

          {/* --- FOOTER CTA --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-[0.2em] no-underline">
                <ArrowLeft size={14} /> {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
            {isLoggedIn && (
                <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-black text-xs uppercase tracking-widest no-underline hover:bg-indigo-600 hover:text-white transition-all">
                    <LayoutDashboard size={14} /> Accéder à mon espace
                </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}