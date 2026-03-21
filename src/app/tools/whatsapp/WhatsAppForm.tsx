'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, MessageCircle, Phone, Send, ArrowLeft, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function WhatsAppForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Nettoyage du numéro et construction du lien WhatsApp
  const getWhatsAppLink = () => {
    const cleanPhone = phone.replace(/\D/g, '') // Enlève tout sauf les chiffres
    if (!cleanPhone) return 'https://wa.me/'
    
    const encodedMsg = encodeURIComponent(message.trim())
    return `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`
  }

  const downloadQR = () => {
    const canvas = document.getElementById('wa-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `whatsapp-qr-retailbox.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* RETOUR */}
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
                {t.wa_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.wa_sub}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              {/* Numéro de téléphone */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {t.label_phone}
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.ph_phone}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase ml-2">
                  {lang === 'fr' ? "Indiquez le pays (ex: 33 pour la France)" : "Include country code (e.g. 1 for USA)"}
                </p>
              </div>

              {/* Message pré-rempli */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Send className="w-4 h-4" /> {t.label_wa_msg}
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.ph_wa_msg}
                  rows={4}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 dark:text-white transition-colors"
                />
              </div>

              {/* Tip visuel */}
              <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-900/30 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-900 dark:text-green-200 font-medium italic leading-relaxed">
                    {t.wa_tip}
                  </p>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="wa-qr-canvas"
                  value={getWhatsAppLink()} 
                  size={260} 
                  level="H" 
                  includeMargin={true}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-[#25D366] fill-[#25D366]/10" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {lang === 'fr' ? 'Discussion Directe' : 'Direct Chat'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 truncate max-w-xs uppercase tracking-widest">
                  {phone || (lang === 'fr' ? 'Numéro requis' : 'Number required')}
              </p>
              
              <button 
                  onClick={downloadQR}
                  disabled={!phone}
                  className="w-full py-5 bg-[#25D366] text-white rounded-3xl font-black shadow-xl shadow-green-100 dark:shadow-none hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale active:scale-95"
              >
                <Download className="w-6 h-6" /> {t.btn_dl_wa}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}