/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useMemo } from 'react'
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
  const [links, setLinks] = useState<any[]>([{ network: 'Instagram', handle: '' }])
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
        if (profile?.social_data && Array.isArray(profile.social_data) && profile.social_data.length > 0) {
            setLinks(profile.social_data)
        }
      }
    }
    checkUser()
  }, [supabase])

  // --- FONCTION DE MISE À JOUR SIMPLIFIÉE (SANS NETTOYAGE IMMÉDIAT) ---
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  // --- GÉNÉRATION DU TEXTE DU QR CODE ---
  const qrValue = useMemo(() => {
    if (user) return `https://www.rtbx.space/@/${user.id}`;
    
    const validLinks = links.filter(l => l.handle && l.handle.trim() !== '');
    if (validLinks.length === 0) return 'RetailBox Digital Identity';

    const header = lang === 'fr' ? "MES RÉSEAUX :\n" : "MY SOCIALS:\n";
    const content = validLinks
      .map(l => `${l.network}: ${formatSocialUrl(l.network, l.handle)}`)
      .join('\r\n');

    return `${header}${content}`;
  }, [links, user, lang]);

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
    const link = document.createElement('a')
    link.download = `retailbox-identity.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 no-underline">
          <ArrowLeft size={18} /> {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-tight">
              {t.did_title}
            </h1>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6">
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 gap-4">
                    <div className="flex gap-3">
                      <select 
                        value={link.network} 
                        onChange={(e) => updateLink(index, 'network', e.target.value)} 
                        className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm text-gray-900 dark:text-white shadow-sm outline-none"
                      >
                        {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                      </select>
                      <button onClick={() => setLinks(links.filter((_, i) => i !== index))} className="p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border-none transition-all cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="relative">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            placeholder={SOCIAL_CONFIG[link.network]?.ph || t.ph_handle}
                            value={link.handle} 
                            onChange={(e) => updateLink(index, 'handle', e.target.value)} 
                            className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white shadow-sm" 
                        />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setLinks([...links, { network: 'Instagram', handle: '' }])} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                <Plus size={18} /> {t.btn_add_net}
              </button>
            </div>

            {/* COULEURS ET LOGO */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">QR Color</label>
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Background</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none bg-gray-50" />
                    </div>
                </div>
                <div className="relative group">
                    <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-500">{logo ? "Logo OK" : t.label_logo}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center">
              <div className="p-6 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner overflow-hidden">
                <QRCodeCanvas 
                  id="did-qr-canvas" value={qrValue} size={250} level="H" marginSize={4} fgColor={fgColor} bgColor={bgColor}
                  imageSettings={logo ? { src: logo, height: 50, width: 50, excavate: true } : undefined}
                />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">{user ? 'SPACE PRO' : 'GUEST CARD'}</h3>
              <p className="text-gray-400 text-xs font-bold mb-10 tracking-[0.2em]">{links.filter(l => l.handle).length} LINK(S)</p>
              <button onClick={downloadQR} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer">
                  <Download className="w-6 h-6" /> {t.btn_dl_did}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}