import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';
import { Store, Utensils, Users, ShieldCheck, Zap } from 'lucide-react';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  const content = {
    fr: {
      title: "À propos de RetailBox",
      intro: "RetailBox est une suite d'outils techniques dédiée à l'optimisation des opérations pour le commerce moderne et les Small Businesses.",
      mission_h: "Accompagner la croissance des entreprises",
      mission_p: "Nous centralisons les ressources critiques pour les entrepreneurs et gestionnaires de points de vente. De la boutique physique au site e-commerce, nous fournissons les standards technologiques indispensables pour rester compétitifs.",
      
      service1_h: "Gestion de Stock",
      service1_p: "Nous simplifions la logistique avec des générateurs de codes-barres conformes (EAN-13, Code 128).",
      
      service2_h: "Solutions Restaurants",
      service2_p: "Nous modernisons l'expérience client grâce à des QR Codes de menu fluides et professionnels.",
      
      service3_h: "Identité Digitale",
      service3_p: "Nous créons un point d'entrée unique pour regrouper vos réseaux sociaux et vos canaux de vente.",
      
      service4_h: "Optimisation Produit",
      service4_p: "Nous valorisons vos articles grâce à notre IA de détourage haute précision (qualité studio).",
      
      privacy_h: "Notre engagement pour vos données",
      privacy_p: "Nous appliquons une politique de confidentialité rigoureuse. Chaque traitement technique est exécuté en mémoire vive (RAM). Nous ne conservons aucune donnée commerciale ou photo sur nos serveurs."
    },
    en: {
      title: "About RetailBox",
      intro: "RetailBox is a technical toolset dedicated to optimizing operations for modern retail and Small Businesses.",
      mission_h: "Supporting Business Growth",
      mission_p: "We centralize critical resources for entrepreneurs and store managers. From physical shops to e-commerce sites, we provide the essential technological standards to stay competitive.",
      
      service1_h: "Inventory Management",
      service1_p: "We simplify logistics with compliant barcode generators (EAN-13, Code 128).",
      
      service2_h: "Restaurant Solutions",
      service2_p: "We modernize the customer experience with fluid and professional digital menu QR Codes.",
      
      service3_h: "Digital Identity",
      service3_p: "We create a single point of entry to group your social networks and sales channels.",
      
      service4_h: "Product Optimization",
      service4_p: "We enhance your sales items through our high-precision AI background removal (studio quality).",
      
      privacy_h: "Our Commitment to Your Data",
      privacy_p: "We apply a rigorous privacy policy. Every technical process is executed in random access memory (RAM). We do not store any commercial data or photos on our servers."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 w-full">
        <BrandLogo />
        
        {/* HERO SECTION ABOUT */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
            {content.title}
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* MISSION CARD */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Zap className="text-indigo-600 w-6 h-6" /> {content.mission_h}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {content.mission_p}
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Store className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.service1_h}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{content.service1_p}</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Utensils className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.service2_h}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{content.service2_p}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Users className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.service3_h}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{content.service3_p}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.service4_h}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{content.service4_p}</p>
          </div>
        </div>

        {/* PRIVACY COMMITMENT */}
        <div className="bg-indigo-600 p-8 md:p-12 rounded-[3rem] text-white shadow-xl shadow-indigo-100">
          <h2 className="text-2xl font-bold mb-6">{content.privacy_h}</h2>
          <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
            {content.privacy_p}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}