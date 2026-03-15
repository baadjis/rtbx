import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr';

  const content = {
    fr: {
      title: "Politique de Confidentialité",
      desc: "Nous protégeons vos données commerciales.",
      s1: "1. Traitement éphémère",
      p1: "Toutes les opérations de détourage ou de génération sont effectuées en RAM et supprimées instantanément.",
      s2: "2. AdSense & Cookies",
      p2: "Nous utilisons Google AdSense pour financer ce service gratuit. Des cookies sont utilisés pour personnaliser les annonces."
    },
    en: {
      title: "Privacy Policy",
      desc: "We protect your business data.",
      s1: "1. Ephemeral Processing",
      p1: "All removal or generation tasks are done in RAM and deleted instantly.",
      s2: "2. AdSense & Cookies",
      p2: "We use Google AdSense to fund this free service. Cookies are used for ad personalization."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <BrandLogo />
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black mb-2">{content.title}</h1>
          <p className="text-gray-400 mb-8 font-medium">{content.desc}</p>
          <div className="prose prose-indigo space-y-6">
            <h4 className="font-bold text-gray-900">{content.s1}</h4>
            <p className="text-gray-600 leading-relaxed">{content.p1}</p>
            <h4 className="font-bold text-gray-900">{content.s2}</h4>
            <p className="text-gray-600 leading-relaxed">{content.p2}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}