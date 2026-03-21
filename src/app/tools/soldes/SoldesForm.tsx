/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { Tag, Download, Printer, ArrowLeft, Loader2, Barcode } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Data } from './data'

export default function SoldesForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    item: '',
    old_p: '',
    new_p: '',
    code: ''
  })
  const [result, setResult] = useState<{preview: string, pdf: string} | null>(null)

  const handleGenerate = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://baadjis-utilitybox.hf.space/api/gen-soldes-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || ""
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.status === "success") {
        setResult({
          preview: `data:image/png;base64,${data.preview_base64}`,
          pdf: `data:application/pdf;base64,${data.pdf_base64}`
        })
      }
    } catch (err) {
      alert(lang === 'fr' ? "Erreur de connexion au moteur de génération." : "Error connecting to the generation engine.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* RETOUR */}
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 transition-colors no-underline">
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
                {t.soldes_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.soldes_sub}</p>
            </div>

            <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.label_item}</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                  placeholder="Ex: T-shirt Vintage"
                  value={formData.item}
                  onChange={e => setFormData({...formData, item: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.old_price}</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                    value={formData.old_p}
                    onChange={e => setFormData({...formData, old_p: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.new_price}</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600 dark:text-indigo-400 transition-colors"
                    value={formData.new_p}
                    onChange={e => setFormData({...formData, new_p: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Barcode className="w-4 h-4" /> {t.label_barcode}
                </label>
                <input 
                  required maxLength={12}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-lg tracking-[0.2em] text-gray-900 dark:text-white transition-colors"
                  placeholder="366000000000"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.replace(/[^0-9]/g, '')})}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Tag className="w-5 h-5" />}
                {loading ? (lang === 'fr' ? 'Génération...' : 'Generating...') : t.btn_generate}
              </button>
            </form>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              {result ? (
                <div className="w-full space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="relative w-full aspect-[3/4] max-w-[280px] mx-auto shadow-2xl rounded-2xl overflow-hidden border-8 border-gray-50 dark:border-slate-800 bg-white">
                    <Image src={result.preview} alt="Preview" fill className="object-contain" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t.preview_title}</h3>
                    <p className="text-gray-400 dark:text-slate-500 font-bold text-sm tracking-widest">FORMAT A4 PRÊT</p>
                  </div>
                  
                  <div className="space-y-3 w-full">
                    <a href={result.preview} download="etiquette-retailbox.png" className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all no-underline">
                      <Download className="w-4 h-4" /> {t.dl_image}
                    </a>
                    <a href={result.pdf} download="planche-A4-retailbox.pdf" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-all no-underline">
                      <Printer className="w-6 h-6" /> {t.dl_pdf}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-6 opacity-30">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-colors">
                    <Printer className="w-10 h-10 text-gray-300 dark:text-slate-700" />
                  </div>
                  <p className="font-black text-gray-400 dark:text-slate-600 italic tracking-tight">
                    {lang === 'fr' ? "En attente de vos données..." : "Waiting for your data..."}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}