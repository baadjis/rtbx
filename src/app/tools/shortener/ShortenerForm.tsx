/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { QRCodeCanvas } from 'qrcode.react'
import { Link2, Copy, Download, BarChart3, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { Data } from './data'

export default function ShortenerForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [loading, setLoading] = useState(false)
  const [longUrl, setLongUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ shortLink: string, code: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Récupérer l'utilisateur pour lier le lien au compte
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Définir le code (alias ou aléatoire 4 car.)
    let code = customAlias.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    if (!code) {
      code = Math.random().toString(36).substring(2, 6)
    }

    try {
      // 2. Vérifier si l'alias existe déjà
      const { data: existing } = await supabase
        .from('links')
        .select('short_code')
        .eq('short_code', code)
        .single()

      if (existing) {
        setError(t.err_alias_taken)
        setLoading(false)
        return
      }

      // 3. Insérer dans Supabase avec le user_id si connecté
      const { error: insertError } = await supabase
        .from('links')
        .insert([{ 
          short_code: code, 
          long_url: longUrl,
          clicks: 0,
          user_id: userId // Permet l'affichage dans le dashboard
        }])

      if (insertError) throw insertError

      setResult({
        shortLink: `https://rtbx.space/s/${code}`,
        code: code
      })
    } catch (err: any) {
      setError(lang === 'fr' ? "Erreur technique : " + err.message : "Technical error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortLink)
      alert(lang === 'fr' ? "Lien copié !" : "Link copied!")
    }
  }

  const downloadQR = () => {
    const canvas = document.getElementById('short-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const pngUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `qr-link-${result?.code}.png`
    downloadLink.click()
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
                {t.short_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                {t.short_sub}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8 transition-colors">
              
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> {t.label_long_url}
                </label>
                <input 
                  type="url" required value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                  placeholder={t.ph_long_url}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-4 h-4" /> {t.label_custom_alias}
                </label>
                <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-2xl px-4 border border-transparent focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <span className="text-gray-400 dark:text-slate-500 font-black border-r border-gray-200 dark:border-slate-700 pr-3 text-sm md:text-base">rtbx.space/s/</span>
                  <input 
                    type="text" value={customAlias}
                    onChange={e => setCustomAlias(e.target.value)}
                    placeholder={t.ph_custom_alias}
                    className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase ml-2">{t.short_info}</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 font-bold text-sm border border-red-100 dark:border-red-900/30">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                {loading ? (lang === 'fr' ? 'Activation...' : 'Activating...') : t.btn_shorten}
              </button>
            </form>
          </div>

          {/* --- COLONNE DROITE : PREVIEW --- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              {result ? (
                <div className="w-full animate-in fade-in zoom-in duration-500">
                  {/* QR DOIT RESTER SUR FOND BLANC POUR SCAN */}
                  <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                    <QRCodeCanvas 
                      id="short-qr-canvas"
                      value={result.shortLink} 
                      size={240} 
                      level="H" 
                      includeMargin={true}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform">
                      <Link2 className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">{t.short_success}</h3>
                  
                  <div className="space-y-4 w-full">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl font-black text-indigo-600 dark:text-indigo-400 break-all border border-indigo-100 dark:border-indigo-800 transition-colors">
                      {result.shortLink}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button onClick={copyToClipboard} className="py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                        <Copy className="w-4 h-4" /> {t.btn_copy}
                      </button>
                      <button onClick={downloadQR} className="py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                        <Download className="w-4 h-4" /> {t.btn_dl_qr}
                      </button>
                    </div>
                    
                    <Link href={`/stats/${result.code}`} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-all no-underline">
                      <BarChart3 className="w-5 h-5" /> {t.btn_stats}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-colors">
                    <Link2 className="w-10 h-10 text-gray-300 dark:text-slate-700" />
                  </div>
                  <p className="font-bold text-gray-400 dark:text-slate-600 italic">
                    {lang === 'fr' ? "En attente de votre lien..." : "Waiting for your link..."}
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