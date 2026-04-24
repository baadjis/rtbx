/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Plus, Trash2, ArrowLeft, 
  ShieldCheck, Users, Settings2, Link2,
  Upload, X, Palette, Loader2, CheckCircle2, ArrowRight, Info
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Data } from './data'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'
import { SOCIAL_CONFIG, formatSocialUrl } from '@/utils/social-config'

export default function DigitalIDForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState([{ network: 'Instagram', handle: '' }])
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('social_data').eq('id', user.id).single()
        if (profile?.social_data && Array.isArray(profile.social_data)) {
            setLinks(profile.social_data)
        }
      }
    }
    checkUser()
  }, [supabase])

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    let cleanValue = value
    
    // Contrôle de saisie : si l'utilisateur met un @ au début, on le retire pour les handles
    if (field === 'handle' && value.startsWith('@')) {
        cleanValue = value.substring(1)
    }

    // @ts-ignore
    newLinks[index][field] = cleanValue
    setLinks(newLinks)
  }

  const getQRValue = () => {
    if (user) return `https://www.rtbx.space/@/${user.id}`
    
    // Mode Anonyme : on génère une liste d'URLs réelles pour que le scan soit utile
    const content = links
      .filter(l => l.handle.trim() !== '')
      .map(l => formatSocialUrl(l.network, l.handle))
      .join('\n')
    return content || 'RetailBox Identity'
  }

  const handleSaveAndSync = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await supabase.from('profiles').update({ social_data: links }).eq('id', user.id)
    if (!error) alert(lang === 'fr' ? "Identité synchronisée !" : "Identity synced!")
    setLoading(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 no-underline">
          <ArrowLeft size={18} /> {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.did_title}
            </h1>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Settings2 size={14} /> {t.configurate || "Configuration"}
                </label>
                
                {links.map((link, index) => (
                  <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3">
                      <select 
                        value={link.network} 
                        onChange={(e) => updateLink(index, 'network', e.target.value)} 
                        className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white"
                      >
                        {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                      </select>
                      <button onClick={() => setLinks(links.filter((_, i) => i !== index))} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border-none cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                placeholder={SOCIAL_CONFIG[link.network]?.baseUrl ? (lang === 'fr' ? "Identifiant / Nom d'utilisateur" : "Username / Handle") : "https://..."}
                                value={link.handle} 
                                onChange={(e) => updateLink(index, 'handle', e.target.value)} 
                                className="w-full p-3 pl-10 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm dark:text-white shadow-sm" 
                            />
                        </div>
                        {SOCIAL_CONFIG[link.network]?.baseUrl && (
                            <p className="text-[10px] text-gray-400 font-medium ml-2 italic">
                                {lang === 'fr' ? 'Sera lié à : ' : 'Will link to: '} {SOCIAL_CONFIG[link.network].baseUrl}
                            </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setLinks([...links, { network: 'Instagram', handle: '' }])} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                <Plus size={18} /> {t.btn_add_net}
              </button>

              {user && (
                <button onClick={handleSaveAndSync} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} {lang === 'fr' ? "Mettre à jour mon Space" : "Update my Space"}
                </button>
              )}
            </div>

            {/* OPTIONS DE DESIGN */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_qr}</label>
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none p-1 bg-gray-50 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_bg}</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none p-1 bg-gray-50 dark:bg-slate-800" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex justify-between">
                        {t.label_logo}
                        {logo && <button onClick={() => setLogo(null)} className="text-red-500 flex items-center gap-1 text-[10px] hover:underline bg-transparent border-none cursor-pointer">Supprimer</button>}
                    </label>
                    <div className="relative group">
                        <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 group-hover:border-indigo-400 transition-colors">
                            <Upload size={18} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">{logo ? "Changer le logo" : "Ajouter un logo"}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center">
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="did-qr-canvas" value={getQRValue()} size={260} level="H" marginSize={4} fgColor={fgColor} bgColor={bgColor}
                  imageSettings={logo ? { src: logo, height: 50, width: 50, excavate: true } : undefined}
                />
                {!logo && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {user ? 'SPACE PRO' : 'GUEST CARD'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-xs mb-10 tracking-[0.2em] uppercase">
                  {user ? 'Lien confidentiel actif' : 'Mode texte brut'}
              </p>
              
              <div className="space-y-3 w-full">
                <button onClick={downloadQR} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer">
                    <Download size={20} /> {t.btn_dl_did}
                </button>
                
                {user && (
                    <Link href={`/space/${user.id}`} target="_blank" className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black border border-indigo-100 dark:border-indigo-900 no-underline flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                        {lang === 'fr' ? "Voir mon Space" : "View my Space"} <ArrowRight size={18} />
                    </Link>
                )}
              </div>

              {!user && (
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-3 text-left">
                    <Info size={18} className="text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                        {lang === 'fr' 
                          ? "Inscrivez-vous pour transformer ce QR en une page web splendide et protéger vos données (numéros cachés)."
                          : "Sign up to transform this QR into a beautiful landing page and protect your data (hidden numbers)."}
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}