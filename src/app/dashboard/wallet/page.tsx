import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WalletSwitcher from './WalletSwitcher';
import { LangType } from '@/lib/lang/types';

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as LangType;

  // Récupération globale des données pour alimenter le Wallet
  const [profileRes, spacesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('spaces').select('*').eq('user_id', user.id)
  ]);

  return (
    <div className="py-6 md:py-10 flex flex-col items-center">
        <WalletSwitcher 
          user={user} 
          profile={profileRes.data} 
          spaces={spacesRes.data || []} 
          lang={lang} 
        />
    </div>
  );
}