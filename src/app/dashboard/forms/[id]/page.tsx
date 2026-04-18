/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Data } from '../data';
import { 
  BarChart3, ArrowLeft, Share2, 
  MessageSquare, Calendar, Download, 
  Settings, Users, Star, 
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QRCodeCanvas } from 'qrcode.react'; // À gérer dans un composant client si besoin d'import dynamique
import FormAdminClient from './FormAdminClient'; // On crée un petit client pour le QR et le Toggle

export default async function FormAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Récupération du formulaire et des réponses
  const { data: form } = await supabase
    .from('forms')
    .select('*, form_responses(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!form) redirect('/dashboard/forms');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // 2. Logique d'analyse des données
  const responses = form.form_responses || [];
  const totalResponses = responses.length;
  
  // Calcul du score moyen (uniquement sur les champs type 'range')
  let totalScore = 0;
  let scoreCount = 0;
  
  responses.forEach((resp: any) => {
    Object.keys(resp.answers_json).forEach(key => {
      const val = resp.answers_json[key];
      if (typeof val === 'number') {
        totalScore += val;
        scoreCount++;
      }
    });
  });

  const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '--';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
                <Link href="/dashboard/forms" className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-indigo-600 no-underline transition-colors">
                    <ArrowLeft size={16} /> {t.back_to_forms}
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    {form.title}
                </h1>
            </div>
            <div className="flex gap-3">
    {/* LIEN D'ÉDITION RECTIFIÉ */}
    <Link 
        href={`/dashboard/forms/${form.id}/edit`} 
        className="p-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all flex items-center justify-center no-underline"
        title={lang === 'fr' ? 'Modifier le formulaire' : 'Edit form'}
    >
        <Edit3 size={22} />
    </Link>

    <Link href={`/f/${form.id}`} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all no-underline">
        <Share2 size={18} /> {t.btn_link}
    </Link>
</div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Users size={24} />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_total_resp}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{totalResponses}</h3>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center mb-4">
                    <Star size={24} fill="currentColor" />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_avg_score}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{avgScore}<span className="text-sm text-gray-400">/10</span></h3>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar size={24} />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.stat_last_activity}</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2">
                    {responses.length > 0 ? new Date(responses[0].created_at).toLocaleDateString() : '--'}
                </h3>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LISTE DES RÉPONSES (2/3) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t.table_answers}</h2>
                    <button className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">
                        <Download size={14} /> {t.btn_export}
                    </button>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-slate-800">
                    {responses.length > 0 ? responses.map((resp: any) => (
                        <div key={resp.id} className="p-8 hover:bg-gray-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    ID #{resp.id}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {new Date(resp.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(resp.answers_json).map((key) => (
                                    <div key={key} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter mb-1">{key.slice(0,8)}...</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-slate-200">{resp.answers_json[key]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center text-gray-400 italic font-bold tracking-tight">
                            {t.no_responses}
                        </div>
                    )}
                </div>
            </div>

            {/* SIDEBAR QR CODE (1/3) */}
            <div className="space-y-6">
                <FormAdminClient formId={form.id} t={t} lang={lang} />
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}