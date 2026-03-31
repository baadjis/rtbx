/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  User, Lock, Mail, Trash2, CheckCircle2, 
  Loader2, Briefcase, Globe, Phone, Linkedin, 
  ShieldCheck, Smartphone
} from 'lucide-react'
import { Data } from './data'

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  // État du profil (Table profiles)
  const [profile, setProfile] = useState({
    first_name: '', last_name: '', company: '', 
    job_title: '', phone: '', website: '', linkedin_url: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Charger les données du profil au montage
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
    }
    fetchProfile()
  }, [user.id, supabase])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    // On met à jour la table 'profiles'
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)

    if (!error) {
        setMsg(t.update_success)
        setTimeout(() => setMsg(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* SWITCHER DE TABS DYNAMIQUE */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit mx-auto border border-gray-200 dark:border-slate-700">
        <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
            {t.tab_profile}
        </button>
        <button 
            onClick={() => setActiveTab('account')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'account' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
            {t.tab_account}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-all">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <User className="text-indigo-600" /> {t.profile_sec}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">{t.profile_sub}</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_fname}</label>
                <input value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_lname}</label>
                <input value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_company}</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_job}</label>
                <input value={profile.job_title} onChange={e => setProfile({...profile, job_title: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_phone}</label>
                <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_web}</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_linkedin}</label>
                <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input value={profile.linkedin_url} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                </div>
            </div>

            {msg && <p className="text-green-500 font-bold text-sm flex items-center gap-2 animate-bounce"><CheckCircle2 size={18}/> {msg}</p>}

            <button disabled={loading} className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : t.btn_save_profile}
            </button>
          </form>
        </div>
      ) : (
        /* --- SECTION COMPTE --- */
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Mail className="text-indigo-600" /> Email du compte
                </h3>
                <div className="relative opacity-60">
                    <input disabled value={user.email} className="w-full p-4 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold cursor-not-allowed dark:text-white" />
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">L&apos;adresse email ne peut pas être modifiée pour des raisons de sécurité.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Lock className="text-indigo-600" /> Sécurité
                </h3>
                <button className="px-8 py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                    {t.btn_pass}
                </button>
            </div>

            <div className="p-8 md:p-12 rounded-[3rem] border-2 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-4 flex items-center gap-3">
                    <Trash2 /> {t.danger_zone}
                </h3>
                <p className="text-red-700/70 dark:text-red-400/70 text-sm font-medium mb-8 leading-relaxed max-w-xl">
                    {t.delete_warn}
                </p>
                <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none transition-all active:scale-95">
                    {t.delete_account}
                </button>
            </div>
        </div>
      )}
    </div>
  )
}