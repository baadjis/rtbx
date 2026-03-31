'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wifi, Lock, ShieldCheck, ArrowLeft, Settings2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [ssid, setSsid] = useState('WiFi_Boutique')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')
  const [showPassword, setShowPassword] = useState(false)

  // Icône WiFi universelle en Base64 (Indigo) - Garantie de fonctionner dans le Canvas
  const wifiIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABy0lEQVR4nO2Wv0vDQRSFv69BaReh4iYIdXByE6S0o6OLuIid7X/g6OToIHYpUnByE6S0S8VNRAtSByuI9HnwaS9pYmI0SZr8fHDccXfJ+9679y4pSBAEQRAEQRAEQRAEQRAE6S96wAnQDmZAN3idAtNIs80+MAvMB99ToNf5T7Z7N9Bv/X9vAAtI80AbOA8+X/G/A7TInK360TzSDrAIXALXQDfE99V9B8yVvVsDVsicrfvXPNIecAlcA7fAtXpX9xswX/ZpG9gk82U8Y80jHQCXwB1wD9yor+p/AebKvm0CO8C+8Nsc8j88E36PgaPgeRz0K9Bv/X9vAPNI80AbOA8+X/G/A7TInK360TzSDrAIXALXQDfE99V9B8yVvVsDVsicrfvXPNIecAlcA7fAtXpX9xswX/ZpG9gk82U8Y80jHQCXwB1wD9yor+p/AebKvm0CO8C+8Nsc8j88E36PgaPgeRz0K9Bv/X9vAPNI80AbOA8+X/G/A7TInK360TzSDrAIXALXQDfE99V9B8yVvVsDVsicrfvXPNIecAlcA7fAtXpX9xswX/ZpG9gk82U8Y80jHQCXwB1wD9yor+p/AebKvm0CO8C+8Nsc8j88En4LgiAIgiAIgnSOf96K8N7mZf7YAAAAAElFTkSuQmCC";

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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        
        {/* RETOUR ALIGNÉ */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-12 no-underline border-none">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {lang === 'fr' ? 'Retour aux outils' : 'Back to tools'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-10">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.wifi_title}
              </h1>
              <p className="text-xl text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.wifi_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-800 space-y-10 transition-colors">
              
              {/* NOM DU RESEAU */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-indigo-600" /> {t.label_ssid}
                </label>
                <input 
                  type="text" 
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder={t.ph_ssid}
                  className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors text-lg"
                />
              </div>

              {/* MOT DE PASSE & ENCRYPTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" /> {t.label_password}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.ph_password}
                      disabled={encryption === 'nopass'}
                      className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white disabled:opacity-30 transition-colors"
                    />
                    {encryption !== 'nopass' && (
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-600" /> {t.label_encryption}
                  </label>
                  <select 
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white appearance-none transition-colors"
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{lang === 'fr' ? 'Ouvert (Sans mot de passe)' : 'None (No password)'}</option>
                  </select>
                </div>
              </div>

              {/* TIP AREA */}
              <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">
                    {t.wifi_tip}
                  </p>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-[0_40px_80px_rgba(79,70,229,0.12)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-all duration-500">
              
              <div className="p-8 bg-white rounded-[3rem] mb-12 shadow-inner border border-gray-50 relative group">
                <QRCodeCanvas 
                  id="wifi-qr-canvas"
                  value={getWifiData()} 
                  size={280} 
                  level="H" 
                  fgColor="#0f172a"
                  imageSettings={{
                    src: wifiIcon,
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
              </div>
              
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {lang === 'fr' ? 'Accès Instantané' : 'Instant Access'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-black text-sm mb-12 tracking-[0.3em] uppercase">
                  {ssid || 'Network'}
              </p>
              
              <button 
                  onClick={downloadQR}
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer text-lg"
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