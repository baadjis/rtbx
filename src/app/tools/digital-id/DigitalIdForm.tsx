/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Plus, Trash2, ArrowLeft, 
  ShieldCheck, Users, Settings2, Link2,
  Loader2, CheckCircle2, Globe,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Data } from './data'
import { SOCIAL_CONFIG, formatSocialUrl } from '@/utils/social-config'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'

export default function DigitalIDForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  
  // État initial avec un premier champ vide
  const [links, setLinks] = useState<any[]>([{ network: 'Instagram', handle: '' }])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Charger l'utilisateur et ses données existantes
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from('profiles').select('social_data').eq('id', user.id).single()
        if (profile?.social_data && Array.isArray(profile.social_data) && profile.social_data.length > 0) {
          setLinks(profile.social_data)
        }
      }
      setLoading(false)
    }
    init()
  }, [supabase])

  // 2. Mise à jour d'un lien avec contrôle de saisie (@)
  const updateLink = (index: number, field: 'network' | 'handle', value: string) => {
    const newLinks = [...links]
    let cleanValue = value
    
    if (field === 'handle' && value.startsWith('@')) {
      cleanValue = value.substring(1)
    }

    newLinks[index][field] = cleanValue
    setLinks(newLinks)
  }

  const addLink = () => {
    const used = links.map(l => l.network)
    const available = Object.keys(SOCIAL_CONFIG).find(opt => !used.includes(opt))
    setLinks([...links, { network: available || 'Website', handle: '' }])
  }

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks.length > 0 ? newLinks : [{ network: 'Instagram', handle: '' }])
  }

  // 3. Construction de la valeur du QR Code (Calculé à chaque changement de 'links' ou 'user')
  const qrValue = useMemo(() => {
    if (user) {
      return `https://www.rtbx.space/space/${user.id}`
    }
    
    const validLinks = links.filter(l => l.handle && l.handle.trim() !== '')
    if (validLinks.length === 0) return 'RetailBox Digital Identity'

    return validLinks
      .map(l => `${l.network}: ${formatSocialUrl(l.network, l.handle)}`)
      .join('\n')
  }, [links, user])

  const handleSave = async () => {
    if (!user) return
    setSaveLoading(true)
    const { error } = await supabase.from('profiles').update({ social_data: links }).eq('id', user.id)
    if (!error) alert(lang === 'fr' ? "Profil mis à jour !" : "Profile updated!")
    setSaveLoading(false)
  }

  const downloadQR = () => {
    const canvas = document.getElementById('did-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `retailbox-identity.png`
    link.href = url
    link.click()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 no-underline transition-colors border-none">
          <ArrowLeft size={18} /> {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight leading-tight">
                {t.did_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.did_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
              
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Settings2 size={16} className="text-indigo-600" /> {lang === 'fr' ? 'Mes Réseaux' : 'My Networks'}
                </label>
                
                {links.map((link, index) => (
                  <div key={index} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3">
                      <select 
                        value={link.network}
                        onChange={(e) => updateLink(index, 'network', e.target.value)}
                        className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm text-gray-900 dark:text-white appearance-none shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {Object.keys(SOCIAL_CONFIG).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeLink(index)}
                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border-none cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        placeholder={t.ph_handle}
                        value={link.handle}
                        onChange={(e) => updateLink(index, 'handle', e.target.value)}
                        className="w-full p-4 pl-12 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white shadow-sm transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addLink}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer"
              >
                <Plus size={18} /> {t.btn_add_net}
              </button>

              {user && (
                <button 
                  onClick={handleSave} 
                  disabled={saveLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 border-none cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {saveLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {lang === 'fr' ? 'Sauvegarder mon Space' : 'Save my Space'}
                </button>
              )}
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center">
              
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="did-qr-canvas"
                  value={qrValue} 
                  size={260} 
                  level="H" 
                  marginSize={4} // Correction : Utilisation de marginSize
                  imageSettings={{
                    src: getQrIcon(ICON_PATHS.users, '#4f46e5'),
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {user ? 'SPACE PRO' : 'GUEST CARD'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-xs mb-10 tracking-[0.2em] uppercase">
                  {user ? (lang === 'fr' ? 'Lien de profil actif' : 'Profile link active') : (lang === 'fr' ? 'Mode texte brut' : 'Plain text mode')}
              </p>
              
              <button 
                  onClick={downloadQR}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer"
              >
                <Download className="w-6 h-6" /> {t.btn_dl_did}
              </button>

              {!user && (
                <Link href="/register" className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-3 no-underline group hover:bg-indigo-100 transition-all">
                   <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <Zap size={18} className="text-indigo-600 dark:text-indigo-400 fill-current" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Option Pro</p>
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100">{lang === 'fr' ? "Activez votre page de profil splendide" : "Activate your splendid profile page"}</p>
                   </div>
                </Link>
              )}
            </div>
            
            <div className="mt-8 flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed text-left italic">
                  {t.did_tip}
                </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}