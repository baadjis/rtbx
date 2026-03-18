import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { BookOpen, CheckCircle, Info } from 'lucide-react';

const Data = {
  fr: {
    guide_title: "Guide Complet d'Utilisation",
    guide_sub: "Maîtrisez nos outils de génération pour booster votre activité commerciale.",
    expert_title: "💡 Conseils d'Expert pour le Retail",
    expert_p: "Pour obtenir des résultats professionnels, suivez ces recommandations techniques :",
    guides: [
      { 
        title: "Générer des QR Codes Pro", 
        desc: "Pour vos menus de restaurant ou fiches produits, entrez l'URL ou vos données. Nous recommandons d'ajouter votre logo pour augmenter la confiance lors du scan. Nos codes sont en haute définition pour garantir une lecture parfaite même en basse lumière." 
      },
      { 
        title: "Identité Digitale (Social Card)", 
        desc: "Centralisez votre présence en ligne. Sélectionnez vos réseaux (Instagram, TikTok, Shopify) et créez un point d'accès unique. C'est l'outil idéal à placer en bio ou sur vos cartes de visite pour convertir vos clients en abonnés." 
      },
      { 
        title: "VCard : Carte de Visite Digitale", 
        desc: "Saisissez vos coordonnées professionnelles. Le QR Code généré au format VCard 3.0 permet à vos prospects d'enregistrer votre contact (nom, tel, email, adresse) dans leur répertoire d'un simple clic, sans erreur de saisie." 
      },
      { 
        title: "Étiquettes de Soldes & Planches A4", 
        desc: "Indiquez le prix initial et le prix remisé. Le système génère une étiquette avec prix barré et code-barres EAN-13 conforme. Vous pouvez télécharger l'image seule ou une planche PDF A4 de 24 étiquettes prête à imprimer." 
      },
      { 
        title: "Codes-barres EAN-13 et Code 128", 
        desc: "Utilisez l'EAN-13 pour les produits destinés à la vente au détail. Pour la logistique interne ou l'inventaire, préférez le Code 128 qui accepte les caractères alphanumériques. Nos codes respectent les standards internationaux de lecture laser." 
      },
      { 
        title: "QR WhatsApp Direct", 
        desc: "Automatisez vos prises de commandes. Entrez votre numéro et un message prédéfini (ex: 'Je souhaite commander'). Le client n'a plus qu'à scanner et envoyer le message pour démarrer la discussion avec votre boutique." 
      },
      { 
        title: "Détourage Image par IA (RemBg)", 
        desc: "Téléchargez vos photos produits. Notre Intelligence Artificielle identifie le sujet et supprime l'arrière-plan instantanément. Vous obtenez un PNG transparent de qualité studio pour vos catalogues Shopify, Amazon ou Vinted." 
      },
      { 
        title: "Accès Wi-Fi Client", 
        desc: "Simplifiez l'expérience en magasin. Générez un QR code avec le nom de votre réseau et la clé. Vos clients se connectent automatiquement sans avoir à taper de mot de passe complexe, améliorant ainsi leur satisfaction." 
      },
      { 
        title: "RetailLink : URL Shortener", 
        desc: "Transformez vos liens longs en URLs courtes 'rtbx.space/s/votre-nom'. Suivez le nombre de clics en temps réel pour mesurer l'efficacité de vos campagnes marketing tout en respectant la vie privée de vos clients (RGPD)." 
      }
    ]
  },
  en: {
    guide_title: "Complete User Guide",
    guide_sub: "Master our generation tools to boost your business growth.",
    expert_title: "💡 Expert Retail Advice",
    expert_p: "To achieve professional results, follow these technical recommendations:",
    guides: [
      { 
        title: "Pro QR Code Generation", 
        desc: "For your restaurant menus or product sheets, enter the destination URL. We recommend adding your logo to increase trust. Our codes are high-definition to ensure perfect scanning even in low-light conditions." 
      },
      { 
        title: "Digital Identity (Social Card)", 
        desc: "Centralize your online presence. Select your networks (Instagram, TikTok, Shopify) and create a single access point. It is the perfect tool for your bio or business cards to turn customers into followers." 
      },
      { 
        title: "VCard: Digital Business Card", 
        desc: "Enter your professional details. The generated VCard 3.0 QR code allows prospects to save your contact info (name, phone, email, address) to their address book with one click, eliminating typing errors." 
      },
      { 
        title: "Sale Labels & A4 Sheets", 
        desc: "Enter the original and discounted prices. The system generates a label with a crossed-out price and a compliant EAN-13 barcode. Download as a single image or a 24-label A4 PDF sheet ready for printing." 
      },
      { 
        title: "EAN-13 & Code 128 Barcodes", 
        desc: "Use EAN-13 for retail products. For internal logistics or inventory, use Code 128 which supports alphanumeric characters. Our codes comply with international laser scanning standards." 
      },
      { 
        title: "Direct WhatsApp QR", 
        desc: "Automate your ordering process. Enter your number and a predefined message (e.g., 'I want to order'). The customer just scans and sends the message to start a conversation with your shop." 
      },
      { 
        title: "AI Background Removal (RemBg)", 
        desc: "Upload your product photos. Our AI identifies the subject and removes the background instantly. You get a studio-quality transparent PNG for your Shopify, Amazon, or Vinted catalogs." 
      },
      { 
        title: "Customer Wi-Fi Access", 
        desc: "Simplify the in-store experience. Generate a QR code with your network name and key. Your customers connect automatically without typing complex passwords, increasing their satisfaction." 
      },
      { 
        title: "RetailLink: URL Shortener", 
        desc: "Turn long links into short 'rtbx.space/s/your-name' URLs. Track clicks in real-time to measure marketing effectiveness while respecting customer privacy (GDPR compliant)." 
      }
    ]
  }
};

export default async function GuidePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-20">
        <BrandLogo />
        <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.guide_title}
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              {t.guide_sub}
            </p>
        </div>

        {/* GRILLE DYNAMIQUE DE TOUS LES GUIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.guides.map((item, index) => (
            <section key={index} className="bg-slate-50 p-8 rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <CheckCircle className="text-indigo-600 w-6 h-6 flex-shrink-0" /> 
                    {item.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  {item.desc}
                </p>
            </section>
          ))}
        </div>

        {/* SECTION EXPERT ADVICE (Très important pour AdSense) */}
        <div className="mt-20 p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-black mb-4">{t.expert_title}</h2>
                <p className="text-indigo-100 mb-8 font-medium italic">{t.expert_p}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-indigo-50 font-medium">
                    <li className="flex gap-2">
                        <Info className="w-5 h-5 flex-shrink-0" /> 
                        {lang === 'fr' ? "Utilisez du papier mat pour vos codes-barres afin d'éviter les reflets." : "Use matte paper for barcodes to avoid scanning reflections."}
                    </li>
                    <li className="flex gap-2">
                        <Info className="w-5 h-5 flex-shrink-0" /> 
                        {lang === 'fr' ? "Privilégiez les logos contrastés au centre de vos QR Codes." : "Prefer high-contrast logos in the center of your QR Codes."}
                    </li>
                </ul>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}