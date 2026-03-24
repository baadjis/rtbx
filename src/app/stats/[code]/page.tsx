import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import Link from 'next/link';
import { BarChart3, ArrowRight, MousePointer2, Link2, ArrowLeft, LayoutDashboard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PublicStatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  
  // 1. Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 2. Récupérer les infos du lien
  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', code)
    .single();

  if (!link) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center p-10 bg-gray-50 dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{t.link_not_found}</h1>
              <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold no-underline hover:underline">
                <ArrowLeft size={18} /> {t.back_to_home}
              </Link>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Traductions locales spécifiques pour l'état connecté
  const loggedInTexts = {
    fr: {
        title: "Gérez vos liens efficacement",
        desc: "Retrouvez l'ensemble de vos statistiques et gérez vos QR codes directement depuis votre tableau de bord personnel.",
        btn: "Aller à mon Dashboard"
    },
    en: {
        title: "Manage your links effectively",
        desc: "Find all your statistics and manage your QR codes directly from your personal dashboard.",
        btn: "Go to Dashboard"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col items-center">
        
        <div className="max-w-2xl w-full space-y-8 md:space-y-12">
          
          {/* CARD STATS */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-slate-800 text-center relative overflow-hidden transition-colors">
            
            <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-8 relative z-10">
              <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>

            <h1 className="text-xs md:text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4 relative z-10">
              {t.stats_for} <span className="text-indigo-600 dark:text-indigo-400">/{code}</span>
            </h1>

            <div className="text-7xl md:text-9xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter relative z-10">
              {link.clicks}
            </div>

            <p className="text-gray-400 dark:text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-10 relative z-10">
              {t.clicks_registered}
            </p>
            
            <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-sm text-gray-600 dark:text-slate-400 font-medium break-all border border-gray-100 dark:border-slate-800 relative z-10 flex items-center justify-center gap-2">
               <Link2 size={16} className="text-gray-400 flex-shrink-0" />
               <span className="truncate">{link.long_url}</span>
            </div>

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
          </div>

          {/* CTA DYNAMIQUE (DÉPEND DE LA CONNEXION) */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 md:p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight tracking-tight">
                  {isLoggedIn ? loggedInTexts.title : t.cta_stats_title}
              </h2>
              <p className="text-indigo-100 mb-10 text-base md:text-lg font-medium leading-relaxed opacity-90">
                  {isLoggedIn ? loggedInTexts.desc : t.cta_stats_desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                    <Link href="/dashboard" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-center hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg no-underline">
                        <LayoutDashboard className="w-5 h-5" /> {loggedInTexts.btn}
                    </Link>
                ) : (
                    <Link href="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-center hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg no-underline">
                        {t.create_free_account} <ArrowRight className="w-5 h-5" />
                    </Link>
                )}
              </div>
            </div>
            
            <MousePointer2 className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700" />
          </div>

          {/* RETOUR ACCUEIL */}
          <Link href="/" className="flex items-center justify-center gap-2 text-gray-400 dark:text-slate-500 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase text-[10px] tracking-[0.2em] no-underline">
             {t.back_to_home}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}