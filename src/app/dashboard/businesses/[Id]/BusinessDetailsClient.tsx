/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { Star, MapPin, ExternalLink, MessageSquare, Loader2 } from 'lucide-react'
import Script from 'next/script'
import Link from 'next/link'

export default function BusinessDetailsClient({ business, t, lang }: { business: any, t: any, lang: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGoogleData = () => {
    if (!window.google || !business.place_id) return
    
    const service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails({
      placeId: business.place_id,
      fields: ['review', 'rating', 'user_ratings_total']
    }, (place: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setReviews(place.reviews || [])
      }
      setLoading(false)
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onReady={fetchGoogleData}
      />

      {/* --- HEADER INFOS --- */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{business.name}</h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium">
                <MapPin size={18} className="text-indigo-600" />
                <span>{business.address}</span>
            </div>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${business.place_id}`}
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all no-underline text-sm border border-gray-100 dark:border-slate-700"
        >
          <ExternalLink size={16} /> {t.view_on_maps}
        </a>
      </div>

      {/* --- AVIS GOOGLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <MessageSquare className="text-indigo-600" /> {t.latest_reviews}
            </h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-50 dark:border-slate-800">
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-gray-400 font-medium italic">Connexion à Google Maps...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.length > 0 ? reviews.map((rev, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={rev.profile_photo_url} alt={rev.author_name} className="w-10 h-10 rounded-full border border-gray-100" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{rev.author_name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{rev.relative_time_description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} stroke={i < rev.rating ? "none" : "currentColor"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed font-medium line-clamp-3">
                                {rev.text}
                            </p>
                        </div>
                    )) : (
                        <div className="p-10 text-center text-gray-400 font-medium bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200">
                            {t.no_reviews}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* --- SIDEBAR : ACTIONS LOCALES --- */}
        <div className="space-y-6">
            <div className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
                <h3 className="text-xl font-black mb-6 uppercase tracking-wider">{t.stats_section}</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-indigo-200 font-bold text-sm">QR Code WiFi</span>
                        <Link href="/tools/wifi" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><ExternalLink size={16}/></Link>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-indigo-200 font-bold text-sm">QR Code Menu</span>
                        <Link href="/tools/qrcode" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><ExternalLink size={16}/></Link>
                    </div>
                </div>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] text-center">
                <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star size={32} fill="currentColor" />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t.average_rating}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white italic">4.8 <span className="text-sm text-gray-400">/ 5</span></h3>
            </div>
        </div>
      </div>
    </div>
  )
}