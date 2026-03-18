import { cookies } from 'next/headers';
import { BrandLogo } from '@/components/BrandLogo';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Store, Utensils, Users, ShieldCheck, Zap } from 'lucide-react';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header/>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full relative z-10">
        
        {/* HERO SECTION ABOUT */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* MISSION CARD */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 mb-16 transition-colors">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                <Zap className="text-indigo-600 dark:text-indigo-400 w-7 h-7" />
            </div>
            {content.mission_h}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
            {content.mission_p}
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.service1_h}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{content.service1_p}</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.service2_h}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{content.service2_p}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.service3_h}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{content.service3_p}</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.service4_h}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{content.service4_p}</p>
          </div>
        </div>

        {/* PRIVACY COMMITMENT */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-10 md:p-16 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">{content.privacy_h}</h2>
            <p className="text-indigo-100 text-xl leading-relaxed opacity-90 font-medium">
                {content.privacy_p}
            </p>
          </div>
          {/* Subtle decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}