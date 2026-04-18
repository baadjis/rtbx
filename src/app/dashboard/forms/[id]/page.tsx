import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import FormAdminTabs from './FormAdminTabs';

export default async function FormAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: form } = await supabase
    .from('forms')
    .select('*, form_responses(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!form) redirect('/dashboard/forms');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  return (
   <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
     
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <FormAdminTabs form={form} lang={lang} />
      </main>
      <Footer />
    </div>
  );
}