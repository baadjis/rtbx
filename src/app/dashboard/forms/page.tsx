import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Data } from './data';
import { FileText, Plus, MessageSquare, BarChart3, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function FormsDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // Récupération des formulaires avec le compte des réponses
  const { data: forms } = await supabase
    .from('forms')
    .select('*, form_responses(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    
      
      <div className="p-4 md:p-10 space-y-10 transition-colors duration-300">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    {t.title}
                </h1>
                <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">{t.sub}</p>
            </div>
            <Link href="/dashboard/forms/new" className="group inline-flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all no-underline">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
                {t.btn_new}
            </Link>
        </div>

        {/* LISTING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms && forms.length > 0 ? forms.map((form) => (
                <div key={form.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <FileText size={28} />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.card_responses}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mt-1">
                                {form.form_responses[0]?.count || 0}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                            {form.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            <Clock size={12} /> {t.card_created} : {new Date(form.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Link href={`/dashboard/forms/${form.id}`} className="flex-1 py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest text-center no-underline hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100 dark:border-slate-700">
                            {t.btn_manage}
                        </Link>
                        <Link href={`/f/${form.id}`} target="_blank" className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                            <BarChart3 size={20} />
                        </Link>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
                    <MessageSquare size={48} className="mx-auto text-gray-200 dark:text-slate-700 mb-6" />
                    <p className="text-gray-400 dark:text-slate-500 font-bold italic text-lg">{t.no_forms}</p>
                    <Link href="/dashboard/forms/new" className="inline-block mt-8 text-indigo-600 font-black uppercase text-xs tracking-[0.2em] hover:underline no-underline">
                        + Créer mon premier sondage
                    </Link>
                </div>
            )}
        </div>
       
      </div>

     
    
  );
}