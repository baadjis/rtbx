'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Sparkles, Download, ArrowLeft, Trash2, ImageIcon, Loader2, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Data } from './data'

export default function RemBgForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFile(files[0])
      setPreview(URL.createObjectURL(files[0]))
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []}, 
    multiple: false 
  })

  const processImage = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("image", file)
    
    try {
      const res = await fetch("https://baadjis-utilitybox.hf.space/api/rembg", {
        method: "POST",
        headers: { "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" },
        body: formData
      })
      const data = await res.json()
      if (data.image_base64) {
        setResult(`data:image/png;base64,${data.image_base64}`)
      }
    } catch (e) { 
      alert(lang === 'fr' ? "Erreur de connexion au moteur IA" : "Error connecting to AI engine") 
    }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
      
      {/* NAVIGATION */}
      <div className="flex justify-between items-center mb-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t.back}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- COLONNE GAUCHE : INPUT --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
              {t.sub}
            </p>
          </div>

          {!preview ? (
            <div {...getRootProps()} className={`
              relative border-4 border-dashed rounded-[3rem] p-12 md:p-20 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[0.98]' 
                : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-slate-800/50'}
            `}>
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Upload className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.drop}</h3>
              <p className="text-gray-400 dark:text-slate-500 font-medium">{t.drop_sub}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in duration-300">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <Image src={preview} alt="Preview" fill className="object-contain" />
                <button 
                  onClick={() => {setPreview(null); setFile(null); setResult(null);}} 
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {setPreview(null); setFile(null); setResult(null);}} 
                  className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                >
                  {lang === 'fr' ? 'Changer l\'image' : 'Change image'}
                </button>
                <button 
                  onClick={processImage} 
                  disabled={loading} 
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  {loading ? t.btn_loading : t.btn_run}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400 w-6 h-6 flex-shrink-0" />
            <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed italic">
              {t.privacy}
            </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : RESULTAT --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 min-h-[500px] flex items-center justify-center relative overflow-hidden transition-colors">
            
            {result ? (
              <div className="p-8 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Damier de transparence pro */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 shadow-2xl border border-gray-100 dark:border-slate-700" 
                  style={{
                    backgroundImage: 'conic-gradient(#e5e7eb 25%, #ffffff 0 50%, #e5e7eb 0 75%, #ffffff 0)', 
                    backgroundSize: '20px 20px'
                  }}>
                  <Image src={result} alt="Result" fill className="object-contain" />
                </div>
                <a 
                  href={result} 
                  download={t.filename} 
                  className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-center shadow-xl shadow-green-100 dark:shadow-none flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 no-underline"
                >
                  <Download className="w-6 h-6" /> {t.btn_dl}
                </a>
              </div>
            ) : (
              <div className="text-center p-12 space-y-4">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                    <ImageIcon className="w-8 h-8 text-gray-300 dark:text-slate-700" />
                </div>
                <p className="text-gray-400 dark:text-slate-600 font-bold italic">{t.result_wait}</p>
              </div>
            )}

            {/* OVERLAY CHARGEMENT */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                    <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
                    <p className="font-black text-indigo-600 dark:text-indigo-400 animate-pulse uppercase tracking-[0.2em] text-xs">
                        {lang === 'fr' ? 'Analyse des pixels...' : 'Analyzing pixels...'}
                    </p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}