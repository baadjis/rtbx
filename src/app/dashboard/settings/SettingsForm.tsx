/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  User, Lock, Mail, Trash2, CheckCircle2, 
  Loader2, Briefcase, Globe, Smartphone, Linkedin,
  Share2, Plus, X, ShieldAlert, KeyRound, ArrowRight
} from 'lucide-react'
import { Data } from './data'
import { SOCIAL_CONFIG } from '@/utils/social-config'

export default function SettingsForm({ lang, user }: { lang: 'fr' | 'en', user: any }) {
  const t = Data[lang]
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'account'>('profile')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  
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
  const handleSaveAll = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault()
    setLoading(true); setMsg('')
    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id)
    if (!error) { 
      setMsg(t.update_success)
      setTimeout(() => setMsg(''), 3000) 
    }
    setLoading(false)
  }

  const handleChangePassword = async (e: any) => {
    e.preventDefault(); setLoading(true); setPassMsg('')
    if (password !== confirmPassword) { alert("Passwords do not match"); setLoading(false); return }
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) { 
      setPassMsg(t.pass_success)
      setPassword(''); setConfirmPassword('')
      setTimeout(() => setPassMsg(''), 3000) 
    } else { 
      alert(error.message) 
    }
    setLoading(false)
  }

  // --- LOGIQUE SOCIALE ---
  const addSocial = () => {
    setProfile({
      ...profile, 
      social_data: [...profile.social_data, { network: 'Instagram', handle: '' }]
    })
  }

  const removeSocial = (i: number) => {
    const next = profile.social_data.filter((_:any, idx:number) => idx !== i)
    setProfile({...profile, social_data: next})
  }

  const updateSocial = (i: number, field: string, val: string) => {
    const next = [...profile.social_data]
    next[i][field] = val
    setProfile({...profile, social_data: next})
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      {/* TABS SELECTOR */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-[2rem] w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {['profile', 'social', 'account'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)} 
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-none cursor-pointer ${
              activeTab === tab 
              ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {/* @ts-ignore */}
            {t[`tab_${tab}`]}
          </button>
        ))}
      </div>

      {/* --- TAB 1 : PROFIL PUBLIC (VCARD DATA) --- */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveAll} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400"><User size={24}/></div>
            <div>
                <h3 className="text-2xl font-black dark:text-white leading-none">{t.profile_sec}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">{t.profile_sub}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[ 
              {id: 'fname', f: 'first_name', icon: User}, 
              {id: 'lname', f: 'last_name', icon: User}, 
              {id: 'company', f: 'company', icon: Briefcase}, 
              {id: 'job', f: 'job_title', icon: ArrowRight}, 
              {id: 'phone', f: 'phone', icon: Smartphone}, 
              {id: 'web', f: 'website', icon: Globe} 
            ].map((field) => (
              <div key={field.f} className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <field.icon size={12} /> {
                    /* @ts-ignore */
                     t[`label_${field.id}`]
                    }
                </label>
                <input 
                  value={profile[field.f] || ''} 
                  onChange={e => setProfile({...profile, [field.f]: e.target.value})} 
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Linkedin size={12} /> {t.label_linkedin}
            </label>
            <input 
                value={profile.linkedin_url || ''} 
                onChange={e => setProfile({...profile, linkedin_url: e.target.value})} 
                placeholder="linkedin.com/in/username"
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all" 
            />
          </div>

          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_save_profile}
          </button>
          {msg && <p className="text-center text-green-500 font-bold animate-bounce">{msg}</p>}
        </form>
      )}

      {/* --- TAB 2 : SOCIAL MEDIA (IDENTITY DATA) --- */}
      {activeTab === 'social' && (
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400"><Share2 size={24}/></div>
            <div>
                <h3 className="text-2xl font-black dark:text-white leading-none">{t.social_sec}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">{t.social_sub}</p>
            </div>
          </div>

          <div className="space-y-4">
            {profile.social_data.map((item:any, i:number) => {
              const config = SOCIAL_CONFIG[item.network] || { baseUrl: '' };
              return (
                <div key={i} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 gap-4 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <select 
                        value={item.network} 
                        onChange={e => updateSocial(i, 'network', e.target.value)} 
                        className="bg-white dark:bg-slate-800 border-none rounded-xl font-black text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-4 py-2 cursor-pointer shadow-sm"
                    >
                      {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                    </select>
                    <button type="button" onClick={() => removeSocial(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border-none bg-transparent transition-all"><Trash2 size={20}/></button>
                  </div>
                  
                  <div className="relative flex items-center">
                    {config.baseUrl && (
                        <span className="absolute left-4 text-[10px] font-black text-gray-400 dark:text-gray-500 pointer-events-none truncate max-w-[120px]">
                            {config.baseUrl.replace('https://', '')}
                        </span>
                    )}
                    <input 
                        placeholder={t.label_link} 
                        value={item.handle} 
                        onChange={e => updateSocial(i, 'handle', e.target.value)} 
                        className={`w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl font-bold text-sm dark:text-white transition-all ${config.baseUrl ? 'pl-28 md:pl-36' : 'pl-4'}`} 
                    />
                  </div>
                </div>
              )
            })}
            
            <button type="button" onClick={addSocial} className="w-full py-5 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                <Plus size={20}/> {t.btn_add_social}
            </button>
          </div>
          
          <button onClick={() => handleSaveAll()} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 border-none cursor-pointer">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_save_profile}
          </button>
        </div>
      )}

      {/* --- TAB 3 : COMPTE & MOT DE PASSE --- */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black dark:text-white mb-6 flex items-center gap-3"><Mail className="text-indigo-600" size={20}/> Email</h3>
            <input disabled value={user.email} className="w-full p-4 bg-gray-100 dark:bg-slate-800 border-none rounded-2xl font-bold opacity-60 dark:text-white cursor-not-allowed" />
          </div>

          <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-xl font-black dark:text-white mb-4 flex items-center gap-3"><KeyRound className="text-indigo-600" size={20}/> {t.connexion_sec}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="password" placeholder={t.label_new_pass} value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                <input type="password" placeholder={t.label_confirm_pass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all border-none cursor-pointer shadow-sm">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_pass}
            </button>
            {passMsg && <p className="text-center text-green-500 font-bold">{passMsg}</p>}
          </form>

          <div className="p-8 md:p-12 rounded-[3rem] border-2 border-red-100 dark:border-red-900/30 bg-red-50/5 dark:bg-red-950/20 space-y-6">
            <h3 className="text-xl font-black text-red-600 dark:text-red-400 flex items-center gap-3"><ShieldAlert size={20}/> {t.danger_zone}</h3>
            <p className="text-red-700/70 dark:text-red-400/70 text-sm font-medium leading-relaxed">{t.delete_warn}</p>
            <button type="button" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-xl transition-all border-none cursor-pointer active:scale-95">
                {t.delete_account}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}