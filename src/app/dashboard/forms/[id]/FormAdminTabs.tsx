/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { LayoutDashboard, Palette, Send, Loader2, Settings2, Sparkles } from 'lucide-react'
import OverviewTab from './tabs/OverviewTab'
import DesignTab from './tabs/DesignTab'
import CommunicationTab from './tabs/CommunicationTab'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FormAdminTabs({ form, t, lang }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'design' | 'comms'>('overview')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const togglePublish = async () => {
    if (form.is_published) {
      setLoading(true)
      await supabase.from('forms').update({ is_published: false }).eq('id', form.id)
      router.refresh()
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/forms/publish', {
        method: 'POST',
        body: JSON.stringify({ formId: form.id, lang }),
      })
      if (res.ok) {
        const data = await res.json()
        const inv_alert = lang === 'fr' ? 'invitations envoyées !' : 'Invitations sent'
        if (data.count > 0) alert(`${data.count} ${inv_alert}`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAskAI = () => {
    const id = crypto.randomUUID()
    const chats = JSON.parse(localStorage.getItem('rtbx_chats') || '[]')
    chats.unshift({
      id,
      title: form.title,
      context: 'form',
      entityId: form.id,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('rtbx_chats', JSON.stringify(chats.slice(0, 50)))
    localStorage.setItem(`rtbx_chat_context_${id}`, 'form')
    localStorage.setItem(`rtbx_chat_entity_${id}`, form.id)
    window.dispatchEvent(new Event('rtbx_chats_updated'))
    window.location.href = `/ai/chat/${id}`
  }

  const TABS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'design',   label: 'Design',    icon: Palette },
    { id: 'comms',    label: 'Diffusion', icon: Send },
  ]

  return (
    <div className="space-y-6">

      {/* HEADER — titre + actions */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        {/* Titre du form */}
        <div className="min-w-0">
          <h1 className="text-lg font-black text-gray-900 dark:text-white truncate">{form.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              form.is_published
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
            }`}>
              {form.is_published
                ? (lang === 'fr' ? '● Publié' : '● Published')
                : (lang === 'fr' ? '○ Brouillon' : '○ Draft')}
            </span>
            {form.category && (
              <span className="text-[10px] text-gray-400 font-medium">{form.category}</span>
            )}
          </div>
        </div>

        {/* Actions — grille 3 colonnes sur mobile */}
        <div className="grid grid-cols-3 gap-2">
          {/* Ask AI */}
          <button
            onClick={handleAskAI}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition-all border-none cursor-pointer"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Modifier */}
          <Link
            href={`/dashboard/forms/${form.id}/edit`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 no-underline border-none transition-all"
          >
            <Settings2 size={13} />
            <span className="hidden sm:inline">{lang === 'fr' ? 'Modifier' : 'Edit'}</span>
            <span className="sm:hidden">Edit</span>
          </Link>

          {/* Publier */}
          <button
            onClick={togglePublish}
            disabled={loading}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer disabled:opacity-50 ${
              form.is_published
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading
              ? <Loader2 size={13} className="animate-spin" />
              : <span>{form.is_published
                  ? (lang === 'fr' ? 'Dépublier' : 'Unpublish')
                  : (lang === 'fr' ? 'Publier' : 'Publish')}
                </span>
            }
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS — scrollable sur mobile */}
      <div
        className="flex gap-1 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md'
                : 'text-gray-400 bg-transparent hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENU DES ONGLETS */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && <OverviewTab form={form} lang={lang} />}
        {activeTab === 'design'   && <DesignTab form={form} lang={lang} supabase={supabase} router={router} />}
        {activeTab === 'comms'    && <CommunicationTab form={form} lang={lang} />}
      </div>
    </div>
  )
}