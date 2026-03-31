import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsForm from './SettingsForm';
import { Data } from './data';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                {t.title}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">{t.sub}</p>
        </div>

        <SettingsForm lang={lang} user={user} />
      </main>
      <Footer />
    </div>
  );
}