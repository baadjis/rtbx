import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';

const Data = {
  fr: {
    faq_title: "Foire aux Questions",
    faq_sub: "Réponses pour optimiser votre commerce avec nos outils.",
    faqs: [
      { q: "Comment générer un QR code pour mon menu restaurant ?", a: "Hébergez votre menu sur Google Drive, copiez le lien de partage public et utilisez notre outil QR Pro." },
      { q: "Le générateur d'étiquettes de soldes est-il gratuit ?", a: "Oui, RetailBox permet de créer gratuitement des étiquettes avec prix barré et code-barres EAN-13." },
      { q: "Comment connecter mes clients au Wi-Fi sans donner le mot de passe ?", a: "Grâce à notre Générateur Wi-Fi : entrez votre nom de réseau et mot de passe, le QR fera le reste." },
      { q: "Comment créer un lien QR direct vers mon WhatsApp ?", a: "Utilisez l'outil QR WhatsApp. Entrez votre numéro et le lien ouvrira directement une discussion." },
      { q: "Peut-on supprimer l'arrière-plan d'une photo par IA ?", a: "Oui, notre outil RemBg IA détourre vos photos automatiquement en format PNG transparent." }
    ]
  },
  en: {
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* TITRE DE LA PAGE */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl">
                <HelpCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
            {t.faq_title}
          </h1>
          <p className="text-xl text-gray-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {t.faq_sub}
          </p>
        </div>

        {/* LISTE DES FAQS - Centrée et largeur contrôlée pour la lecture */}
        <div className="max-w-3xl mx-auto space-y-6">
          {t.faqs.map((item, i) => (
            <details 
              key={i} 
              className="group border border-gray-100 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
            >
              <summary className="font-bold text-lg md:text-xl cursor-pointer list-none flex justify-between items-center py-6 px-8 text-gray-900 dark:text-white select-none">
                <span className="pr-4">{item.q}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </summary>
              <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2">
                <p 
                    className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg font-medium border-t border-gray-50 dark:border-slate-800 pt-6" 
                    dangerouslySetInnerHTML={{ __html: item.a }} 
                />
              </div>
            </details>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="max-w-3xl mx-auto mt-20 p-10 bg-indigo-600 dark:bg-indigo-700 rounded-[3rem] text-white text-center shadow-2xl shadow-indigo-500/20">
            <h3 className="text-2xl font-bold mb-4">
                {lang === 'fr' ? "D'autres questions ?" : "Still have questions?"}
            </h3>
            <p className="text-indigo-100 mb-8 font-medium">
                {lang === 'fr' 
                  ? "Notre équipe support est là pour vous aider à digitaliser votre activité." 
                  : "Our support team is here to help you digitalize your business."}
            </p>
            <a href="/contact" className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-gray-100 transition-all">
                {lang === 'fr' ? "Contactez-nous" : "Contact Us"}
            </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}