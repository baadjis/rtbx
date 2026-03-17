'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { QRCodeCanvas } from 'qrcode.react'
import { Link2, Copy, Download, BarChart3, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ShortenerForm({ lang }: { lang: 'fr' | 'en' }) {

    const DICT={// À ajouter dans DICT.fr et DICT.en
fr: {
  short_title: "RetailLink : Réducteur & Statistiques",
  short_sub: "Créez des URLs courtes et suivez l'engagement de vos clients en temps réel.",
  label_long_url: "Lien de destination (URL longue)",
  ph_long_url: "https://votre-boutique.com/produit-tres-long",
  label_custom_alias: "Alias personnalisé (Optionnel)",
  ph_custom_alias: "Ex: promo-printemps",
  short_info: "Laissez vide pour un code aléatoire. Pas d'espaces, uniquement lettres et chiffres.",
  btn_shorten: "🚀 Réduire et Activer",
  short_success: "✅ Votre RetailLink est prêt !",
  qr_track_info: "Ce QR Code redirige vers votre lien court et permet de compter les scans.",
  btn_copy: "Copier le lien",
  btn_dl_qr: "Télécharger le QR",
  btn_stats: "📊 Voir les statistiques",
  err_alias_taken: "❌ Cet alias est déjà utilisé. Choisissez-en un autre.",
},
en: {
  short_title: "RetailLink: Shortener & Analytics",
  short_sub: "Create short URLs and track your customer engagement in real-time.",
  label_long_url: "Destination link (Long URL)",
  ph_long_url: "https://your-shop.com/very-long-product-link",
  label_custom_alias: "Custom alias (Optional)",
  ph_custom_alias: "e.g. spring-sale",
  short_info: "Leave blank for a random code. No spaces, letters and numbers only.",
  btn_shorten: "🚀 Shorten & Activate",
  short_success: "✅ Your RetailLink is ready!",
  qr_track_info: "This QR Code redirects to your short link and tracks every scan.",
  btn_copy: "Copy link",
  btn_dl_qr: "Download QR",
  btn_stats: "📊 View Analytics",
  err_alias_taken: "❌ This alias is already taken. Please try another.",
}}
  const t = DICT[lang]
  const [loading, setLoading] = useState(false)
  const [longUrl, setLongUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ shortLink: string, code: string } | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Définir le code (alias ou aléatoire)
    let code = customAlias.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    if (!code) {
      code = Math.random().toString(36).substring(2, 8)
    }

    // 2. Vérifier si l'alias existe
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

    // 3. Insérer dans Supabase
    const { error: insertError } = await supabase
      .from('links')
      .insert([{ 
        short_code: code, 
        long_url: longUrl,
        clicks: 0
      }])

    if (insertError) {
      setError("Erreur technique base de données.")
    } else {
      setResult({
        shortLink: `https://rtbx.space/s/${code}`,
        code: code
      })
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortLink)
      alert(lang === 'fr' ? "Lien copié !" : "Link copied!")
    }
  }

  const downloadQR = () => {
    const canvas = document.getElementById('short-qr-canvas') as HTMLCanvasElement
    const pngUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `qr-link-${result?.code}.png`
    downloadLink.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {lang === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- FORMULAIRE --- */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
              {t.short_title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.short_sub}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Link2 className="w-4 h-4" /> {t.label_long_url}
              </label>
              <input 
                type="url" required value={longUrl}
                onChange={e => setLongUrl(e.target.value)}
                placeholder={t.ph_long_url}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.label_custom_alias}</label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 font-bold border-r border-gray-200 pr-3">rtbx.space/s/</span>
                <input 
                  type="text" value={customAlias}
                  onChange={e => setCustomAlias(e.target.value)}
                  placeholder={t.ph_custom_alias}
                  className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold text-gray-900"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase ml-2">{t.short_info}</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm border border-red-100">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? (lang === 'fr' ? 'Activation...' : 'Activating...') : t.btn_shorten}
            </button>
          </form>
        </div>

        {/* --- PREVIEW STICKY --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 text-center flex flex-col items-center">
            {result ? (
              <div className="w-full animate-in fade-in zoom-in duration-500">
                <div className="p-8 bg-white rounded-[2.5rem] mb-8 border border-gray-50 shadow-inner relative">
                  <QRCodeCanvas 
                    id="short-qr-canvas"
                    value={result.shortLink} 
                    size={240} 
                    level="H" 
                    includeMargin={true}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t.short_success}</h3>
                
                <div className="space-y-3 w-full">
                  <div className="p-4 bg-indigo-50 rounded-2xl font-black text-indigo-600 break-all mb-4 border border-indigo-100">
                    {result.shortLink}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={copyToClipboard} className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
                      <Copy className="w-4 h-4" /> {t.btn_copy}
                    </button>
                    <button onClick={downloadQR} className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
                      <Download className="w-4 h-4" /> {t.btn_dl_qr}
                    </button>
                  </div>
                  
                  <Link href={`/stats/${result.code}`} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all">
                    <BarChart3 className="w-5 h-5" /> {t.btn_stats}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-20 opacity-30 text-center space-y-4">
                <Link2 className="w-16 h-16 mx-auto text-gray-300" />
                <p className="font-bold italic">{lang === 'fr' ? "En attente de votre lien..." : "Waiting for your link..."}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}