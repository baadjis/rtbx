/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Loader2 } from 'lucide-react'

// Import des sous-composants
import OverviewTab from './OverviewTab'
import AgendaTab from './AgendaTab'
import InvitesTab from './InvitesTab'
import CommsTab from './CommsTab'

export default function EventAdminTabs({ lang, event, agenda, participants, invitations, t }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'invites' | 'comms'>('overview')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const togglePublish = async () => {
    setLoading(true)
    await supabase.from('events').update({ is_published: !event.is_published }).eq('id', event.id)
    router.refresh()
    setLoading(false)
  }

  const tabProps = { lang, event, agenda, participants, invitations, t, supabase, router }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* HEADER DE PUBLICATION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${event.is_published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
            {event.is_published ? <Globe size={24} /> : <Lock size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-black dark:text-white leading-none">{event.title}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{event.is_published ? t.status_live : t.status_draft}</p>
          </div>
        </div>
        <button onClick={togglePublish} disabled={loading} className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-lg ${event.is_published ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}>
          {loading ? <Loader2 className="animate-spin" /> : (event.is_published ? t.btn_unpublish : t.btn_publish)}
        </button>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-[2rem] w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {['overview', 'agenda', 'invites', 'comms'].map((tabId: any) => (
          <button key={tabId} onClick={() => setActiveTab(tabId)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer whitespace-nowrap ${activeTab === tabId ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-gray-400 bg-transparent'}`}>
            {/* @ts-ignore 
            */}
            {t[`tab_${tabId}`]}
          </button>
        ))}
      </div>

      {/* RENDU DES ONGLETS */}
      {activeTab === 'overview' && <OverviewTab {...tabProps} />}
      {activeTab === 'agenda' && <AgendaTab {...tabProps} />}
      {activeTab === 'invites' && <InvitesTab {...tabProps} />}
      {activeTab === 'comms' && <CommsTab {...tabProps} />}
    </div>
  )
}