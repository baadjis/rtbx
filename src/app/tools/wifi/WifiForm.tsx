'use client'
import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wifi, Lock, ShieldCheck, ArrowLeft, Settings2, Eye, EyeOff, Palette, Printer } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'
import { BrandLogo } from '@/components/BrandLogo'
// CHANGEMENT DE L'IMPORT ICI
import { toPng } from "@jpinsonneau/html-to-image";

export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const plaqueRef = useRef<HTMLDivElement>(null)
  
  const [ssid, setSsid] = useState('WiFi_Boutique')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')
  const [showPassword, setShowPassword] = useState(false)
  const [fgColor, setFgColor] = useState('#4f46e5')
  const [bgColor, setBgColor] = useState('#ffffff')

  // Icône dynamique pour le QR
  const wifiIconSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${fgColor.replace('#', '%23')}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`

  const getWifiData = () => {
    const enc = encryption === 'nopass' ? '' : encryption
    return `WIFI:T:${enc};S:${ssid};P:${password};;`
  }

  const downloadQR = () => {
    const canvas = document.getElementById('wifi-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `wifi-qr-${ssid}.png`
    link.href = url
    link.click()
  }

  // --- FONCTION DE TÉLÉCHARGEMENT AVEC LE FIX ---
  const downloadFullPlaque = async () => {
    if (plaqueRef.current === null) return
    
    try {
      // On s'assure que les polices sont chargées
      await document.fonts.ready;

      const dataUrl = await toPng(plaqueRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, // Qualité HD
        backgroundColor: '#ffffff',
        // La nouvelle librairie gère mieux le filtrage
        filter: (node) => {
          return node.tagName !== 'I'; // Lucide utilise des balises <i>
        }
      })

      const link = document.createElement('a')
      const cleanName = ssid.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      link.download = `plaque-wifi-${cleanName}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Erreur de rendu", err)
      alert("Erreur technique. Essayez de remplir tous les champs.")
    }
  }

  const isValid = ssid.trim() !== '' && (encryption === 'nopass' || password.trim() !== '');

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {lang === 'fr' ? 'Retour aux outils' : 'Back to tools'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight mb-4">
                {t.wifi_title}
            </h1>
            
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2"><Wifi size={16}/> {t.label_ssid}</label>
                <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2"><Lock size={16}/> {t.label_password}</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={encryption === 'nopass'} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white disabled:opacity-30" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-none bg-transparent cursor-pointer">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2"><Settings2 size={16}/> {t.label_encryption}</label>
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
                  <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Couleur QR</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Fond</label>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                      <span className="text-sm font-bold dark:text-white uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-12 shadow-[0_40px_80px_rgba(79,70,229,0.12)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="p-8 bg-white rounded-[3rem] mb-10 shadow-inner border border-gray-50 relative overflow-hidden">
                <QRCodeCanvas id="wifi-qr-canvas" value={getWifiData()} size={240} level="H" fgColor={fgColor} bgColor={bgColor} marginSize={4} imageSettings={{ src: wifiIconSvg, height: 45, width: 45, excavate: true }} />
              </div>
              
              <div className="space-y-4 w-full">
                <button onClick={downloadQR} disabled={!isValid} className={`w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 transition-all ${!isValid ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                  <Download size={20} /> {t.btn_dl_wifi}
                </button>

                <button onClick={downloadFullPlaque} disabled={!isValid} className={`w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer ${!isValid ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <Printer size={20} /> {t.btn_dl_plaque}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ZONE DE RENDU CACHÉE (SANS DISPLAY:NONE POUR ÉVITER LE BUG) --- */}
      <div style={{ position: 'absolute', top: '200%', left: 0, width: '800px', height: '1200px', pointerEvents: 'none' }}>
        <div ref={plaqueRef} className="p-16 bg-white text-center flex flex-col items-center justify-between border-[20px] border-indigo-600 rounded-[5rem]" style={{ width: '800px', height: '1200px' }}>
            <div className="flex flex-col items-center gap-4">
               <div className="scale-150 mb-10 mt-10"><BrandLogo /></div>
               <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter mt-12">{t.plaque_title}</h1>
            </div>
            
            <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-[15px] border-gray-50">
              <QRCodeCanvas value={getWifiData()} size={450} level="H" fgColor="#000000" marginSize={4} imageSettings={{ src: wifiIconSvg, height: 80, width: 80, excavate: true }} />
            </div>

            <div className="space-y-6 mb-10">
                <div className="flex items-center justify-center gap-4 bg-indigo-50 px-10 py-6 rounded-[2rem]">
                    <Wifi size={40} className="text-indigo-600" />
                    <span className="text-5xl font-black text-indigo-600">{ssid}</span>
                </div>
                <p className="text-3xl font-bold text-gray-400 uppercase tracking-[0.3em]">{t.plaque_footer}</p>
            </div>
            
            <p className="text-sm font-black text-gray-200 uppercase tracking-widest pb-10">RetailBox • www.rtbx.space</p>
        </div>
      </div>
    </div>
  )
}