import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { 
  ArrowRight, Zap, Shield, Globe, 
  Users, QrCode, Tag, Barcode, 
  Contact, MessageCircle, Image as ImageIcon, 
  Wifi, Link2 
} from 'lucide-react';
import Footer from '@/components/Footer';

const DICT = {
  fr: {
    hero_title: "Générez et Transformez en un clic",
    hero_sub: "La boîte à outils indispensable pour les commerçants, entrepreneurs et créateurs.",
    cta_start: "Démarrer maintenant",
    cta_login: "Mon Espace Pro",
    cta_register: "S'inscrire gratuitement",
    services_title: "Nos outils gratuits pour votre business",
    services_sub: "Des solutions techniques haute performance, sans installation et 100% sécurisées.",
    btn_open: "Ouvrir l'outil",
    feat1_title: "Rapide & Gratuit",
    feat1_desc: "Outils optimisés pour une utilisation instantanée sans aucun délai.",
    feat2_title: "Conforme RGPD",
    feat2_desc: "La protection de vos données est notre priorité. Zéro stockage serveur.",
    feat3_title: "Haute Définition",
    feat3_desc: "Fichiers conformes aux standards pro pour une impression parfaite.",
    services_list: [
      { id: "users", title: "Identité Digitale", desc: "Regroupez vos réseaux sociaux (Facebook, Instagram, TikTok) dans un QR Code unique.", link: "https://baadjis-utilitybox.hf.space/digital-id", icon: Users },
      { id: "qr", title: "QR Code Pro", desc: "Générez un QR Code personnalisé avec votre logo pour vos menus ou sites web.", link: "https://baadjis-utilitybox.hf.space/qr-tab", icon: QrCode },
      { id: "tag", title: "Étiquettes Soldes", desc: "Créez vos étiquettes de soldes avec prix barré et code-barres prêtes à l'impression.", link: "https://baadjis-utilitybox.hf.space/soldes", icon: Tag },
      { id: "bc", title: "Barcode Expert", desc: "Générez des codes-barres EAN-13 et Code 128 pro pour la gestion de vos stocks.", link: "https://baadjis-utilitybox.hf.space/barcode-tab", icon: Barcode },
      { id: "vcard", title: "VCard Contact", desc: "Créez un QR Code de contact pour permettre à vos clients d'enregistrer votre fiche d'un scan.", link: "https://baadjis-utilitybox.hf.space/vcard", icon: Contact },
      { id: "wa", title: "QR WhatsApp", desc: "Générez un lien QR direct pour ouvrir instantanément une discussion avec vos clients.", link: "https://baadjis-utilitybox.hf.space/whatsapp-qr", icon: MessageCircle },
      { id: "short", title: "Shortener Pro", desc: "Réduisez vos URLs de boutique et suivez le nombre de clics sur rtbx.space.", link: "https://baadjis-utilitybox.hf.space/shortener/shortener", icon: Link2 },
      { id: "bg", title: "RemBg IA", desc: "Supprimez automatiquement le fond de vos photos produits pour Shopify ou Vinted.", link: "https://baadjis-utilitybox.hf.space/rembg-tab", icon: ImageIcon },
      { id: "wifi", title: "Accès Wi-Fi", desc: "Offrez une connexion Wi-Fi sécurisée à vos clients sans saisie de mot de passe.", link: "https://baadjis-utilitybox.hf.space/wifi-qr", icon: Wifi },
    ]
  },
  en: {
    hero_title: "Generate and Transform in one click",
    hero_sub: "The essential toolkit for retailers, entrepreneurs, and creators.",
    cta_start: "Get Started Now",
    cta_login: "Pro Dashboard",
    cta_register: "Sign up for free",
    services_title: "Free tools for your business",
    services_sub: "High-performance technical solutions, no installation required, 100% secure.",
    btn_open: "Open Tool",
    feat1_title: "Fast & Free",
    feat1_desc: "High-performance tools optimized for instant results.",
    feat2_title: "GDPR Compliant",
    feat2_desc: "Your data privacy is our priority. Zero server storage.",
    feat3_title: "High Definition",
    feat3_desc: "Professional standard files ready for perfect printing.",
    services_list: [
      { id: "users", title: "Digital Identity", desc: "Group your social networks (Facebook, Instagram, TikTok) into a single QR Code.", link: "https://baadjis-utilitybox.hf.space/digital-id", icon: Users },
      { id: "qr", title: "QR Code Pro", desc: "Generate a custom QR Code with your logo for menus or websites.", link: "https://baadjis-utilitybox.hf.space/qr-tab", icon: QrCode },
      { id: "tag", title: "Sale Labels", desc: "Create sale labels with crossed-out prices and barcodes ready to print.", link: "https://baadjis-utilitybox.hf.space/soldes", icon: Tag },
      { id: "bc", title: "Barcode Expert", desc: "Generate professional EAN-13 and Code 128 barcodes for inventory.", link: "https://baadjis-utilitybox.hf.space/barcode-tab", icon: Barcode },
      { id: "vcard", title: "VCard Contact", desc: "Create a contact QR Code to allow clients to save your info with one scan.", link: "https://baadjis-utilitybox.hf.space/vcard", icon: Contact },
      { id: "wa", title: "QR WhatsApp", desc: "Generate a direct QR link to instantly open a chat with your customers.", link: "https://baadjis-utilitybox.hf.space/whatsapp-qr", icon: MessageCircle },
      { id: "short", title: "Shortener Pro", desc: "Shorten your store URLs and track clicks in real-time on rtbx.space.", link: "https://baadjis-utilitybox.hf.space/shortener", icon: Link2 },
      { id: "bg", title: "AI RemBg", desc: "Automatically remove backgrounds from product photos for Shopify or Vinted.", link: "https://baadjis-utilitybox.hf.space/rembg-tab", icon: ImageIcon },
      { id: "wifi", title: "Wi-Fi Access", desc: "Offer secure Wi-Fi connection to your customers without manual password entry.", link: "https://baadjis-utilitybox.hf.space/wifi-qr", icon: Wifi },
    ]
  }
};

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.08) 0px, transparent 50%)'}}>
      
      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <BrandLogo />
        <Link href="/login" className="text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
          {t.cta_login}
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
            <div className="max-w-4xl mx-auto">
                {/* TITRE AVEC GRADIENT */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {t.hero_title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                  {t.hero_sub}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="https://baadjis-utilitybox.hf.space" 
                        className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        {t.cta_start} <ArrowRight className="w-5 h-5" />
                    </a>
                    <Link href="/register" 
                            className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-slate-800 rounded-2xl font-black text-lg hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                        {t.cta_register}
                    </Link>
                </div>
            </div>
        </section>

        {/* SERVICES GRID SECTION - Nuance de fond pour le contraste */}
        <section className="bg-slate-50/50 dark:bg-slate-900/30 py-24 border-y border-gray-100 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">{t.services_title}</h2>
                    <p className="text-gray-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">{t.services_sub}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {t.services_list.map((service) => (
                        <div key={service.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300 flex flex-col">
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                                <service.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                {service.desc}
                            </p>
                            <a href={service.link} className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm text-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {t.btn_open}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                {[
                    { icon: Zap, title: t.feat1_title, desc: t.feat1_desc },
                    { icon: Shield, title: t.feat2_title, desc: t.feat2_desc },
                    { icon: Globe, title: t.feat3_title, desc: t.feat3_desc },
                ].map((feat, idx) => (
                    <div key={idx} className="relative p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
                        <feat.icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-6" />
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feat.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                ))}
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}