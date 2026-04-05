import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Data } from '../data';
import { 
  Users, Ticket, CheckCircle2, 
  Clock, ArrowLeft, Settings, 
  QrCode, BarChart3, Mail, ChevronLeft 
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function EventAdminPage({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  // 1. Récupérer l'événement (Vérifie l'existence ET la propriété)
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', Id)
    .eq('organizer_id', user.id)
    .single();

  if (!event) redirect('/dashboard/events');

  // 2. Récupérer les participants
  const { data: participants } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', Id)
    .order('created_at', { ascending: false });

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // 3. Calcul des Stats
  const total = participants?.length || 0;
  const checkedIn = participants?.filter(p => p.checked_in).length || 0;
  const capacityPercent = event.max_capacity ? Math.round((total / event.max_capacity) * 100) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10 w-full">
        
        {/* HEADER ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
              <Link href="/dashboard/events" className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-indigo-600 no-underline transition-colors">
                  <ChevronLeft size={16} /> {t.back_to_events}
              </Link>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  {event.title}
              </h1>
          </div>
          <div className="flex gap-3">
              <Link href={`/dashboard/events/${Id}/edit`} className="p-3 bg-white dark:bg-slate-900 text-gray-400 hover:text-indigo-600 rounded-2xl border border-gray-100 dark:border-slate-800 transition-all shadow-sm">
                  <Settings size={22} />
              </Link>
              <Link href="/scan" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all no-underline">
                  <QrCode size={20} /> {t.btn_scan}
              </Link>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 w-fit mb-4">
                  <Users size={28} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_total}</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{total}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 w-fit mb-4">
                  <CheckCircle2 size={28} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_checked}</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{checkedIn}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 w-fit mb-4">
                  <BarChart3 size={28} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_capacity}</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                  {capacityPercent !== null ? `${capacityPercent}%` : '--'}
              </h3>
          </div>
        </div>

        {/* LISTE DES PARTICIPANTS */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Liste des Inscrits</h2>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-800">
                  <th className="px-8 py-6">{t.list_name}</th>
                  <th className="px-8 py-6">Email</th>
                  <th className="px-8 py-6">{t.list_status}</th>
                  <th className="px-8 py-6 text-right">{t.list_date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {participants && participants.length > 0 ? participants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">{p.full_name}</td>
                    <td className="px-8 py-6 text-gray-500 dark:text-slate-400 font-medium">{p.email}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.checked_in ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {p.checked_in ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {p.checked_in ? t.status_checked : t.status_registered}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-gray-400 dark:text-slate-500 font-bold text-xs">
                      {new Date(p.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic font-bold">
                      {t.no_participants}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}