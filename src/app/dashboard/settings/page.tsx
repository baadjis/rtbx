import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsForm from './SettingsForm';
import { Data } from './data';

export default async function SettingsPage() {
  // 1. Protection de la route
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Gestion de la langue
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      
      {/* 
         On n'affiche le Header Global QUE sur ordinateur (lg:block).
         Sur mobile, c'est le header du DashboardLayout qui prend le relais.
      */}
      <div className="hidden lg:block">
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-20 relative z-10 w-full">
        
        {/* En-tête de la page Settings */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {t.title}
            </h1>
            <p className="text-base md:text-lg text-gray-500 dark:text-slate-400 font-medium mt-3 leading-relaxed">
                {t.sub}
            </p>
        </div>

        {/* Le formulaire avec onglets (Profile, Social, Account) */}
        <SettingsForm lang={lang} user={user} />
        
      </main>

      {/* 
         On n'affiche le Footer Global QUE sur ordinateur (lg:block).
         Sur mobile, on laisse l'espace libre pour la Bottom Nav.
      */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      
      {/* 
         Espace de sécurité en bas pour mobile pour éviter que 
         la BottomNav ne cache le bouton "Sauvegarder".
      */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}