'use client'
import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Wifi, Lock, ShieldCheck, 
  ArrowLeft, Settings2, Eye, EyeOff, 
  Palette, Printer 
} from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

// Import des utilitaires et composants réutilisables
import { MarketingPoster } from '@/components/MarketingPoster'
import { ICON_PATHS, getQrIcon } from '@/utils/qr-utils'
import { downloadPoster } from '@/utils/download-poster'

export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const plaqueRef = useRef<HTMLDivElement>(null)
  
  // États de configuration
  const [ssid, setSsid] = useState('WiFi_Boutique')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')
  const [showPassword, setShowPassword] = useState(false)
  
  // États de Design
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')

  // Données Wi-Fi formatées
  const getWifiData = () => {
    const enc = encryption === 'nopass' ? '' : encryption
    return `WIFI:T:${enc};S:${ssid};P:${password};;`
  }

  // Validation des champs
  const isValid = ssid.trim() !== '' && (encryption === 'nopass' || password.trim() !== '');

  // Action : Télécharger le QR seul
  const handleDownloadQR = () => {
    const canvas = document.getElementById('wifi-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-wifi-${ssid.replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Action : Télécharger le Poster Pro (via utilitaire réutilisable)
  const handleDownloadPlaque = () => {
    downloadPoster(plaqueRef, `plaque-wifi-${ssid.replace(/\s+/g, '_')}`)
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
                {t.wifi_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.wifi_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
              
              {/* SSID */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-indigo-600" /> {t.label_ssid}
                </label>
                <input 
                  type="text" value={ssid} onChange={(e) => setSsid(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white"
                />
              </div>

              {/* PASSWORD & ENCRYPTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" /> {t.label_password}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={encryption === 'nopass'}
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white disabled:opacity-30"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent border-none p-0 cursor-pointer">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-600" /> {t.label_encryption}
                  </label>
                  <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white appearance-none">
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{lang === 'fr' ? 'Ouvert' : 'Open'}</option>
                  </select>
                </div>
              </div>

              {/* COULEURS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2"><Palette size={16}/> Couleur QR</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2"><Palette size={16}/> Fond</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">{t.wifi_tip}</p>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-12 shadow-[0_40px_80px_rgba(79,70,229,0.12)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center">
              
              <div className="p-8 bg-white rounded-[3rem] mb-10 shadow-inner border border-gray-50 relative overflow-hidden">
                <QRCodeCanvas 
                  id="wifi-qr-canvas" 
                  value={getWifiData()} 
                  size={240} 
                  level="H" 
                  fgColor={fgColor} 
                  bgColor={bgColor} 
                  marginSize={4} 
                  imageSettings={{ 
                    src: getQrIcon(ICON_PATHS.wifi, fgColor), 
                    height: 45, width: 45, excavate: true 
                  }} 
                />
              </div>
              
              <div className="space-y-4 w-full">
                <button 
                  onClick={handleDownloadQR} 
                  disabled={!isValid} 
                  className={`w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 transition-all ${!isValid ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <Download size={20} /> {t.btn_dl_wifi}
                </button>

                <button 
                  onClick={handleDownloadPlaque} 
                  disabled={!isValid} 
                  className={`w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer ${!isValid ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
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
        qrValue={getWifiData()}
        displayValue={ssid}
        iconPath={ICON_PATHS.wifi}
        themeColor={fgColor}
        footerLabel={t.plaque_footer}
      />
    </div>
  )
}