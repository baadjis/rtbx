/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  User, Lock, Mail, Trash2, CheckCircle2, 
  Loader2, Briefcase, Globe, Smartphone, Linkedin,
  Share2, Plus, X, ShieldAlert, KeyRound
} from 'lucide-react'
import { Data } from './data'

const SOCIAL_OPTIONS = ["Instagram", "TikTok", "YouTube", "Threads", "Pinterest", "Twitch", "Facebook", "LinkedIn", "X (Twitter)", "Spotify", "Shopify", "WhatsApp", "Website"]

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'account'>('profile')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  
  // États des formulaires
  const [profile, setProfile] = useState<any>({
    first_name: '', last_name: '', company: '', job_title: '', 
    phone: '', website: '', linkedin_url: '', social_data: []
  })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile({ ...data, social_data: data.social_data || [] })
    }
    fetchProfile()
  }, [user.id, supabase])

  // --- ACTIONS ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg('')
    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id)
    if (!error) { setMsg(t.update_success); setTimeout(() => setMsg(''), 3000) }
    setLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setPassMsg('')
    if (password !== confirmPassword) { alert("Passwords do not match"); setLoading(false); return }
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) { setPassMsg(t.pass_success); setPassword(''); setConfirmPassword(''); setTimeout(() => setPassMsg(''), 3000) }
    else { alert(error.message) }
    setLoading(false)
  }

  const addSocial = () => setProfile({...profile, social_data: [...profile.social_data, { platform: 'Instagram', url: '' }]})
  const removeSocial = (i: number) => setProfile({...profile, social_data: profile.social_data.filter((_:any, index:number) => index !== i)})
  const updateSocial = (i: number, field: string, val: string) => {
    const next = [...profile.social_data]; next[i][field] = val; setProfile({...profile, social_data: next})
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* TABS */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {['profile', 'social', 'account'].map((tab: any) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            {/* @ts-ignore */}
            {t[`tab_${tab}`]}
          </button>
        ))}
      </div>

      {/* --- PROFIL TAB --- */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600"><User size={24}/></div>
            <div><h3 className="text-2xl font-black dark:text-white">{t.profile_sec}</h3><p className="text-sm text-gray-500">{t.profile_sub}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[ ['fn', 'first_name'], ['ln', 'last_name'], ['company', 'company'], ['job', 'job_title'], ['tel', 'phone'], ['web', 'website'] ].map(([key, field]) => (
              <div key={field} className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                {/* @ts-ignore */}
                { t[`label_${key}`]}
                
                </label>
                <input value={profile[field] || ''} onChange={e => setProfile({...profile, [field]: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
            ))}
          </div>
          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all">{loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_save_profile}</button>
          {msg && <p className="text-center text-green-500 font-bold animate-bounce">{msg}</p>}
        </form>
      )}

      {/* --- SOCIAL TAB --- */}
      {activeTab === 'social' && (
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 animate-in slide-in-from-right-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl text-purple-600"><Share2 size={24}/></div>
            <div><h3 className="text-2xl font-black dark:text-white">{t.social_sec}</h3><p className="text-sm text-gray-500">{t.social_sub}</p></div>
          </div>
          <div className="space-y-4">
            {profile.social_data.map((item:any, i:number) => (
              <div key={i} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 gap-4">
                <div className="flex justify-between">
                  <select value={item.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} className="bg-white dark:bg-slate-800 border-none rounded-xl font-black text-sm dark:text-white px-4">
                    {SOCIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <button type="button" onClick={() => removeSocial(i)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl"><Trash2 size={18}/></button>
                </div>
                <input placeholder={t.label_link} value={item.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl font-bold text-sm dark:text-white" />
              </div>
            ))}
            <button type="button" onClick={addSocial} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"><Plus size={20}/> {t.btn_add_social}</button>
          </div>
          <button onClick={handleSaveProfile} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700">{t.btn_save_profile}</button>
        </div>
      )}

      {/* --- ACCOUNT TAB (MODIFICATION MOT DE PASSE ICI) --- */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-in slide-in-from-right-8">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl">
            <h3 className="text-xl font-black dark:text-white mb-6 flex items-center gap-3"><Mail className="text-indigo-600"/> Email</h3>
            <input disabled value={user.email} className="w-full p-4 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold opacity-60 dark:text-white" />
          </div>

          <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-xl font-black dark:text-white mb-4 flex items-center gap-3"><KeyRound className="text-indigo-600"/> {t.connexion_sec}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="password" placeholder={t.label_new_pass} value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                <input type="password" placeholder={t.label_confirm_pass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_pass}
            </button>
            {passMsg && <p className="text-center text-green-500 font-bold">{passMsg}</p>}
          </form>

          <div className="p-8 md:p-12 rounded-[3rem] border-2 border-red-100 bg-red-50/10 space-y-6">
            <h3 className="text-xl font-black text-red-600 flex items-center gap-3"><ShieldAlert/> {t.danger_zone}</h3>
            <p className="text-red-700/70 text-sm font-medium leading-relaxed">{t.delete_warn}</p>
            <button type="button" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-xl transition-all">
                {t.delete_account}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}