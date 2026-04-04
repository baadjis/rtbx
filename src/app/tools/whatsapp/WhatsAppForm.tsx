'use client'
import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, MessageCircle, Phone, Send, 
  ArrowLeft, ShieldCheck, Palette, Printer,
  Megaphone, Info, Upload, X, Store
} from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

import { MarketingPoster } from '@/components/MarketingPoster'
import { ICON_PATHS, getQrIcon } from '@/utils/qr-utils'
import { downloadPoster } from '@/utils/download-poster'

export default function WhatsAppForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const plaqueRef = useRef<HTMLDivElement>(null)
  
  // --- ÉTATS ---
  const [mode, setMode] = useState<'direct' | 'channel'>('direct')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [channelUrl, setChannelUrl] = useState('')
  const [bizName, setBizName] = useState('') // Nouveau
  const [logo, setLogo] = useState<string | null>(null) // Nouveau
  
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')

  // --- LOGIQUE LOGO ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const getFinalLink = () => {
    if (mode === 'channel') return channelUrl.trim() || 'https://whatsapp.com/channel/'
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return 'https://wa.me/'
    const encodedMsg = encodeURIComponent(message.trim())
    return `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`
  }

  const isValid = mode === 'direct' ? phone.trim().length >= 8 : channelUrl.includes('whatsapp.com/channel/');

  // --- ACTIONS ---
  const handleDownloadQR = () => {
    const canvas = document.getElementById('wa-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `whatsapp-${mode}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleDownloadPlaque = () => {
    downloadPoster(plaqueRef, `poster-whatsapp-${mode}`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight leading-tight">
                {t.wa_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.wa_sub}</p>
            </div>

            {/* SÉLECTEUR DE MODE */}
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800">
                <button onClick={() => setMode('direct')} className={`flex items-center justify-center gap-2 py-4 rounded-[1.6rem] font-bold text-sm transition-all ${mode === 'direct' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' : 'text-gray-400 opacity-60'}`}><MessageCircle size={18} /> {t.mode_direct}</button>
                <button onClick={() => setMode('channel')} className={`flex items-center justify-center gap-2 py-4 rounded-[1.6rem] font-bold text-sm transition-all ${mode === 'channel' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' : 'text-gray-400 opacity-60'}`}><Megaphone size={18} /> {t.mode_channel}</button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
              
              {/* BRANDING : NOM & LOGO (Nouveau) */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"><Store size={16}/> {t.label_biz_name}</label>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder={t.ph_biz_name} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex justify-between">
                    {t.label_logo}
                    {logo && <button onClick={() => setLogo(null)} className="text-red-500 flex items-center gap-1 text-[10px] font-bold hover:underline border-none bg-transparent cursor-pointer"><X size={12}/> {lang === 'fr' ? 'Supprimer' : 'Remove'}</button>}
                  </label>
                  <div className="relative group">
                    <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 group-hover:border-indigo-400 transition-colors">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-500 dark:text-slate-400 italic">{logo ? (lang === 'fr' ? "Changer de logo" : "Change logo") : t.ph_logo}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-50 dark:bg-slate-800" />

              {/* CHAMPS TECHNIQUES */}
              {mode === 'direct' ? (
                <div className="space-y-6 animate-in slide-in-from-left-4">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"><Phone size={16} /> {t.label_phone}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.ph_phone} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"><Send size={16} /> {t.label_wa_msg}</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.ph_wa_msg} rows={2} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-right-4">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"><Megaphone size={16} /> {t.label_channel_url}</label>
                  <input type="url" value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder={t.ph_channel_url} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
                </div>
              )}

              {/* COULEURS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Couleur QR</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Fond</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-8 shadow-[0_40px_80px_rgba(79,70,229,0.12)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center">
              
              <div className="p-6 bg-white rounded-[3rem] mb-10 shadow-inner border border-gray-50 relative group overflow-hidden">
                <QRCodeCanvas 
                  id="wa-qr-canvas" value={getFinalLink()} size={240} level="H" fgColor={fgColor} bgColor={bgColor} marginSize={4} 
                  imageSettings={{ src: getQrIcon(mode === 'direct' ? ICON_PATHS.whatsapp : ICON_PATHS.megaphone, fgColor), height: 45, width: 45, excavate: true }} 
                />
              </div>
              
              <div className="space-y-4 w-full text-center">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {mode === 'direct' ? (lang === 'fr' ? 'Contact Direct' : 'Direct Contact') : (lang === 'fr' ? 'Rejoindre Chaîne' : 'Join Channel')}
                </h3>
                <p className="text-gray-400 font-bold text-xs mb-6 truncate max-w-xs mx-auto italic uppercase tracking-[0.2em]">
                    {mode === 'direct' ? (phone || t.no_number) : (channelUrl ? 'Channel Link Ready' : t.no_number)}
                </p>

                <button onClick={handleDownloadQR} disabled={!isValid} className={`w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 transition-all ${!isValid ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'}`}>
                  <Download size={20} /> {t.btn_dl_wa}
                </button>

                <button onClick={handleDownloadPlaque} disabled={!isValid} className={`w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer ${!isValid ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <Printer size={20} /> {t.btn_dl_plaque}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSANT CACHÉ POUR LE RENDU DU POSTER */}
      <MarketingPoster 
        innerRef={plaqueRef}
        title={mode === 'direct' ? t.plaque_title : t.plaque_title_channel}
        subtitle={mode === 'direct' ? "WhatsApp Direct" : "WhatsApp Channel"}
        qrValue={getFinalLink()}
        displayValue={mode === 'direct' ? phone : "COMMUNAUTÉ"}
        iconPath={mode === 'direct' ? ICON_PATHS.whatsapp : ICON_PATHS.megaphone}
        themeColor={fgColor}
        footerLabel={mode === 'direct' ? t.plaque_footer : t.plaque_footer_channel}
        userLogo={logo} // Passer le logo uploadé
        businessName={bizName} // Passer le nom du business
      />
    </div>
  )
}