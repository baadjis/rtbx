import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Data} from './data';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="p-4 md:p-10 space-y-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            {t.settings_title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
            {t.settings_sub}
        </p>
      </div>

      <SettingsForm lang={lang} user={user} />
    </div>
  );
}