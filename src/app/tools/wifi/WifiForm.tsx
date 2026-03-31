'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wifi, Lock, ShieldCheck, ArrowLeft, Settings2, Eye, EyeOff, Palette } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [ssid, setSsid] = useState('WiFi_Guest')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')
  const [showPassword, setShowPassword] = useState(false)
  
  // Options de style
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H') // 'H' est requis pour le logo

  // L'icône WiFi en DataURL pour qu'elle soit incluse dans le téléchargement
  // C'est un SVG converti en base64 pour être "dessiné" dans le canvas
  const wifiIconDataUrl = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${fgColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
      <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
  `)}`;

  const getWifiData = () => {
    const enc = encryption === 'nopass' ? '' : encryption
    return `WIFI:T:${enc};S:${ssid};P:${password};;`
  }

  const downloadQR = () => {
    const canvas = document.getElementById('wifi-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    
    // On crée un lien temporaire pour le téléchargement
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `wifi-retailbox-${ssid}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline border-none">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- FORMULAIRE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.wifi_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.wifi_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              {/* SSID */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Wifi className="w-4 h-4" /> {t.label_ssid}
                </label>
                <input 
                  type="text" 
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder={t.ph_ssid}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                />
              </div>

              {/* PASSWORD & SECURITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-4 h-4" /> {t.label_password}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.ph_password}
                      disabled={encryption === 'nopass'}
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white disabled:opacity-30 transition-colors"
                    />
                    {encryption !== 'nopass' && (
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors border-none bg-transparent"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Settings2 className="w-4 h-4" /> {t.label_encryption}
                  </label>
                  <select 
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white appearance-none transition-colors"
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{lang === 'fr' ? 'Aucun (Ouvert)' : 'None (Open)'}</option>
                  </select>
                </div>
              </div>

              {/* PERSONNALISATION COULEUR */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Couleur Personnalisée
                </label>
                <div className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 w-fit">
                    <input 
                        type="color" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)} 
                        className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" 
                    />
                    <span className="text-sm font-black text-gray-700 dark:text-slate-300 uppercase">{fgColor}</span>
                </div>
              </div>

              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">
                    {t.wifi_tip}
                  </p>
              </div>
            </div>
          </div>

          {/* --- PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="wifi-qr-canvas"
                  value={getWifiData()} 
                  size={260} 
                  fgColor={fgColor}
                  level="H" 
                  marginSize={4} // Correction : Utilise marginSize au lieu de includeMargin
                  imageSettings={{
                    src: wifiIconDataUrl,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true, // Crée un espace blanc autour du logo
                  }}
                />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {lang === 'fr' ? 'Prêt à scanner' : 'Ready to scan'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 tracking-widest uppercase">
                  {ssid || 'Network Name'}
              </p>
              
              <button 
                  onClick={downloadQR}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer"
              >
                <Download className="w-6 h-6" /> {t.btn_dl_wifi}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}