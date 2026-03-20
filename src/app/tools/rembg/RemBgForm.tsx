'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Sparkles, Download, ArrowLeft, Trash2, ImageIcon, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const DICT = {
  fr: {
    title: "Détourage IA Pro",
    sub: "Supprimez l'arrière-plan de vos photos produits instantanément.",
    drop: "Glissez votre photo ici",
    drop_sub: "Supporte JPG, PNG (Max 10Mo)",
    btn_run: "Enlever le fond",
    btn_loading: "Traitement IA...",
    btn_dl: "TÉLÉCHARGER PNG HD",
    privacy: "Confidentialité : Vos images sont traitées en RAM et ne sont jamais stockées.",
    result_wait: "Le résultat apparaîtra ici après analyse...",
    back: "Retour",
    filename :"Nom du fichier"
  },
  en: {
    title: "AI Background Removal",
    sub: "Remove the background from your product photos instantly.",
    drop: "Drop your photo here",
    drop_sub: "Supports JPG, PNG (Max 10MB)",
    btn_run: "Remove Background",
    btn_loading: "AI Processing...",
    btn_dl: "DOWNLOAD HD PNG",
    privacy: "Privacy: Your images are processed in RAM and are never stored.",
    result_wait: "The result will appear here after analysis...",
    back: "Back",
    filename:"Filename"
  }
}

export default function RemBgForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = DICT[lang]
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFile(files[0]); setPreview(URL.createObjectURL(files[0])); setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []}, multiple: false })

  const processImage = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData(); formData.append("image", file)
    try {
      const res = await fetch("https://baadjis-utilitybox.hf.space/api/rembg", {
        method: "POST",
        headers: { "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" },
        body: formData
      })
      const data = await res.json()
      if (data.image_base64) setResult(`data:image/png;base64,${data.image_base64}`)
    } catch (e) { alert("Error connecting to AI engine") }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{t.title}</h1>
          <p className="text-gray-500 font-medium">{t.sub}</p>

          {!preview ? (
            <div {...getRootProps()} className={`border-4 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold">{t.drop}</h3>
              <p className="text-gray-400">{t.drop_sub}</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-xl">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setPreview(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">{lang === 'fr' ? 'Changer' : 'Change'}</button>
                <button onClick={processImage} disabled={loading} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  {loading ? t.btn_loading : t.btn_run}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <ShieldCheck className="text-blue-600 w-6 h-6 flex-shrink-0" />
            <p className="text-sm text-blue-800 font-medium leading-relaxed">{t.privacy}</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 min-h-[450px] flex items-center justify-center relative overflow-hidden">
          {result ? (
            <div className="p-8 w-full flex flex-col items-center">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 shadow-2xl" 
                style={{backgroundImage: 'conic-gradient(#e5e7eb 25%, #ffffff 0 50%, #e5e7eb 0 75%, #ffffff 0)', backgroundSize: '20px 20px'}}>
                <Image src={result} alt="Result" fill className="object-contain" />
              </div>
              <a href={result} download={t.filename} className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-center shadow-xl shadow-green-100 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                <Download className="w-6 h-6" /> {t.btn_dl}
              </a>
            </div>
          ) : (
            <div className="text-center opacity-40">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="italic font-medium">{t.result_wait}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}