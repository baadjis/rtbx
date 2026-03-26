import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  ArrowRight, Zap, Shield, Globe, 
  Users, QrCode, Tag, Barcode, 
  Contact, MessageCircle, Image as ImageIcon, 
  Wifi, Link2, 
  Star,
  Ticket,
  Gift
} from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const DICT = {
  fr: {
    nav_blog: "Blog", nav_guide: "Guide", nav_faq: "FAQ", nav_about: "À Propos",
    hero_title: "Générez et Transformez en un clic",
    hero_sub: "RetailBox est la plateforme technique de référence pour les commerçants, entrepreneurs et créateurs. Nous simplifions votre gestion logistique et votre marketing digital grâce à des outils de génération haute performance accessibles sans installation.",
    cta_start: "Démarrer maintenant",
    cta_login: "Mon Espace Pro",
    cta_register: "S'inscrire gratuitement",
    services_title: "Nos services techniques pour votre business",
    services_sub: "Découvrez notre suite logicielle gratuite conçue pour optimiser vos points de vente et votre visibilité en ligne. Des solutions conformes aux standards industriels (EAN, ISO, RGPD).",
    btn_open: "Ouvrir l'outil",
    feat1_title: "Vitesse & Performance Cloud",
    feat1_desc: "Une infrastructure optimisée pour une exécution immédiate. Nos algorithmes de génération et notre moteur IA de détourage traitent vos requêtes en quelques millisecondes pour une productivité sans compromis, même sur mobile.",
    feat2_title: "Conforme RGPD",
    feat2_desc: "Transparence et sécurité. Nous stockons uniquement l'essentiel pour vos statistiques et outils pro. Vos fichiers sont traités en mémoire vive (RAM) de manière éphémère.",
    feat3_title: "Standards Professionnels HD",
    feat3_desc: "Tous nos fichiers (PNG, PDF) sont générés en haute définition. Nos codes-barres respectent les normes GS1 pour une lecture laser sans erreur en caisse.",
    
    services_list: [
      { 
        id: "users", 
        title: "Identité Digitale Pro", 
        desc: "Optimisez votre présence omnicanale en centralisant tous vos points de contact. Regroupez vos réseaux sociaux (Facebook, Instagram, TikTok) et vos liens de vente directe dans un seul QR Code 'Social Card' unique. C'est l'outil indispensable pour convertir vos clients physiques en abonnés digitaux et centraliser votre image de marque sur un support unique haute définition.", 
        link: "/tools/digital-id", 
        icon: Users 
      },
      { 
        id: "qr", 
        title: "Générateur QR Code HD", 
        desc: "Créez des QR Codes professionnels personnalisés pour vos menus de restaurant, vos catalogues PDF ou vos sites web. Notre outil utilise le niveau de correction d'erreur 'H' pour intégrer votre logo au centre sans perte de lisibilité. Personnalisez les couleurs selon votre charte graphique et téléchargez un fichier haute résolution prêt pour une impression de qualité sur tous supports.", 
        link: "/tools/qrcode", 
        icon: QrCode 
      },
      { 
        id: "tag", 
        title: "Étiquettes Soldes & Prix", 
        desc: "Simplifiez vos périodes de promotion et vos inventaires. Générez des étiquettes de soldes conformes avec affichage du prix d'origine barré et du prix remisé. Le système intègre automatiquement un code-barres EAN-13 lisible. Pour une productivité maximale, téléchargez vos créations en planches PDF A4 prêtes pour vos feuilles d'autocollants standards de 24 étiquettes.", 
        link: "/tools/soldes", 
        icon: Tag 
      },
      { 
        id: "bc", 
        title: "Barcode Expert EAN-13", 
        desc: "Générez des codes-barres standards EAN-13 pour la vente au détail ou Code 128 pour votre logistique interne et gestion d'entrepôt. Notre moteur calcule instantanément le 13ème chiffre de contrôle (checksum) pour garantir la conformité GS1 de vos stocks. Idéal pour professionnaliser l'étiquetage de vos produits artisanaux et assurer une lecture laser sans faille lors du passage en caisse.", 
        link: "/tools/barcode", 
        icon: Barcode 
      },
      { 
        id: "vcard", 
        title: "VCard : Carte de Visite", 
        desc: "Adoptez le networking digital avec la VCard 3.0. Saisissez vos coordonnées professionnelles (nom, téléphone, e-mail, boutique, lien LinkedIn) pour générer un QR Code de contact intelligent. Lors du scan, votre client peut enregistrer votre fiche complète directement dans son répertoire smartphone, éliminant ainsi les pertes liées aux cartes de visite papier traditionnelles.", 
        link: "/tools/vcard", 
        icon: Contact 
      },
      { 
        id: "wa", 
        title: "QR WhatsApp Direct", 
        desc: "Automatisez vos prises de commandes et votre support client. Générez un lien QR direct qui ouvre instantanément une discussion WhatsApp avec votre boutique. Vous pouvez pré-remplir un message automatique (ex: 'Je souhaite commander cet article') pour qualifier vos prospects dès le premier scan et réduire considérablement le temps de réponse de votre service client.", 
        link: "/tools/whatsapp", 
        icon: MessageCircle 
      },
      { 
        id: "short", 
        title: "Shortener Pro & Stats", 
        desc: "Réduisez vos URLs de boutique Shopify, Amazon ou Vinted en liens courts mémorisables 'rtbx.space/s/votre-nom'. Suivez l'engagement de vos clients avec un compteur de clics en temps réel. Notre solution est 100% conforme au RGPD car elle utilise une mesure d'audience anonymisée, vous offrant des statistiques précises sans collecter de données personnelles intrusives.", 
        link: "/tools/shortener", 
        icon: Link2 
      },
      { 
        id: "bg", 
        title: "RemBg IA : Détourage", 
        desc: "Améliorez le taux de conversion de vos fiches produits grâce à l'intelligence artificielle. Notre algorithme de vision par ordinateur analyse vos photos et supprime l'arrière-plan avec une précision chirurgicale en moins de 10 secondes. Obtenez un fichier PNG transparent haute définition de qualité studio, idéal pour vos boutiques en ligne, vos catalogues ou vos réseaux sociaux professionnels.", 
        link: "/tools/rembg", 
        icon: ImageIcon 
      },
      { 
        id: "wifi", 
        title: "QR Code Accès Wi-Fi", 
        desc: "Offrez un service premium à vos clients en magasin. Générez un QR Code Wi-Fi sécurisé suivant le protocole chiffré WIFI:S:. Vos visiteurs n'ont qu'à scanner le code avec leur appareil photo pour se connecter instantanément à votre réseau invité sans aucune saisie manuelle de mot de passe complexe, améliorant ainsi leur satisfaction et leur confort en boutique.", 
        link: "/tools/wifi", 
        icon: Wifi 
      },
      { 
        id: "google-review", 
        title: "Booster d'Avis Google", 
        desc: "Propulsez votre SEO local et votre classement sur Google Maps. Utilisez notre technologie de détection de 'Place ID' pour générer un QR Code magique qui ouvre directement la fenêtre de rédaction d'avis avec 5 étoiles pré-sélectionnées. En supprimant la friction pour vos clients satisfaits, vous multipliez par trois vos chances de récolter des avis positifs et d'attirer de nouveaux clients locaux.", 
        link: "/tools/google-reviews", 
        icon: Star 
      },
         { 
  id: "loyalty", 
  title: "Smart Loyalty", 
  desc: "Générez des cartes de fidélité digitales. Vos clients gardent leur QR, vous scannez pour tamponner. Zéro papier.", 
  link: "#", 
  icon: Gift, // Importe 'Gift' de lucide
  isComingSoon: true,
  badge: "BETA"
},
{ 
  id: "promo", 
  title: "Codes Promo Pro", 
  desc: "Créez et suivez des codes promotionnels pour vos campagnes. Mesurez l'efficacité de vos offres en un clic.", 
  link: "#", 
  icon: Ticket, // Importe 'Ticket' de lucide
  isComingSoon: true,
  badge: "SOON"
},
    ]
  },
  en: {
    nav_blog: "Blog", nav_guide: "Guide", nav_faq: "FAQ", nav_about: "About",
    hero_title: "Generate and Transform in one click",
    hero_sub: "RetailBox is the leading technical platform for merchants, entrepreneurs, and creators. We streamline your logistics and digital marketing with high-performance generation tools accessible without installation.",
    cta_start: "Get Started Now",
    cta_login: "Pro Dashboard",
    cta_register: "Sign up for free",
    services_title: "Free professional tools for your business",
    services_sub: "Explore our free software suite designed to optimize your retail locations and online presence. Technical solutions compliant with industry standards (EAN, ISO, GDPR).",
    btn_open: "Open Tool",
    feat1_title: "Cloud Performance & Speed",
    feat1_desc: "A cloud-native architecture engineered for immediate execution. Our generation algorithms and AI background removal engine process your requests in milliseconds, ensuring high productivity on both desktop and mobile.",
    feat2_title: "GDPR Compliant",
    feat2_desc: "Transparency and security. We only store the essentials for your analytics and pro tools. Your files are processed in RAM and deleted instantly.",
    feat3_title: "Professional HD Standards",
    feat3_desc: "All generated files (PNG, PDF) are high-definition. Our barcodes comply with GS1 standards for error-free laser scanning at checkouts.",

    services_list: [
      { 
        id: "users", 
        title: "Pro Digital Identity", 
        desc: "Optimize your omnichannel presence by centralizing all touchpoints. Group your social networks (Facebook, Instagram, TikTok) and direct sales links into a single unique 'Social Card' QR Code. It's the essential tool for converting physical visitors into digital followers and centralizing your brand identity on a high-definition platform.", 
        link: "/tools/digital-id", 
        icon: Users 
      },
      { 
        id: "qr", 
        title: "HD QR Code Generator", 
        desc: "Create professional custom QR Codes for your restaurant menus, PDF catalogs, or websites. Our tool uses 'H' level error correction, allowing you to embed your logo in the center without losing scannability. Customize colors to match your brand identity and download a high-resolution file ready for professional printing on any material.", 
        link: "/tools/qrcode", 
        icon: QrCode 
      },
      { 
        id: "tag", 
        title: "Sale & Price Labels", 
        desc: "Simplify your promotion periods and inventory tasks. Generate compliant sale labels displaying the original crossed-out price and the discounted price. The system automatically integrates a readable EAN-13 barcode. For maximum productivity, download your creations in A4 PDF sheets ready for standard 24-label adhesive sticker sheets.", 
        link: "/tools/soldes", 
        icon: Tag 
      },
      { 
        id: "bc", 
        title: "EAN-13 Barcode Expert", 
        desc: "Generate standard EAN-13 barcodes for retail or Code 128 for internal logistics and warehouse management. Our engine instantly calculates the 13th check digit to ensure GS1 compliance for your inventory. Perfect for professionalizing your handmade product labeling and ensuring flawless laser scanning at any checkout counter.", 
        link: "/tools/barcode", 
        icon: Barcode 
      },
      { 
        id: "vcard", 
        title: "VCard: Business Card", 
        desc: "Embrace digital networking with the VCard 3.0 standard. Enter your professional details (name, phone, email, shop, LinkedIn link) to generate a smart contact QR Code. Upon scanning, your client can save your full profile directly to their smartphone address book, eliminating the waste and errors of traditional paper business cards.", 
        link: "/tools/vcard", 
        icon: Contact 
      },
      { 
        id: "wa", 
        title: "Direct WhatsApp QR", 
        desc: "Automate your order-taking and customer support. Generate a direct QR link that instantly opens a WhatsApp chat with your shop. You can pre-fill an automatic message (e.g., 'I want to order this item') to qualify leads from the first scan and significantly reduce your customer service response time.", 
        link: "/tools/whatsapp", 
        icon: MessageCircle 
      },
      { 
        id: "short", 
        title: "Shortener Pro & Stats", 
        desc: "Shorten your long Shopify, Amazon, or Vinted URLs into memorable 'rtbx.space/s/your-name' links. Track your customer engagement with a real-time click counter. Our solution is 100% GDPR compliant as it uses anonymous audience measurement, providing accurate stats without collecting intrusive personal data.", 
        link: "/tools/shortener", 
        icon: Link2 
      },
      { 
        id: "bg", 
        title: "AI RemBg: Removal", 
        desc: "Boost your product listing conversion rates using artificial intelligence. Our computer vision algorithm analyzes your photos and removes the background with surgical precision in under 10 seconds. Get a studio-quality 32-bit transparent PNG, ideal for your online stores, catalogs, or professional social media feeds.", 
        link: "/tools/rembg", 
        icon: ImageIcon 
      },
      { 
        id: "wifi", 
        title: "Wi-Fi Access QR Code", 
        desc: "Provide a premium service to your in-store customers. Generate a secure Wi-Fi QR Code following the WIFI:S: encrypted protocol. Your visitors just scan the code with their camera to instantly connect to your guest network without typing complex passwords, boosting customer satisfaction and comfort.", 
        link: "/tools/wifi", 
        icon: Wifi 
      },
      { 
        id: "google-review", 
        title: "Google Review Booster", 
        desc: "Improve your local SEO and Google Maps ranking. Use our Place ID detection technology to generate a magic QR Code that directly opens the review window with 5 stars pre-selected. By removing friction for satisfied customers, you triple your chances of gaining positive reviews and attracting new local clients.", 
        link: "/tools/google-reviews", 
        icon: Star 
      },
   

{ 
  id: "loyalty", 
  title: "Smart Loyalty", 
  desc: "Generate digital loyalty cards. Your customers keep their QR, you scan to stamp. Zero paper waste.", 
  link: "#", 
  icon: Gift, 
  isComingSoon: true,
  badge: "BETA"
},
{ 
  id: "promo", 
  title: "Pro Promo Codes", 
  desc: "Create and track promotional codes for your campaigns. Measure offer effectiveness in one click.", 
  link: "#", 
  icon: Ticket, 
  isComingSoon: true,
  badge: "SOON"
}

    ]
  }
};

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header/>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center md:pt-24 md:pb-32">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent italic">
                  {t.hero_title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                  {t.hero_sub}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/tools/qrcode" 
                        className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        {t.cta_start} <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/register" 
                            className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-slate-800 rounded-2xl font-black text-lg hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                        {t.cta_register}
                    </Link>
                </div>
            </div>
        </section>

        {/* SERVICES GRID SECTION */}
       <section className="bg-slate-50/50 dark:bg-slate-900/30 py-24 border-y border-gray-100 dark:border-slate-800/50">
    <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{t.services_title}</h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">{t.services_sub}</p>
        </div>

        {/* 
            CHANGEMENT ICI : 
            On utilise 'flex flex-wrap' avec 'justify-center'. 
            Cela aligne 3 cartes par ligne sur desktop, 
            et centre la 10ème carte toute seule sur la dernière ligne.
        */}
        <div className="flex flex-wrap justify-center gap-8">
            {t.services_list.map((service) => (
                <div 
                    key={service.id} 
                    className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300 flex flex-col w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] min-w-[300px]"
                >
                    {/* ALIGNEMENT ICONE ET TITRE SUR LA MEME LIGNE */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300 flex-shrink-0">
                            <service.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{service.title}</h3>
                    </div>
                    
                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1 font-medium">
                        {service.desc}
                    </p>
                   {service.isComingSoon ? (
                <div className="w-full py-4 bg-gray-50/50 dark:bg-slate-800/30 text-gray-400 dark:text-slate-600 rounded-2xl font-bold text-sm text-center border border-dashed border-gray-200 dark:border-slate-700 cursor-not-allowed">
                    {lang === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
                </div>
            ) : (
                <Link 
                    href={service.link} 
                    className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm text-center group-hover:bg-indigo-600 group-hover:text-white transition-all no-underline border-none"
                >
                    {t.btn_open}
                </Link>
            )}
                </div>
            ))}
        </div>
    </div>
</section>

        {/* FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                {[
                    { icon: Zap, title: t.feat1_title, desc: t.feat1_desc },
                    { icon: Shield, title: t.feat2_title, desc: t.feat2_desc },
                    { icon: Globe, title: t.feat3_title, desc: t.feat3_desc },
                ].map((feat, idx) => (
                    <div key={idx} className="relative p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6">
                            <feat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feat.title}</h3>
                        </div>
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