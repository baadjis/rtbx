import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditEventForm from './EditEventForm';

export default async function EditPage({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: event } = await supabase.from('events').select('*').eq('id', Id).single();
  if (!event || event.organizer_id !== user.id) redirect('/dashboard/events');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  return <EditEventForm lang={lang} event={event} />;
}