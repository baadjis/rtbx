import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalletSwitcher from './WalletSwitcher';

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  // Récupération du profil sur le serveur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* On passe les données au composant interactif */}
        <WalletSwitcher 
          user={user} 
          profile={profile} 
          lang={lang} 
        />
      </main>
      <Footer />
    </div>
  );
}