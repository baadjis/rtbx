import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';

export default async function TermsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  const content = {
    fr: {
      title: "Conditions Générales d'Utilisation",
      update: "Dernière mise à jour : Mars 2026",
      s1: "1. Acceptation des services",
      p1: "En accédant à RetailBox, vous acceptez d'utiliser nos outils de génération conformément aux présentes conditions. Le service est fourni gratuitement et 'en l'état'.",
      s2: "2. Limitations techniques",
      p2: "RetailBox ne peut être tenu responsable si un scanner tiers ne parvient pas à lire un code généré suite à une mauvaise configuration ou une impression de faible qualité.",
      s3: "3. Usages Interdits",
      p3: "Il est strictement interdit d'utiliser nos outils pour générer des contenus frauduleux, des liens de phishing, ou pour harceler des tiers via l'outil WhatsApp.",
    },
    en: {
      title: "Terms of Service",
      update: "Last updated: March 2026",
      s1: "1. Acceptance of Services",
      p1: "By accessing RetailBox, you agree to use our generation tools in accordance with these terms. The service is provided for free and 'as is'.",
      s2: "2. Technical Limitations",
      p2: "RetailBox cannot be held responsible if a third-party scanner fails to read a generated code due to improper configuration or low-quality printing.",
      s3: "3. Prohibited Uses",
      p3: "It is strictly forbidden to use our tools to generate fraudulent content, phishing links, or to harass third parties via the WhatsApp tool.",
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <BrandLogo />
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black mb-2 text-gray-900">{content.title}</h1>
          <p className="text-gray-400 mb-10 font-medium">{content.update}</p>
          
          <div className="space-y-8">
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s1}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p1}</p>
            </section>
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s2}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p2}</p>
            </section>
            <section>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{content.s3}</h4>
              <p className="text-gray-600 leading-relaxed">{content.p3}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}