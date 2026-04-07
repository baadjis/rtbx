import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Data } from '../data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventAdminTabs from './EventAdminTabs'; // On va créer ce composant

export default async function EventAdminPage({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Récupération de toutes les données liées (Event + Agenda + Inscriptions + Invitations)
  const [eventRes, agendaRes, participantsRes, invitesRes] = await Promise.all([
    supabase.from('events').select('*').eq('id', Id).eq('organizer_id', user.id).single(),
    supabase.from('event_agenda').select('*').eq('event_id', Id).order('start_time', { ascending: true }),
    supabase.from('event_registrations').select('*').eq('event_id', Id).order('created_at', { ascending: false }),
    supabase.from('event_invitations').select('*').eq('event_id', Id).order('created_at', { ascending: false })
  ]);

  if (!eventRes.data) redirect('/dashboard/events');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
     
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <EventAdminTabs 
          lang={lang}
          event={eventRes.data}
          agenda={agendaRes.data || []}
          participants={participantsRes.data || []}
          invitations={invitesRes.data || []}
          t={Data[lang]}
        />
      </main>
      <Footer />
    </div>
  );
}