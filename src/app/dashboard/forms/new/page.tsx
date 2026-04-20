import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NewFormClient from './NewFormClient';

export default async function NewFormPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Récupérer les suggestions de noms (Profil + Commerces)
  const [{ data: profile }, { data: businesses }] = await Promise.all([
    supabase.from('profiles').select('company').eq('id', user.id).single(),
    supabase.from('businesses').select('name').eq('user_id', user.id)
  ]);

  const suggestions = [
    ...(profile?.company ? [profile.company] : []),
    ...(businesses?.map(b => b.name) || [])
  ];

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  return <NewFormClient lang={lang} suggestions={[...new Set(suggestions)]} />;
}