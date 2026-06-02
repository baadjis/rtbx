// app/events/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventAIWidget from './EventAIWidget';
import { Data } from '../data';
import Link from 'next/link';
import { getLang } from '@/lib/lang/lang-getter';
import { LangType } from '@/lib/lang/types';
import EventIdClient from './EventIdClient';

export default async function PublicEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const origin = (sParams.origin as string) || 'direct';

  const supabase = await createClient();
  const eventId = id.split('-')[0];

  const { data: event } = await supabase
    .from('events')
    .select('*, profiles(first_name, last_name, company)')
    .eq('id', eventId)
    .single();
  const lang = await getLang() as LangType
  const t = Data[lang];

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <div className="text-center space-y-4">
          <p className="text-2xl font-black text-gray-900">{t.no_events}</p>
          <Link href="/events" className="text-indigo-600 text-sm font-medium hover:underline">
            ← {t.back_home}
          </Link>
        </div>
      </div>
    );
  }

 

  // Vérifier si user connecté pour le widget AI
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Header />

      <EventIdClient lang={lang} t={t} event={event} origin={origin}/>

      <Footer />

      {/* AI WIDGET — visible seulement si connecté */}
      {isLoggedIn && (
        <EventAIWidget eventId={event.id} eventTitle={event.title} lang={lang} />
      )}
    </div>
  );
}