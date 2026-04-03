'use client'
import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, MessageCircle, Phone, Send, 
  ArrowLeft, ShieldCheck, Palette, Printer 
} from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

// Imports de ton architecture réutilisable
import { MarketingPoster } from '@/components/MarketingPoster'
import { ICON_PATHS, getQrIcon } from '@/utils/qr-utils'
import { downloadPoster } from '@/utils/download-poster'

export default function WhatsAppForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const plaqueRef = useRef<HTMLDivElement>(null)
  
  // États de configuration
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  
  // États de Design (Indigo par défaut)
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')

  // Nettoyage du numéro et construction du lien WhatsApp
  const getWhatsAppLink = () => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return 'https://wa.me/'
    const encodedMsg = encodeURIComponent(message.trim())
    return `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`
  }

  // Validation
  const isValid = phone.trim().length >= 8;

  // Actions de téléchargement
  const handleDownloadQR = () => {
    const canvas = document.getElementById('wa-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `whatsapp-qr-retailbox.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleDownloadPlaque = () => {
    downloadPoster(plaqueRef, `plaque-whatsapp-${phone}`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {lang === 'fr' ? 'Retour aux outils' : 'Back to tools'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.wa_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.wa_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
              
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" /> {t.label_phone}
                </label>
                <input 
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.ph_phone}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white"
                />
                <p className="text-[10px] text-gray-400 text-center italic mt-2">
  {lang === 'fr' 
    ? "En générant ce code, vous certifiez être le propriétaire du numéro ou avoir l'autorisation de l'utiliser."
    : "By generating this code, you certify that you own this number or have permission to use it."}
</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" /> {t.label_wa_msg}
                </label>
                <textarea 
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.ph_wa_msg} rows={3}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 dark:text-white"
                />
              </div>

              {/* COULEURS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Palette size={16}/> Couleur QR</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Palette size={16}/> Fond</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-900 dark:text-green-200 font-medium italic leading-relaxed">{t.wa_tip}</p>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-12 shadow-[0_40px_80px_rgba(79,70,229,0.12)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center">
              
              <div className="p-8 bg-white rounded-[3rem] mb-10 shadow-inner border border-gray-50 relative group overflow-hidden">
                <QRCodeCanvas 
                  id="wa-qr-canvas" 
                  value={getWhatsAppLink()} 
                  size={240} 
                  level="H" 
                  fgColor={fgColor} 
                  bgColor={bgColor} 
                  marginSize={4} 
                  imageSettings={{ 
                    src: getQrIcon(ICON_PATHS.whatsapp, fgColor), 
                    height: 45, width: 45, excavate: true 
                  }} 
                />
              </div>
              
              <div className="space-y-4 w-full text-center">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{lang=="fr"?"Discussion Directe":"Direct Chat"}</h3>
                <p className="text-gray-400 font-bold text-sm mb-6">{phone || lang=="fr"?'Numéro requis ':'Number required'}</p>


                <button onClick={handleDownloadQR} disabled={!isValid} className={`w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 transition-all ${!isValid ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
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
        title={t.plaque_title}
        qrValue={getWhatsAppLink()}
        displayValue={phone}
        iconPath={ICON_PATHS.whatsapp}
        themeColor={fgColor}
        footerLabel={t.plaque_footer}
      />
    </div>
  )
}