import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import BusinessDetailsClient from './BusinessDetailsClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BusinessPage({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = DICT[lang];

  // Récupérer le business spécifique
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', Id)
    .eq('user_id', user.id)
    .single();

  if (!business) redirect('/dashboard/businesses');

  return (
    <div className="p-4 md:p-10 space-y-8">
      <Link href="/dashboard/businesses" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-4 hover:text-indigo-600 transition-colors no-underline">
        <ArrowLeft size={18} /> {lang === 'fr' ? 'Retour à la liste' : 'Back to list'}
      </Link>

      <BusinessDetailsClient business={business} t={t} lang={lang} />
    </div>
  );
}