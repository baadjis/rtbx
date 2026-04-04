import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
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
    /* Pas de Header, pas de Footer, pas de min-h-screen forcé */
    <div className="py-6 md:py-10 flex flex-col items-center animate-in fade-in duration-500">
        <WalletSwitcher 
          user={user} 
          profile={profile} 
          lang={lang} 
        />
    </div>
  );
}