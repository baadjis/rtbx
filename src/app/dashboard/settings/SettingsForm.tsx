/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User, Lock, Mail, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import { Data } from './data'

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpdateProfile = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })
    if (!error) setMsg(t.update_success)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* SECTION PROFIL */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <User className="text-indigo-600" /> {t.profile_sec}
        </h3>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_display_name}</label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            />
          </div>

          <div className="space-y-2 opacity-60">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_email}</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input disabled value={user.email} className="w-full p-4 pl-12 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold cursor-not-allowed" />
            </div>
          </div>

          {msg && <p className="text-green-500 font-bold text-sm flex items-center gap-2 animate-in slide-in-from-left-2"><CheckCircle2 size={16}/> {msg}</p>}

          <button disabled={loading} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : t.btn_update}
          </button>
        </form>
      </div>

      {/* SECTION SÉCURITÉ */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Lock className="text-indigo-600" /> {t.connexion_sec}
        </h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Réinitialisez votre mot de passe pour sécuriser votre compte.</p>
        <button className="px-8 py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
          {t.btn_pass}
        </button>
      </div>

      {/* ZONE DE DANGER */}
      <div className="p-8 md:p-10 rounded-[3rem] border-2 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/5">
        <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-4 flex items-center gap-3">
          <Trash2 /> {t.danger_zone}
        </h3>
        <p className="text-red-700/70 dark:text-red-400/70 text-sm font-medium mb-8 leading-relaxed">
          {t.delete_warn}
        </p>
        <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-lg shadow-red-100 dark:shadow-none transition-all">
          {t.delete_account}
        </button>
      </div>
    </div>
  )
}