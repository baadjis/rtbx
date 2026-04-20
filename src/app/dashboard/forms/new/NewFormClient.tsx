/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Loader2, Layout, Store, PenTool } from 'lucide-react'
import Link from 'next/link'
import { Data } from '../data'

export default function NewFormClient({ lang, suggestions }: any) {
    const t = Data[lang as 'fr'|'en'] 
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orgType, setOrgType] = useState('suggestion')
  //const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // On récupère le nom de l'organisation selon le type choisi (suggestion ou manuel)
    const finalOrgName = orgType === 'suggestion' 
        ? formData.get('org_suggest') 
        : formData.get('org_custom');

    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      visibility: formData.get('visibility'),
      org_name: finalOrgName
    };

    try {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        // Redirection immédiate vers la page de gestion (onglet Overview par défaut)
        router.push(`/dashboard/forms/${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert(lang === 'fr' ? "Erreur : " + err.message : "Error: " + err.message);
      setLoading(false);
    }
};

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800">
        <h1 className="text-4xl font-black mb-8 dark:text-white italic">{t.new_form}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="title" required placeholder="Titre du sondage" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
          
          {/* SECTION ORGANISATEUR INTELLIGENTE */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.organism_social_reason}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select onChange={(e) => setOrgType(e.target.value)} className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white">
                    <option value="suggestion">✨ {t.use_suggestion}</option>
                    <option value="custom">✍️ {t.type_another_name}</option>
                </select>
                {orgType === 'suggestion' ? (
                    <select name="org_suggest" className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border-none rounded-2xl font-bold text-indigo-600">
                        {suggestions.map((s: string) => <option key={s} value={s}>{s}</option>)}
                        {suggestions.length === 0 && <option value="RetailBox User">{t.my_account}</option>}
                    </select>
                ) : (
                    <input name="org_custom" required placeholder={t.entity_name} className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <select name="category" className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white"><option value="survey">📊 {t.category_survey}</option><option value="satisfaction">😊 {t.category_satisfaction}</option></select>
            <select name="visibility" className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-indigo-600"><option value="public">🌍 Public</option><option value="private">🔒 {t.private}</option></select>
          </div>

          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Layout size={20} />} {t.btn_new}
          </button>
        </form>
      </div>
    </div>
  )
}