'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, MessageCircle, Phone, Send, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'


export default function WhatsAppForm({ lang }: { lang: 'fr' | 'en' }) {
  const DICT={// À ajouter dans DICT.fr et DICT.en
fr: {
  wa_title: "QR Code WhatsApp Direct",
  wa_sub: "Générez un lien direct pour ouvrir instantanément une discussion WhatsApp avec vos clients.",
  label_phone: "Numéro de téléphone (avec indicatif)",
  ph_phone: "Ex: 33612345678",
  label_wa_msg: "Message pré-rempli (optionnel)",
  ph_wa_msg: "Ex: Bonjour, je souhaite commander un article...",
  wa_tip: "💡 Conseil : Le message s'écrira automatiquement dans le téléphone du client lorsqu'il scannera le code.",
  btn_dl_wa: "TÉLÉCHARGER LE QR WHATSAPP",
},
en: {
  wa_title: "Direct WhatsApp QR",
  wa_sub: "Generate a direct link to instantly open a WhatsApp chat with your customers.",
  label_phone: "Phone Number (with country code)",
  ph_phone: "e.g. 44123456789",
  label_wa_msg: "Pre-filled message (optional)",
  ph_wa_msg: "e.g. Hello, I would like to order an item...",
  wa_tip: "💡 Tip: The message will be automatically typed in the customer's phone when they scan the code.",
  btn_dl_wa: "DOWNLOAD WHATSAPP QR",
}}
  const t = DICT[lang]
  
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.wa_title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.wa_sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            {/* Numéro de téléphone */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4" /> {t.label_phone}
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.ph_phone}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase ml-2">Indiquez le pays (ex: 33 pour la France)</p>
            </div>

            {/* Message pré-rempli */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Send className="w-4 h-4" /> {t.label_wa_msg}
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.ph_wa_msg}
                rows={4}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            {/* Conseil SEO/UX */}
            <div className="p-5 bg-green-50 rounded-2xl border border-green-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-900 font-medium italic">{t.wa_tip}</p>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            
            <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
              <QRCodeCanvas 
                id="wa-qr-canvas"
                value={getWhatsAppLink()} 
                size={260} 
                level="H" 
                includeMargin={true}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <MessageCircle className="w-8 h-8 text-[#25D366] fill-[#25D366]/10" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                {lang === 'fr' ? 'Discussion Directe' : 'Direct Chat'}
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-10 truncate max-w-xs">
                {phone || 'Numéro requis'}
            </p>
            
            <button 
                onClick={downloadQR}
                disabled={!phone}
                className="w-full py-5 bg-[#25D366] text-white rounded-3xl font-black shadow-xl shadow-green-100 hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
            >
              <Download className="w-6 h-6" /> {t.btn_dl_wa}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}