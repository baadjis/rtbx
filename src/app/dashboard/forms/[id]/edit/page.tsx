import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import EditFormClient from './EditFormClient';
import { Data } from '../../data';

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Récupérer le formulaire existant
  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!form) redirect('/dashboard/forms');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t= Data[lang]
  return (
    <div className="p-4 md:p-10">
      <EditFormClient 
        t={t}
        lang={lang} 
        form={form} 
      />
    </div>
  );
}