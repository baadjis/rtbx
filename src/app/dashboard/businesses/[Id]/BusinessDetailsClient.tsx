/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import  Image  from 'next/image'
import { 
  Star, MapPin, ExternalLink, MessageSquare, 
  Loader2, Users, Award, Zap, 
  ArrowRight, QrCode, TrendingUp 
} from 'lucide-react'
import Script from 'next/script'
import Link from 'next/link'

interface Props {
  business: any;
  t: any;
  lang: string;
  loyaltyStats: {
    totalCustomers: number;
    totalPoints: number;
  };
  history: any[];
}

export default function BusinessDetailsClient({ business, t, lang, loyaltyStats, history }: Props) {
  const [reviews, setReviews] = useState<any[]>([])
  const [googleMeta, setGoogleMeta] = useState<any>(null)
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
        setGoogleMeta({
            rating: place.rating,
            total: place.user_ratings_total
        })
      }
      setLoading(false)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-in fade-in duration-700">
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onReady={fetchGoogleData}
      />

      {/* --- SECTION 1 : HEADER & ACTIONS --- */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="text-white w-6 h-6 fill-current" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{business.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium pl-1">
                <MapPin size={18} className="text-indigo-600" />
                <span className="text-sm md:text-base">{business.address}</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            <Link href="/scan" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all no-underline text-sm">
                <QrCode size={18} /> {t.scan_customer}
            </Link>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${business.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all no-underline text-sm border border-gray-100 dark:border-slate-700"
            >
              <ExternalLink size={16} /> {t.view_on_maps}
            </a>
        </div>
      </div>

      {/* --- SECTION 2 : KPI RÉEL (FIDÉLITÉ) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_customers}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{loyaltyStats.totalCustomers}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.total_points}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{loyaltyStats.totalPoints}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group">
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Note Google</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {googleMeta ? googleMeta.rating : '--'} <span className="text-sm text-gray-400">({googleMeta?.total || 0})</span>
            </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLONNE : AVIS GOOGLE (2/3) --- */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <MessageSquare className="text-indigo-600" /> {t.latest_reviews}
            </h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-50 dark:border-slate-800 transition-colors">
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-gray-400 font-medium italic">Synchronisation Google Maps...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reviews.length > 0 ? reviews.map((rev, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <Image 
    src={rev.profile_photo_url} 
    alt={rev.author_name} 
    fill 
    className="rounded-full border border-gray-100 dark:border-slate-700 object-cover"
    unoptimized={true} // Recommandé pour les photos de profil distantes pour éviter les erreurs de cache
  />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{rev.author_name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{rev.relative_time_description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} stroke={i < rev.rating ? "none" : "currentColor"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed font-medium italic">
                                &quot;{rev.text}&quot;
                            </p>
                        </div>
                    )) : (
                        <div className="p-10 text-center text-gray-400 font-medium bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                            {t.no_reviews}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* --- SIDEBAR : ACTIVITÉ RÉCENTE (1/3) --- */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-colors">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={20} className="text-indigo-600" /> {t.recent_activity}
                </h3>
                <div className="space-y-6">
                    {history.length > 0 ? history.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                                <Users size={16} className="text-gray-400 group-hover:text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Client #{log.user_id.slice(0, 5)}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                                    {new Date(log.created_at).toLocaleDateString()} • +{log.points_added} point
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-400 italic text-center py-4">Aucun scan récent.</p>
                    )}
                </div>
                <Link href="/scan" className="w-full mt-8 py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all no-underline border-none">
                    Nouveau Scan <ArrowRight size={14} />
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}