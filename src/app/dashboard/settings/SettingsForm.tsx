/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  User, Lock, Mail, Trash2, CheckCircle2, 
  Loader2, Briefcase, Globe, Smartphone, Linkedin,
  Share2, Plus, GripVertical
} from 'lucide-react'
import { Data } from './data'

const SOCIAL_PLATFORMS = [
  "Instagram", "TikTok", "YouTube", "Facebook", "X (Twitter)", 
  "LinkedIn", "Spotify", "Threads", "Pinterest", "Twitch", "Snapchat", "WhatsApp"
];

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'social'>('profile')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  const [profile, setProfile] = useState<any>({
    first_name: '', last_name: '', company: '', 
    job_title: '', phone: '', website: '', linkedin_url: '',
    social_data: [] // Liste des réseaux
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        // On s'assure que social_data est au moins un tableau vide
        setProfile({ ...data, social_data: data.social_data || [] })
      }
    }
    fetchProfile()
  }, [user.id, supabase])

  // --- LOGIQUE SOCIALE ---
  const addSocial = () => {
    const current = profile.social_data || []
    setProfile({
      ...profile,
      social_data: [...current, { platform: SOCIAL_PLATFORMS[0], url: '' }]
    })
  }

  const removeSocial = (index: number) => {
    const filtered = profile.social_data.filter((_: any, i: number) => i !== index)
    setProfile({ ...profile, social_data: filtered })
  }

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...profile.social_data]
    updated[index][field] = value
    setProfile({ ...profile, social_data: updated })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id)
    if (!error) {
        setMsg(t.update_success)
        setTimeout(() => setMsg(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* TABS SELECTOR - 3 OPTIONS */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {[
          {id: 'profile', label: t.tab_profile},
          {id: 'social', label: t.tab_social},
          {id: 'account', label: t.tab_account}
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleUpdate} className="space-y-10">
        
        {/* --- ONGLET PROFIL --- */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl animate-in fade-in duration-500">
             <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><User className="text-indigo-600"/> {t.profile_sec}</h3>
             <div className="space-y-6">
                <Grid>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_fname}</label>
                        <input value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_lname}</label>
                        <input value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                    </div>
                </Grid>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_company}</label>
                    <input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                </div>
             </div>
          </div>
        )}

        {/* --- ONGLET SOCIAL (NOUVEAU) --- */}
        {activeTab === 'social' && (
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl animate-in slide-in-from-right-4 duration-500">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Share2 className="text-indigo-600" /> {t.social_sec}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">{t.social_sub}</p>
            </div>

            <div className="space-y-4 mb-8">
              {profile.social_data.map((item: any, index: number) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 items-center animate-in fade-in">
                  <select 
                    value={item.platform}
                    onChange={e => updateSocial(index, 'platform', e.target.value)}
                    className="w-full md:w-48 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm"
                  >
                    {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input 
                    placeholder="URL ou @username"
                    value={item.url}
                    onChange={e => updateSocial(index, 'url', e.target.value)}
                    className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-medium text-sm"
                  />
                  <button type="button" onClick={() => removeSocial(index)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button 
                type="button"
                onClick={addSocial}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> {t.btn_add_social}
              </button>
            </div>
          </div>
        )}

        {/* --- ONGLET COMPTE --- */}
        {activeTab === 'account' && (
           <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Mail className="text-indigo-600"/> Email</h3>
                  <input disabled value={user.email} className="w-full p-4 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold opacity-60 cursor-not-allowed" />
              </div>
              {/* ... reste de la zone de danger ... */}
           </div>
        )}

        {/* BOUTON DE SAUVEGARDE GLOBAL (S'affiche pour Profil et Social) */}
        {activeTab !== 'account' && (
          <div className="fixed bottom-20 left-0 right-0 p-4 md:relative md:bottom-0 md:p-0 z-30">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                {msg && <p className="mb-4 p-3 bg-green-50 text-green-600 rounded-2xl font-bold text-sm flex items-center gap-2 animate-bounce shadow-sm"><CheckCircle2 size={18}/> {msg}</p>}
                <button disabled={loading} className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : t.btn_save_profile}
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// Helper Grid simple
const Grid = ({children}: {children: any}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
)