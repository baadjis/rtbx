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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      
      {/* On garde le Header en haut pour la navigation */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 relative z-10 w-full">
        
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

      {/* --- LOGIQUE DE VISIBILITÉ DU FOOTER --- */}
      {/* hidden = masqué sur mobile | md:block = affiché sur ordinateur (Medium et +) */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Espace de sécurité en bas pour mobile (à cause de la BottomNav) */}
      <div className="h-20 md:hidden" />
    </div>
  );
}