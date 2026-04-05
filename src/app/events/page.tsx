import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, MapPin, ArrowRight, Search, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Data } from './data';

export default async function EventsListPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // On récupère uniquement les événements PUBLIÉS
  const { data: events } = await supabase
    .from('events')
    .select('*, profiles(company)')
    .eq('is_published', true)
    .order('start_date', { ascending: true });

  const formatDate = (date: string) => new Date(date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 w-full">
        
        {/* HEADER DE LA LISTE */}
        <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <Calendar className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                    Agenda
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                {t.list_title}
            </h1>
            <p className="text-xl text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.list_sub}
            </p>
        </div>

        {/* GRILLE DES ÉVÉNEMENTS */}
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}-${event.title.toLowerCase().replace(/ /g, '-')}`}
                className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-500 flex flex-col no-underline"
              >
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 group-hover:text-indigo-600 transition-colors">
                        <Ticket size={24} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {event.profiles?.company || 'Retailer'}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 font-medium">
                        <Calendar size={14} className="text-indigo-500" />
                        {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 font-medium">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                    {t.btn_view} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-gray-50 dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
             <Calendar className="w-16 h-16 text-gray-200 dark:text-slate-800 mx-auto mb-4" />
             <p className="text-gray-400 font-bold italic">{t.no_events}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}