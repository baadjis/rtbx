'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, User, Briefcase, Globe, MapPin, ArrowLeft, ShieldCheck, Contact2 } from 'lucide-react'
import Link from 'next/link'

export default function VCardForm({ lang }: { lang: 'fr' | 'en' }) {
  const DICT={
   
fr: {
  vcard_title: "Carte de Visite Digitale (VCard)",
  vcard_sub: "Permettez à vos clients d'enregistrer vos coordonnées complètes d'un simple scan.",
  sec_identity: "Identité",
  sec_pro: "Professionnel",
  sec_contact: "Contact & Digital",
  label_fname: "Prénom",
  label_lname: "Nom",
  label_org: "Boutique / Entreprise",
  label_job: "Poste / Fonction",
  label_tel: "Téléphone Mobile",
  label_email: "E-mail Professionnel",
  label_web: "Site Web / Boutique",
  label_adr: "Adresse physique (GPS)",
  vcard_tip: "💡 Le format VCard est universel : il fonctionne sur tous les iPhone et Android sans application supplémentaire.",
  btn_dl_vcard: "TÉLÉCHARGER MA VCARD QR",
},
en: {
  vcard_title: "Digital Business Card (VCard)",
  vcard_sub: "Allow your customers to save your full contact details with a single scan.",
  sec_identity: "Identity",
  sec_pro: "Professional",
  sec_contact: "Contact & Digital",
  label_fname: "First Name",
  label_lname: "Last Name",
  label_org: "Shop / Company",
  label_job: "Job Title",
  label_tel: "Mobile Number",
  label_email: "Pro Email",
  label_web: "Website / Shop",
  label_adr: "Physical Address (GPS)",
  vcard_tip: "💡 VCard format is universal: it works on all iPhones and Androids without any extra app.",
  btn_dl_vcard: "DOWNLOAD MY VCARD QR",
}
  }
  const t = DICT[lang]
  
  const [data, setData] = useState({
    fn: '', ln: '', org: '', title: '',
    tel: '', email: '', url: '', adr: ''
  })

  // Construction du format standard VCARD 3.0
  const getVCardData = () => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${data.fn} ${data.ln}`,
      `N:${data.ln};${data.fn};;;`,
      data.org ? `ORG:${data.org}` : '',
      data.title ? `TITLE:${data.title}` : '',
      data.tel ? `TEL;TYPE=CELL,VOICE:${data.tel}` : '',
      data.email ? `EMAIL;TYPE=PREF,INTERNET:${data.email}` : '',
      data.url ? `URL:${data.url}` : '',
      data.adr ? `ADR;TYPE=WORK:;;${data.adr};;;;` : '',
      "END:VCARD"
    ]
    return lines.filter(line => line !== '').join('\n')
  }

  const downloadQR = () => {
    const canvas = document.getElementById('vcard-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `vcard-${data.ln || 'contact'}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-gray-900">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.vcard_title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.vcard_sub}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            
            {/* Section Identité */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4" /> {t.sec_identity}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder={t.label_fname} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, fn: e.target.value})} />
                <input placeholder={t.label_lname} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, ln: e.target.value})} />
              </div>
            </div>

            {/* Section Pro */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {t.sec_pro}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder={t.label_org} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, org: e.target.value})} />
                <input placeholder={t.label_job} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, title: e.target.value})} />
              </div>
            </div>

            {/* Section Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe className="w-4 h-4" /> {t.sec_contact}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder={t.label_tel} type="tel" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, tel: e.target.value})} />
                <input placeholder={t.label_email} type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, email: e.target.value})} />
              </div>
              <input placeholder={t.label_web} type="url" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                     onChange={e => setData({...data, url: e.target.value})} />
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input placeholder={t.label_adr} className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" 
                       onChange={e => setData({...data, adr: e.target.value})} />
              </div>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-900 font-medium italic">{t.vcard_tip}</p>
            </div>
          </div>
        </div>

        {/* --- PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            
            <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative">
              <QRCodeCanvas 
                id="vcard-qr-canvas"
                value={getVCardData()} 
                size={260} 
                level="M" 
                includeMargin={true}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <Contact2 className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                {data.fn || data.ln ? `${data.fn} ${data.ln}` : (lang === 'fr' ? 'Votre Nom' : 'Your Name')}
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-10 italic">
                {data.org || (lang === 'fr' ? 'Votre Boutique' : 'Your Shop')}
            </p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> {t.btn_dl_vcard}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}