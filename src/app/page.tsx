import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';

import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import Footer from '@/components/Footer';

const DICT = {
  fr: {
    hero_title: "La puissance du digital pour les commerçants",
    hero_sub: "Générez vos outils pro gratuitement : QR Codes, Barcodes, Détourage IA et bien plus encore.",
    cta_start: "Démarrer maintenant",
    cta_login: "Mon Espace Pro",
    cta_register: "S'inscrire gratuitement",
    feat1_title: "Rapide & Gratuit",
    feat1_desc: "Outils optimisés pour une utilisation instantanée sans aucun délai.",
    feat2_title: "Conforme RGPD",
    feat2_desc: "La protection de vos données est notre priorité. Zéro stockage serveur.",
    feat3_title: "Haute Définition",
    feat3_desc: "Fichiers conformes aux standards pro pour une impression parfaite.",
    // ... tes autres clés (login, stats, etc.)
  },
  en: {
    hero_title: "Empowering Small Businesses with Digital Tools",
    hero_sub: "Generate professional tools for free: QR Codes, Barcodes, AI Background Removal, and more.",
    cta_start: "Get Started Now",
    cta_login: "Pro Dashboard",
    cta_register: "Sign up for free",
    feat1_title: "Fast & Free",
    feat1_desc: "High-performance tools optimized for instant results.",
    feat2_title: "GDPR Compliant",
    feat2_desc: "Your data privacy is our priority. We never store your files.",
    feat3_title: "Professional Quality",
    feat3_desc: "High-definition files ready for professional printing and retail.",
    // ... tes autres clés
  }
};

export default async function Home() {
  // Lecture de la langue sur le serveur
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-white text-gray-900" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      {/* HEADER NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <BrandLogo />
        <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          {t.cta_login}
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-gray-900">
          {t.hero_title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
          {t.hero_sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Lien vers Hugging Face (Outils) */}
          <a href="https://baadjis-utilitybox.hf.space" 
             className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
            {t.cta_start} <ArrowRight className="w-5 h-5" />
          </a>
          {/* Lien vers Inscription Next.js */}
          <Link href="/register" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-lg hover:border-indigo-100 hover:bg-gray-50 transition-all">
            {t.cta_register}
          </Link>
        </div>

        {/* FEATURES GRID (Pour rassurer AdSense) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 text-left">
          <div className="p-8 bg-white/50 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{t.feat1_title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.feat1_desc}</p>
          </div>

          <div className="p-8 bg-white/50 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{t.feat2_title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.feat2_desc}</p>
          </div>

          <div className="p-8 bg-white/50 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{t.feat3_title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.feat3_desc}</p>
          </div>
        </div>
      </main>
      
      {/* FOOTER SIMPLE SUR LA LANDING */}
      <Footer />
    </div>
  );
}