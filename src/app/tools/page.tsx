import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  Users, QrCode, Tag, Barcode, 
  Contact, MessageCircle, Image as ImageIcon, 
  Wifi, Link2, ArrowRight,
  Star
} from 'lucide-react';

export default async function ToolsPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  const tools = [
    { title: "Identité Digitale", en: "Digital Identity", link: "/tools/digital-id", icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { title: "QR Code Pro", en: "Pro QR Code", link: "/tools/qrcode", icon: QrCode, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
    { title: "Étiquettes Soldes", en: "Sale Labels", link: "/tools/soldes", icon: Tag, color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" },
    { title: "Barcode Expert", en: "Barcode Expert", link: "/tools/barcode", icon: Barcode, color: "bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400" },
    { title: "VCard Contact", en: "VCard Contact", link: "/tools/vcard", icon: Contact, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { title: "QR WhatsApp", en: "QR WhatsApp", link: "/tools/whatsapp", icon: MessageCircle, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
    { title: "Shortener Pro", en: "URL Shortener", link: "/tools/shortener", icon: Link2, color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" },
    { title: "RemBg IA", en: "AI RemBg", link: "/tools/rembg", icon: ImageIcon, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { title: "Accès Wi-Fi", en: "Wi-Fi Access", link: "/tools/wifi", icon: Wifi, color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400" },
    { 
  title: "Avis Google", 
  en: "Google Reviews", 
  link: "/tools/google-reviews", 
  icon: Star, 
  color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" 
}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-10 transition-colors duration-300">
      
      {/* HEADER DE LA PAGE */}
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
          {lang === 'fr' ? 'Votre Boîte à Outils' : 'Your Toolset'}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
          {lang === 'fr' 
            ? 'Sélectionnez un service professionnel pour commencer à créer vos supports.' 
            : 'Select a professional service to start creating your marketing materials.'}
        </p>
      </div>

      {/* GRILLE DES SERVICES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {tools.map((tool, idx) => (
          <Link 
            key={idx} 
            href={tool.link} 
            className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 flex flex-col items-start no-underline"
          >
            {/* ICON CONTAINER */}
            <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <tool.icon size={32} strokeWidth={2.5} />
            </div>

            {/* TEXTS */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {lang === 'fr' ? tool.title : tool.en}
            </h3>
            
            {/* LAUNCH BUTTON - Visible par défaut sur mobile, anime sur desktop */}
            <div className="mt-4 flex items-center gap-2 text-sm font-black text-indigo-600 dark:text-indigo-400 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 uppercase tracking-widest">
               {lang === 'fr' ? 'Lancer' : 'Launch'} 
               <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER TEXT POUR ADSENSE */}
      <div className="pt-12 border-t border-gray-50 dark:border-slate-900 text-center">
        <p className="text-sm text-gray-400 dark:text-slate-600 font-bold uppercase tracking-[0.2em]">
            RetailBox Engineering • {lang.toUpperCase()}
        </p>
      </div>
    </div>
  );
}