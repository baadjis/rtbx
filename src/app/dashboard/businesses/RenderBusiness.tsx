/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, MapPin, MessageSquare, Scissors, ShoppingBag, Star, Store, Utensils, Wifi } from "lucide-react";
import Link from "next/link";




 // Fonction pour obtenir l'icône et la couleur selon le type de commerce
  const getBusinessStyle = (type: string) => {
    const iconClass = "w-7 h-7";
    switch (type?.toLowerCase()) {
      case 'restaurant':
      case 'food':
      case 'cafe':
      case 'bar':
        return { 
          icon: <Utensils className={iconClass} />, 
          color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
          border: "hover:border-orange-200 dark:hover:border-orange-900/50"
        };
      case 'hair_care':
      case 'beauty_salon':
      case 'spa':
        return { 
          icon: <Scissors className={iconClass} />, 
          color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
          border: "hover:border-pink-200 dark:hover:border-pink-900/50"
        };
      case 'clothing_store':
      case 'store':
      case 'shoe_store':
        return { 
          icon: <ShoppingBag className={iconClass} />, 
          color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
          border: "hover:border-emerald-200 dark:hover:border-emerald-900/50"
        };
      default:
        return { 
          icon: <Store className={iconClass} />, 
          color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
          border: "hover:border-indigo-200 dark:hover:border-indigo-900/50"
        };
    }
  };

export default function RenderBusiness({biz}:any){
   const style = getBusinessStyle(biz.business_type);

   return (
    <div key={biz.id} className={`group bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col ${style.border}`}>

   <Link href={`/dashboard/businesses/${biz.id}`} className="no-underline flex-1 group/link">
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 ${style.color} rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover/link:scale-110 transition-transform duration-500`}>
                {style.icon}
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
                <Star size={16} fill="currentColor" /> 4.8
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors flex items-center gap-2">
                {biz.name}
                <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-indigo-600 dark:text-indigo-400" />
              </h3>
              <div className="flex items-start gap-2 text-gray-500 dark:text-slate-400 font-medium">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-gray-400" />
                <p className="text-base leading-relaxed">{biz.address}</p>
              </div>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <Link href="/tools/google-reviews" className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all no-underline">
              <MessageSquare size={16} /> QR Avis
            </Link>
            <Link href="/tools/wifi" className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all no-underline">
              <Wifi size={16} /> QR WiFi
            </Link>
          </div>
        </div>
        
        
        )


}