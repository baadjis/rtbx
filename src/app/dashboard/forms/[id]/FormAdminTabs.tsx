/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { LayoutDashboard, Palette, Send, Globe, Lock, Loader2, Settings2 } from 'lucide-react'
import OverviewTab from './tabs/OverviewTab'
import DesignTab from './tabs/DesignTab'
import CommunicationTab from './tabs/CommunicationTab'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FormAdminTabs({ form, t,lang }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'design' | 'comms'>('overview')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const togglePublish = async () => {
    setLoading(true)
    await supabase.from('forms').update({ is_published: !form.is_published }).eq('id', form.id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="space-y-10">
      {/* HEADER : TITRE + PUBLICATION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${form.is_published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {form.is_published ? <Globe size={28} /> : <Lock size={28} />}
            </div>
            <div>
                <h1 className="text-3xl font-black dark:text-white leading-tight">{form.title}</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {form.is_published ? t.status_live : t.status_draft} • {form.category}
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* BOUTON MODIFIER (Lien vers la page edit) */}
          <Link 
            href={`/dashboard/forms/${form.id}/edit`}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 no-underline border-none"
          >
            <Settings2 size={14} />
            {lang === 'fr' ? 'Modifier' : 'Edit'}
          </Link>

          {/* BOUTON PUBLIER / BROUILLON */}
          <button 
            onClick={togglePublish} 
            disabled={loading} 
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-lg ${
              form.is_published 
              ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : (form.is_published ? t.btn_unpublish : t.btn_publish)}
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'design', label: 'Design & Questions', icon: Palette },
          { id: 'comms', label: 'Diffusion & QR', icon: Send }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' : 'text-gray-400 bg-transparent'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* RENDU DES ONGLETS */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && <OverviewTab form={form} lang={lang} />}
        {activeTab === 'design' && <DesignTab form={form} lang={lang} supabase={supabase} router={router} />}
        {activeTab === 'comms' && <CommunicationTab form={form} lang={lang} />}
      </div>
    </div>
  )
}