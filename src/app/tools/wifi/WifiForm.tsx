'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wifi, Lock, ShieldCheck, ArrowLeft, Settings2 } from 'lucide-react'
import Link from 'next/link'


export default function WifiForm({ lang }: { lang: 'fr' | 'en' }) {
  const DICT={
    // À ajouter dans DICT.fr et DICT.en
fr: {
  wifi_title: "QR Code Accès Wi-Fi",
  wifi_sub: "Offrez une connexion instantanée à vos clients sans saisie de mot de passe.",
  label_ssid: "Nom du réseau (SSID)",
  ph_ssid: "Ex: Wi-Fi_Boutique",
  label_password: "Mot de passe",
  ph_password: "Clé de sécurité",
  label_encryption: "Sécurité",
  opt_wpa: "WPA / WPA2 (Standard)",
  opt_wep: "WEP (Ancien)",
  opt_none: "Aucune (Ouvert)",
  wifi_tip: "💡 Conseil : Les clients n'ont qu'à scanner ce code avec l'appareil photo de leur smartphone pour rejoindre le réseau.",
  btn_dl_wifi: "TÉLÉCHARGER LE QR WI-FI",
},
en: {
  wifi_title: "Wi-Fi Access QR Code",
  wifi_sub: "Provide instant connection to your customers without password entry.",
  label_ssid: "Network Name (SSID)",
  ph_ssid: "e.g. Shop_WiFi",
  label_password: "Password",
  ph_password: "Security key",
  label_encryption: "Security",
  opt_wpa: "WPA / WPA2 (Standard)",
  opt_wep: "WEP (Old)",
  opt_none: "None (Open)",
  wifi_tip: "💡 Tip: Customers just need to scan this code with their smartphone camera to join the network.",
  btn_dl_wifi: "DOWNLOAD WI-FI QR",
}
  }
  const t = DICT[lang]
  
  const [ssid, setSsid] = useState('WiFi_Guest')
  const [password, setPassword] = useState('')
  const [encryption, setEncryption] = useState('WPA')

  // Formatage de la chaîne Wi-Fi standard
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Retour */}
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.wifi_title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.wifi_sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Wifi className="w-4 h-4" /> {t.label_ssid}
              </label>
              <input 
                type="text" 
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder={t.ph_ssid}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {t.label_password}
                </label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.ph_password}
                  disabled={encryption === 'nopass'}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 disabled:opacity-30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> {t.label_encryption}
                </label>
                <select 
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 appearance-none"
                >
                  <option value="WPA">{t.opt_wpa}</option>
                  <option value="WEP">{t.opt_wep}</option>
                  <option value="nopass">{t.opt_none}</option>
                </select>
              </div>
            </div>

            {/* Tip responsive */}
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-900 font-medium italic">{t.wifi_tip}</p>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            
            <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner">
              <QRCodeCanvas 
                id="wifi-qr-canvas"
                value={getWifiData()} 
                size={260} 
                level="M" // Medium car les strings WiFi sont courtes
                includeMargin={true}
              />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                {lang === 'fr' ? 'Prêt à scanner' : 'Ready to scan'}
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-10">{ssid}</p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> {t.btn_dl_wifi}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}