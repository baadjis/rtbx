/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  User, Lock, Mail, Trash2, CheckCircle2, 
  Loader2, Briefcase, Globe, Smartphone, Linkedin,
  Share2, Plus, X, ShieldAlert, ChevronRight,
  Zap
} from 'lucide-react'
import { Data } from './data'

const SOCIAL_OPTIONS = [
  "Instagram", "TikTok", "YouTube", "Threads", "Pinterest", 
  "Twitch", "Facebook", "LinkedIn", "X (Twitter)", 
  "Spotify", "Shopify", "WhatsApp", "Website"
]

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'account'>('profile')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  // État local du profil synchronisé avec Supabase
  const [profile, setProfile] = useState<any>({
    first_name: '',
    last_name: '',
    company: '',
    job_title: '',
    phone: '',
    website: '',
    linkedin_url: '',
    social_data: [] // Array d'objets {platform, url}
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Charger les données depuis la table 'profiles'
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setProfile({
          ...data,
          social_data: data.social_data || []
        })
      }
    }
    fetchProfile()
  }, [user.id, supabase])

  // --- LOGIQUE DES RÉSEAUX SOCIAUX ---
  const addSocialRow = () => {
    setProfile({
      ...profile,
      social_data: [...profile.social_data, { platform: 'Instagram', url: '' }]
    })
  }

  const removeSocialRow = (index: number) => {
    const newData = profile.social_data.filter((_: any, i: number) => i !== index)
    setProfile({ ...profile, social_data: newData })
  }

  const updateSocialRow = (index: number, field: string, value: string) => {
    const newData = [...profile.social_data]
    newData[index][field] = value
    setProfile({ ...profile, social_data: newData })
  }

  // --- SAUVEGARDE GLOBALE (Profil + Social) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        company: profile.company,
        job_title: profile.job_title,
        phone: profile.phone,
        website: profile.website,
        linkedin_url: profile.linkedin_url,
        social_data: profile.social_data,
        updated_at: new Date()
      })
      .eq('id', user.id)

    if (!error) {
      setMsg(t.update_success)
      setTimeout(() => setMsg(''), 3000)
    } else {
      alert("Erreur lors de la sauvegarde")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* --- NOUVEAU TABS SELECTOR (STYLE CAPSULE) --- */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: t.tab_profile, icon: User },
          { id: 'social', label: t.tab_social, icon: Share2 },
          { id: 'account', label: t.tab_account, icon: Lock },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* --- ONGLET 1 : PROFIL PUBLIC (VCARD) --- */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl animate-in fade-in duration-500">
            <div className="mb-10 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t.profile_sec}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{t.profile_sub}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_fname}</label>
                    <input value={profile.first_name || ''} onChange={e => setProfile({...profile, first_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_lname}</label>
                    <input value={profile.last_name || ''} onChange={e => setProfile({...profile, last_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_company}</label>
                    <input value={profile.company || ''} onChange={e => setProfile({...profile, company: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_job}</label>
                    <input value={profile.job_title || ''} onChange={e => setProfile({...profile, job_title: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_phone}</label>
                    <input value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_web}</label>
                    <input value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            <div className="mt-6 space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_linkedin}</label>
                <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input value={profile.linkedin_url || ''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 2 : RÉSEAUX SOCIAUX (IDENTITY CARD) --- */}
        {activeTab === 'social' && (
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl animate-in slide-in-from-right-8 duration-500">
            <div className="mb-10 flex items-center gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
                    <Share2 size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t.social_sec}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{t.social_sub}</p>
                </div>
            </div>

            <div className="space-y-4">
                {profile.social_data.map((item: any, index: number) => (
                    <div key={index} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 gap-4 transition-all animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center gap-4">
                            <select 
                                value={item.platform}
                                onChange={e => updateSocialRow(index, 'platform', e.target.value)}
                                className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-black text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                            >
                                {SOCIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => removeSocialRow(index)}
                                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border-none"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                placeholder={t.label_link}
                                value={item.url}
                                onChange={e => updateSocialRow(index, 'url', e.target.value)}
                                className="w-full p-4 pl-12 bg-white dark:bg-slate-800 border-none rounded-2xl font-bold text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={addSocialRow}
                    className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent"
                >
                    <Plus size={20} /> {t.btn_add_social}
                </button>
            </div>
          </div>
        )}

        {/* --- ONGLET 3 : COMPTE & SÉCURITÉ --- */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            {/* Email Section */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Mail className="text-indigo-600" /> {t.label_email}
                </h3>
                <input disabled value={user.email} className="w-full p-4 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold opacity-60 cursor-not-allowed dark:text-white" />
                <p className="mt-4 text-xs text-gray-400 italic">L&apos;adresse email est gérée par votre compte Google ou Supabase Auth.</p>
            </div>

            {/* Danger Zone */}
            <div className="p-8 md:p-12 rounded-[3rem] border-2 border-red-100 dark:border-red-900/30 bg-red-50/10 dark:bg-red-900/5">
                <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-4 flex items-center gap-3">
                    <ShieldAlert /> {t.danger_zone}
                </h3>
                <p className="text-red-700/70 dark:text-red-400/70 text-sm font-medium mb-8 leading-relaxed max-w-xl">
                    {t.delete_warn}
                </p>
                <button type="button" className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none transition-all active:scale-95 border-none">
                    {t.delete_account}
                </button>
            </div>
          </div>
        )}

        {/* --- BOUTON DE SAUVEGARDE FIXE (POUR PROFIL ET SOCIAL) --- */}
        {activeTab !== 'account' && (
          <div className="flex flex-col items-center pt-10">
            {msg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100 animate-bounce flex items-center gap-2">
                    <CheckCircle2 size={20} /> {msg}
                </div>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 border-none cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
              {t.btn_save_profile}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}