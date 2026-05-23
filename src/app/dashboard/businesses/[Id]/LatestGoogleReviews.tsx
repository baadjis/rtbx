/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
export function LatestGoogleReviews(
    {t,reviews,loading}:{
    t:any,reviews:any[],loading:boolean
}){
    return(
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
        </div>)
}