import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ScannerClient from './ScannerClient';

export default async function ScanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Seuls les marchands (utilisateurs connectés) peuvent scanner
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
       <ScannerClient lang={lang} />
    </main>
  );
}