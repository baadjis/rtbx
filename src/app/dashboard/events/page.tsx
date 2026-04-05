import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Data } from './data';
import { Calendar, Plus, MapPin, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function EventsDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  // Récupération des événements avec le compte des inscrits
  const { data: events } = await supabase
    .from('events')
    .select('*, event_registrations(count)')
    .eq('organizer_id', user.id)
    .order('start_date', { ascending: true });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-10 space-y-10 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">{t.sub}</p>
        </div>
        <Link href="/dashboard/events/new" className="group inline-flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all no-underline">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          {t.btn_new}
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events && events.length > 0 ? events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
            
            <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                    <Calendar size={28} />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${event.is_published ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {event.is_published ? t.status_live : t.status_draft}
                    </span>
                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                      {event.event_registrations[0]?.count || 0}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{t.card_participants}</p>
                </div>
            </div>
            
            <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400 text-sm font-medium">
                        <Clock size={16} className="text-indigo-500" />
                        <span>{t.card_start} : {formatDate(event.start_date)}</span>
                    </div>
                    {event.end_date && (
                        <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400 text-sm font-medium">
                            <div className="w-4" /> {/* Aligner avec le haut */}
                            <span>{t.card_end} : {formatDate(event.end_date)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400 text-sm font-medium">
                        <MapPin size={16} className="text-indigo-500" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-10">
                <Link href={`/dashboard/events/${event.id}`} className="flex-1 py-4 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-center no-underline hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 transition-all border border-gray-100 dark:border-slate-700">
                    {t.btn_manage}
                </Link>
                <Link href={`/events/${event.id}`} className="flex-1 py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-center no-underline flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                    {t.btn_link} <ArrowRight size={16} />
                </Link>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
              <Calendar size={48} className="mx-auto text-gray-200 dark:text-slate-700 mb-6" />
              <p className="text-gray-400 dark:text-slate-500 font-bold italic text-lg">{t.no_events}</p>
              <Link href="/dashboard/events/new" className="inline-block mt-8 text-indigo-600 font-black uppercase text-xs tracking-[0.2em] hover:underline no-underline">
                 {lang=='fr'? "+ Lancer mon premier evenement":"Create my first event"}
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}