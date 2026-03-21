'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wifi, Lock, ShieldCheck, ArrowLeft, Settings2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [ssid, setSsid] = useState('WiFi_Guest')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')
  const [showPassword, setShowPassword] = useState(false)

  // Formatage de la chaîne Wi-Fi standard reconnue par iOS/Android
  const getWifiData = () => {
    const enc = encryption === 'nopass' ? '' : encryption
    return `WIFI:T:${enc};S:${ssid};P:${password};;`
  }

  const downloadQR = () => {
    const canvas = document.getElementById('wifi-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `wifi-retailbox-${ssid}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* BOUTON RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {lang === 'fr' ? 'Retour' : 'Back'}
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

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              {/* NOM DU RESEAU */}
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

              {/* MOT DE PASSE & ENCRYPTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-gray-900">
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
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
                    <option value="WPA">{t.opt_wpa}</option>
                    <option value="WEP">{t.opt_wep}</option>
                    <option value="nopass">{t.opt_none}</option>
                  </select>
                </div>
              </div>

              {/* CONSEIL UTILISATEUR */}
              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">
                    {t.wifi_tip}
                  </p>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              {/* Le QR Code DOIT rester sur fond blanc pur pour être scannable par tous les capteurs */}
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="wifi-qr-canvas"
                  value={getWifiData()} 
                  size={260} 
                  level="M" 
                  includeMargin={true}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {lang === 'fr' ? 'Prêt à scanner' : 'Ready to scan'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 tracking-widest uppercase">
                  {ssid || 'Network Name'}
              </p>
              
              <button 
                  onClick={downloadQR}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
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