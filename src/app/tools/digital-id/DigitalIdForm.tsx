/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Download, Plus, Trash2, ArrowLeft, 
  ShieldCheck, Users, Settings2, Link2
} from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

const SOCIAL_OPTIONS = [
  "Instagram", "TikTok", "YouTube", "Threads", "Pinterest", 
  "Twitch", "Facebook", "LinkedIn", "X (Twitter)", 
  "Spotify", "Shopify", "WhatsApp", "Website"
]

export default function DigitalIDForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [links, setLinks] = useState([{ network: 'Instagram', handle: '' }])

  const addLink = () => {
    if (links.length < SOCIAL_OPTIONS.length) {
      // Trouver le premier réseau non utilisé
      const used = links.map(l => l.network);
      const available = SOCIAL_OPTIONS.find(opt => !used.includes(opt));
      setLinks([...links, { network: available || SOCIAL_OPTIONS[0], handle: '' }])
    }
  }

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
    } else {
      setLinks([{ network: SOCIAL_OPTIONS[0], handle: '' }])
    }
  }

  const updateLink = (index: number, field: 'network' | 'handle', value: string) => {
    const newLinks = [...links]
    // @ts-ignore
    newLinks[index][field] = value
    setLinks(newLinks)
  }

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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* RETOUR */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.did_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.did_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4" /> configuration des réseaux
                </label>
                
                {links.map((link, index) => (
                  <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-3">
                      <select 
                        value={link.network}
                        onChange={(e) => updateLink(index, 'network', e.target.value)}
                        className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900 dark:text-white appearance-none shadow-sm transition-colors"
                      >
                        {getAvailableOptions(link.network).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeLink(index)}
                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        placeholder={t.ph_handle}
                        value={link.handle}
                        onChange={(e) => updateLink(index, 'handle', e.target.value)}
                        className="w-full p-3 pl-10 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-900 dark:text-white shadow-sm transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addLink}
                disabled={links.length >= SOCIAL_OPTIONS.length}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 bg-transparent"
              >
                <Plus className="w-5 h-5" /> {t.btn_add_net}
              </button>
            </div>

            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic leading-relaxed">
                  {t.did_tip}
                </p>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              <div className="p-6 md:p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="did-qr-canvas"
                  value={getQRValue()} 
                  size={260} 
                  level="H" 
                  includeMargin={true}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {t.did_preview}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 tracking-widest uppercase">
                  {links.filter(l => l.handle).length} {lang === 'fr' ? 'Profils liés' : 'Linked profiles'}
              </p>
              
              <button 
                  onClick={downloadQR}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Download className="w-6 h-6" /> {t.btn_dl_did}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}