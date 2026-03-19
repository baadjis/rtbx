'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, User, Briefcase, Globe, MapPin, ArrowLeft, ShieldCheck, Contact2, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function VCardForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  
  const [data, setData] = useState({
    fn: '', ln: '', org: '', title: '',
    tel: '', email: '', url: '', adr: '',
    linkedin: '' // Ajout du champ LinkedIn
  })

  // Construction du format standard VCARD 3.0 compatible iOS/Android
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
      data.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${data.linkedin}` : '',
      "END:VCARD"
    ]
    return lines.filter(line => line.split(':')[1] !== '').join('\n')
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors no-underline">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
              {t.vcard_title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.vcard_sub}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
            
            {/* Section Identité */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4" /> {t.sec_identity}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder={t.label_fname} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, fn: e.target.value})} />
                <input placeholder={t.label_lname} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, ln: e.target.value})} />
              </div>
            </div>

            {/* Section Pro */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {t.sec_pro}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder={t.label_org} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, org: e.target.value})} />
                <input placeholder={t.label_job} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, title: e.target.value})} />
              </div>
            </div>

            {/* Section Contact & LinkedIn */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe className="w-4 h-4" /> {t.sec_contact}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder={t.label_tel} type="tel" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, tel: e.target.value})} />
                <input placeholder={t.label_email} type="email" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder={t.label_web} type="url" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, url: e.target.value})} />
                {/* Champ LinkedIn ajouté */}
                <div className="relative">
                    
                    <input placeholder="LinkedIn URL" className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                           onChange={e => setData({...data, linkedin: e.target.value})} />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input placeholder={t.label_adr} className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" 
                       onChange={e => setData({...data, adr: e.target.value})} />
              </div>
            </div>

            <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium italic">{t.vcard_tip}</p>
            </div>
          </div>
        </div>

        {/* --- PREVIEW --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-all">
            
            <div className="p-6 md:p-8 bg-white dark:bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
              <QRCodeCanvas 
                id="vcard-qr-canvas"
                value={getVCardData()} 
                size={260} 
                level="M" 
                includeMargin={true}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <Contact2 className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                {data.fn || data.ln ? `${data.fn} ${data.ln}` : (lang === 'fr' ? 'Votre Nom' : 'Your Name')}
            </h3>
            <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 italic">
                {data.org || (lang === 'fr' ? 'Votre Boutique' : 'Your Shop')}
            </p>
            
            <button 
                onClick={downloadQR}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Download className="w-6 h-6" /> {t.btn_dl_vcard}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}