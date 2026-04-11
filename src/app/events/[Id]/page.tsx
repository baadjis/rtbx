import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegistrationForm from './RegistrationForm';
import { Calendar, MapPin, Clock, ShieldCheck, User } from 'lucide-react';
import { Data } from '../data';

export default async function PublicEventPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ Id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { Id } = await params;
  const sParams = await searchParams; // On attend les paramètres de recherche
  const origin = (sParams.origin as string) || 'direct';
  const supabase = await createClient();
  
  // On extrait l'ID numérique si l'URL est rtbx.space/events/123-mon-titre
  const eventId = Id.split('-')[0];

  const { data: event } = await supabase.from('events').select('*, profiles(first_name, last_name, company)').eq('id', eventId).single();
  if (!event) return <div className="min-h-screen flex items-center justify-center font-black">Event Not Found</div>;

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  const formatDate = (date: string) => new Date(date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* INFO SECTION */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                <ShieldCheck size={14} /> {lang === 'fr' ? 'Événement Vérifié' : 'Verified Event'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                {event.title}
            </h1>

            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl"><Calendar size={20} className="text-indigo-600"/></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.card_start}</p>
                        <p className="font-bold dark:text-white">{formatDate(event.start_date)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl"><MapPin size={20} className="text-indigo-600"/></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                        <p className="font-bold dark:text-white">{event.location}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <User size={20} className="text-indigo-600" /> {t.hosted_by} 
                    <span className="text-indigo-600 uppercase tracking-tight">{event.profiles?.company || 'RetailBox Partner'}</span>
                </h3>
                <div className="text-gray-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-medium space-y-4">
                    {event.description?.split('\n').map((para:string, i:number) => <p key={i}>{para}</p>)}
                </div>
            </div>
          </div>

          {/* REGISTRATION FORM */}
          <div className="lg:sticky lg:top-32 h-fit">
            
 <RegistrationForm 
              eventId={event.id} 
              lang={lang} 
              t={t} 
              origin={origin}
              eventConfig={{
                ask_company: event.ask_company,
                ask_professional_role: event.ask_professional_role,
                form_config: event.form_config
              }} 
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}