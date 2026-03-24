/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Search, Star, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { createBrowserClient } from '@supabase/ssr' // Ajout de Supabase
import { Data } from './data'

export default function ReviewForm({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang]
  const [placeId, setPlaceId] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [address, setAddress] = useState('')
  const [isScriptReady, setIsScriptReady] = useState(false)
  const [isSaved, setIsSaved] = useState(false) // Etat pour confirmer la sauvegarde
  const autoCompleteRef = useRef<HTMLInputElement>(null)

  // Initialisation du client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fonction pour sauvegarder le business en base de données
  // 1. Dans la fonction initAutocomplete, ajoute "types" dans les fields :
const initAutocomplete = () => {
  if (!autoCompleteRef.current || !window.google) return

  const autocomplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
    fields: ["place_id", "name", "formatted_address", "types"], // AJOUT DE "types" ICI
    types: ["establishment"]
  })

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace()
    if (place.place_id) {
      // On récupère le type principal (souvent le premier de la liste)
      const primaryType = place.types ? place.types[0] : 'establishment';
      
      setPlaceId(place.place_id)
      setBusinessName(place.name || '')
      setAddress(place.formatted_address || '')
      
      // On envoie le type à la fonction de sauvegarde
      saveToDatabase({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        business_type: primaryType // ON PASSE LE TYPE
      })
    }
  })
}

// 2. Met à jour la fonction saveToDatabase :
const saveToDatabase = async (place: any) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user && place.place_id) {
    await supabase.from('businesses').upsert({
      user_id: user.id,
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      business_type: place.business_type // SAUVEGARDE EN BASE
    }, { onConflict: 'user_id, place_id' })
    setIsSaved(true)
  }
}

  const downloadQR = () => {
    const canvas = document.getElementById('review-qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `google-review-${businessName || 'retailbox'}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onReady={() => {
          setIsScriptReady(true)
          initAutocomplete()
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-8 transition-colors no-underline">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
                {t.rev_title}
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{t.rev_sub}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
              
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4" /> {t.label_search}
                </label>
                <div className="relative">
                    <input 
                      ref={autoCompleteRef}
                      type="text" 
                      placeholder={!isScriptReady ? t.search_loading : t.ph_search}
                      disabled={!isScriptReady}
                      className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {businessName && (
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-left-4 flex justify-between items-center">
                    <div>
                        <h4 className="font-black text-indigo-600 dark:text-indigo-400 mb-1">{businessName}</h4>
                        <p className="text-xs text-indigo-400 font-medium">{address}</p>
                    </div>
                    {isSaved && (
                        <div className="flex flex-col items-center text-green-500">
                            <CheckCircle2 size={20} />
                            <span className="text-[10px] font-black uppercase mt-1">Sauvé</span>
                        </div>
                    )}
                </div>
              )}

              <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
                  <Star className="w-6 h-6 text-amber-500 flex-shrink-0 fill-amber-500" />
                  <p className="text-sm text-amber-900 dark:text-amber-200 font-medium italic leading-relaxed">
                    {t.rev_tip}
                  </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
              
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group">
                <QRCodeCanvas 
                  id="review-qr-canvas"
                  value={placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : "RetailBox Google Reviews"} 
                  size={260} 
                  level="H" 
                  includeMargin={true}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-50 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                  {lang === 'fr' ? 'Prêt pour vos clients' : 'Ready for customers'}
              </h3>
              <p className="text-gray-400 dark:text-slate-500 font-bold text-sm mb-10 uppercase tracking-widest">
                  {businessName || t.no_place}
              </p>
              
              <button 
                  onClick={downloadQR}
                  disabled={!placeId}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95 border-none cursor-pointer"
              >
                <Download className="w-6 h-6" /> {t.btn_dl_rev}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}