/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'
import { Tag, Download, Printer, ArrowLeft, Loader2, Barcode, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


export default function SoldesForm({ lang }: { lang: 'fr' | 'en' }) {
  const DICT= {fr: {
  soldes_title: "Étiquettes de Soldes & Planches A4",
  soldes_sub: "Générez des étiquettes professionnelles avec prix barrés et codes-barres.",
  label_item: "Nom du produit",
  label_prices: "Configuration des prix",
  old_price: "Prix d'origine (€)",
  new_price: "Prix soldé (€)",
  label_barcode: "Code-barres EAN-13 (12 chiffres)",
  btn_generate: "🚀 Créer l'étiquette et la planche",
  preview_title: "Aperçu de l'étiquette",
  dl_image: "⬇️ Image seule (PNG)",
  dl_pdf: "📄 Planche A4 (24 étiquettes)",
},
en: {
  soldes_title: "Sale Labels & A4 Sheets",
  soldes_sub: "Generate professional labels with crossed-out prices and barcodes.",
  label_item: "Product Name",
  label_prices: "Price Configuration",
  old_price: "Original Price (€)",
  new_price: "Sale Price (€)",
  label_barcode: "EAN-13 Barcode (12 digits)",
  btn_generate: "🚀 Create Label & Sheet",
  preview_title: "Label Preview",
  dl_image: "⬇️ Single Image (PNG)",
  dl_pdf: "📄 A4 Sheet (24 labels)",
}}
  const t = DICT[lang]
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
      alert("Erreur de connexion au moteur de génération.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.soldes_title}
            </h1>
            <p className="text-gray-500 font-medium text-lg">{t.soldes_sub}</p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_item}</label>
              <input 
                required
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="Ex: T-shirt Vintage"
                onChange={e => setFormData({...formData, item: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.old_price}</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  onChange={e => setFormData({...formData, old_p: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.new_price}</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
                  onChange={e => setFormData({...formData, new_p: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Barcode className="w-4 h-4" /> {t.label_barcode}
              </label>
              <input 
                required maxLength={12}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-lg tracking-widest"
                placeholder="366000000000"
                onChange={e => setFormData({...formData, code: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Tag className="w-5 h-5" />}
              {loading ? (lang === 'fr' ? 'Génération...' : 'Generating...') : t.btn_generate}
            </button>
          </form>
        </div>

        {/* --- PREVIEW STICKY --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center">
            {result ? (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative w-full aspect-[3/4] max-w-[250px] mx-auto shadow-2xl rounded-xl overflow-hidden border border-gray-100">
                  <Image src={result.preview} alt="Preview" fill className="object-contain" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">{t.preview_title}</h3>
                
                <div className="space-y-3">
                  <a href={result.preview} download="etiquette-retailbox.png" className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                    <Download className="w-4 h-4" /> {t.dl_image}
                  </a>
                  <a href={result.pdf} download="planche-A4-retailbox.pdf" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all">
                    <Printer className="w-5 h-5" /> {t.dl_pdf}
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 opacity-30">
                <Printer className="w-16 h-16 mx-auto text-gray-300" />
                <p className="font-bold italic">Remplissez le formulaire pour voir l&apos;aperçu</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}