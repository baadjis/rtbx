// src/app/faq/page.tsx
import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { HelpCircle, ChevronDown } from 'lucide-react';
const Data= {
  fr:{  faq_title: "Foire aux Questions",
    faq_sub: "Réponses pour optimiser votre commerce avec nos outils.",
    faqs: [
      { q: "Comment générer un QR code pour mon menu restaurant ?", a: "Hébergez votre menu sur Google Drive, copiez le lien de partage et utilisez notre outil QR Pro." },
      { q: "Le générateur d'étiquettes de soldes est-il gratuit ?", a: "Oui, RetailBox permet de créer gratuitement des étiquettes avec prix barré et code-barres EAN-13." },
      { q: "Comment connecter mes clients au Wi-Fi sans mot de passe ?", a: "Utilisez le Générateur Wi-Fi : entrez votre nom de réseau et mot de passe, le QR fera le reste." },
      { q: "Comment créer un lien QR direct vers mon WhatsApp ?", a: "Utilisez l'outil QR WhatsApp. Entrez votre numéro et le lien ouvrira directement une discussion." },
      { q: "Peut-on supprimer l'arrière-plan d'une photo par IA ?", a: "Oui, notre outil RemBg IA détourre vos photos automatiquement en format PNG transparent." }
    ]},
    en:{
         faq_title: "Frequently Asked Questions",
    faq_sub: "Answers to optimize your business with our digital tools.",
    faqs: [
      { q: "How to generate a QR code for my menu in PDF?", a: "Host your menu on Google Drive, copy the public link and use our QR Pro tool." },
      { q: "Is the sale label generator really free?", a: "Yes, RetailBox allows you to create free labels with crossed-out prices and EAN-13 barcodes." },
      { q: "How to connect clients to Wi-Fi without a password?", a: "Use the Wi-Fi Generator: enter your network name and password, the QR does the rest." },
      { q: "How to create a direct QR link to my WhatsApp?", a: "Use the QR WhatsApp tool. Enter your number and the link opens a chat directly." },
      { q: "Can I remove a background with AI for free?", a: "Yes, our RemBg tool uses AI to automatically remove backgrounds into transparent PNGs." }
    ]
    }
}

export default async function FaqPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-4xl mx-auto px-6 py-20">
        <BrandLogo />
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
            {t.faq_title}
        </h1>
        <p className="text-center text-gray-500 font-medium mb-16">{t.faq_sub}</p>
        <div className="space-y-4">
          {t.faqs.map((item, i) => (
            <details key={i} className="group border border-gray-100 rounded-[2rem] bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                {item.q}
                <ChevronDown className="w-5 h-5 text-indigo-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}