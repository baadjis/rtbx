import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Data } from './data';
import { 
  Store, MapPin, Star, Plus, 
  Utensils, Scissors, ShoppingBag, 
  Wifi, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default async function MyBusinessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  // Récupérer les établissements de l'utilisateur
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

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

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.my_businesses}
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 font-medium mt-2">
            {businesses?.length || 0} {t.business_total}
          </p>
        </div>
        
        <Link href="/tools/google-reviews" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 no-underline">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          {t.add_business}
        </Link>
      </div>

      {/* GRILLE DES ÉTABLISSEMENTS */}
      {businesses && businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {businesses.map((biz) => {
            const style = getBusinessStyle(biz.business_type);
            return (
              <div key={biz.id} className={`group bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col ${style.border}`}>
                
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 ${style.color} rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {style.icon}
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
                    <Star size={16} fill="currentColor" /> 4.8
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {biz.name}
                  </h3>
                  <div className="flex items-start gap-2 text-gray-500 dark:text-slate-400 font-medium">
                    <MapPin size={18} className="mt-1 flex-shrink-0 text-gray-400" />
                    <p className="text-base leading-relaxed">{biz.address}</p>
                  </div>
                </div>

                {/* BOUTONS D'ACTION RAPIDE */}
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <Link href="/tools/google-reviews" className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all no-underline">
                    <MessageSquare size={16} /> QR Avis
                  </Link>
                  <Link href="/tools/wifi" className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all no-underline">
                    <Wifi size={16} /> QR WiFi
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-20 md:p-32 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Store size={48} className="text-gray-300 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.no_businesses}</h3>
            <p className="text-gray-500 dark:text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                {lang === 'fr' 
                  ? "Liez vos établissements Google Maps pour centraliser vos outils marketing et suivre vos avis." 
                  : "Link your Google Maps locations to centralize your marketing tools and track reviews."}
            </p>
            <Link href="/tools/google-reviews" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all no-underline">
                {lang === 'fr' ? 'Rechercher mon établissement' : 'Search for my business'} <ArrowRight size={20} />
            </Link>
        </div>
      )}

      {/* FOOTER INFO SEO */}
      <div className="pt-10 border-t border-gray-50 dark:border-slate-900 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Google Business Integration • {lang.toUpperCase()}
        </p>
      </div>
    </div>
  );
}