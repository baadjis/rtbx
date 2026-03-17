'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Plus, Trash2, ArrowLeft, 
  ShieldCheck, Share2, Globe, Users 
} from 'lucide-react'
import Link from 'next/link'
import { DICT } from '@/lib/locales'

const SOCIAL_OPTIONS = [
  "Instagram", "TikTok", "YouTube", "Threads", "Pinterest", 
  "Twitch", "Facebook", "LinkedIn", "X (Twitter)", 
  "Spotify", "Shopify", "WhatsApp", "Website"
]

export default function DigitalIDForm({ lang }: { lang: 'fr' | 'en' }) {
  const DICT={
    // À ajouter dans DICT.fr et DICT.en
fr: {
  did_title: "Votre Identité Digitale",
  did_sub: "Regroupez tous vos réseaux sociaux et boutiques dans un seul QR Code unique.",
  label_select_net: "Choisir un réseau",
  ph_handle: "Lien ou @identifiant",
  btn_add_net: "+ Ajouter un réseau",
  did_preview: "Votre Social Card",
  did_tip: "💡 Conseil : Affichez ce QR Code sur vos supports physiques pour convertir vos clients en abonnés.",
  btn_dl_did: "TÉLÉCHARGER MA SOCIAL CARD",
  did_header: "MA PRÉSENCE DIGITALE :",
},
en: {
  did_title: "Your Digital Identity",
  did_sub: "Group all your social networks and stores into a single unique QR Code.",
  label_select_net: "Select a network",
  ph_handle: "Link or @handle",
  btn_add_net: "+ Add a network",
  did_preview: "Your Social Card",
  did_tip: "💡 Tip: Display this QR Code on your physical marketing to turn customers into followers.",
  btn_dl_did: "DOWNLOAD MY SOCIAL CARD",
  did_header: "MY DIGITAL PRESENCE:",
}
  }
  const t = DICT[lang]
  const [links, setLinks] = useState([{ network: 'Instagram', handle: '' }])

  const addLink = () => {
    if (links.length < SOCIAL_OPTIONS.length) {
      setLinks([...links, { network: SOCIAL_OPTIONS[0], handle: '' }])
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: 'network' | 'handle', value: string) => {
    const newLinks = [...links]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  // Empêcher les doublons de réseaux
  const getAvailableOptions = (currentNetwork: string) => {
    const selectedNetworks = links.map(l => l.network).filter(n => n !== currentNetwork)
    return SOCIAL_OPTIONS.filter(opt => !selectedNetworks.includes(opt))
  }

  const getQRValue = () => {
    const content = links
      .filter(l => l.handle.trim() !== '')
      .map(l => `• ${l.network}: ${l.handle.trim()}`)
      .join('\n')
    return content ? `${t.did_header}\n${content}` : 'RetailBox Identity'
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.did_title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.did_sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <select 
                      value={link.network}
                      onChange={(e) => updateLink(index, 'network', e.target.value)}
                      className="flex-1 p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900 appearance-none shadow-sm"
                    >
                      {getAvailableOptions(link.network).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => removeLink(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <input 
                    placeholder={t.ph_handle}
                    value={link.handle}
                    onChange={(e) => updateLink(index, 'handle', e.target.value)}
                    className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm shadow-sm"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={addLink}
              disabled={links.length >= SOCIAL_OPTIONS.length}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> {t.btn_add_net}
            </button>
          </div>

          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <p className="text-sm text-indigo-900 font-medium italic">{t.did_tip}</p>
          </div>
        </div>

        {/* --- COLONNE DROITE : PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            
            <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative">
              <QRCodeCanvas 
                id="did-qr-canvas"
                value={getQRValue()} 
                size={260} 
                level="H" 
                includeMargin={true}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                {t.did_preview}
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-10">
                {links.filter(l => l.handle).length} {lang === 'fr' ? 'réseaux liés' : 'networks linked'}
            </p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> {t.btn_dl_did}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}