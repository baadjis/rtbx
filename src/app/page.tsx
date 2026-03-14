import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { DICT } from '@/lib/locales';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  
  // On ajoute quelques traductions pour l'accueil si elles n'y sont pas
  const t = {
    fr: {
      hero: "La puissance du digital pour les commerçants",
      sub: "Générez vos outils pro gratuitement : QR Codes, Barcodes, Détourage IA et plus encore.",
      cta_start: "Démarrer maintenant",
      cta_login: "Mon Espace Pro",
      feat1: "Rapide & Gratuit",
      feat2: "Conforme RGPD",
      feat3: "Haute Définition"
    },
    en: {
      hero: "Digital power for small businesses",
      sub: "Generate pro tools for free: QR Codes, Barcodes, AI Background Removal and more.",
      cta_start: "Get Started",
      cta_login: "Pro Dashboard",
      feat1: "Fast & Free",
      feat2: "GDPR Compliant",
      feat3: "High Definition"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white text-gray-900" 
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      {/* HEADER SIMPLE */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <BrandLogo />
        <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">
          {t.cta_login}
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          {t.hero}
        </h1>
        <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          {t.sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="https://baadjis-utilitybox.hf.space" 
             className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {t.cta_start} <ArrowRight className="w-5 h-5" />
          </a>
          <Link href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
            {lang === 'fr' ? "S'inscrire" : "Sign up"}
          </Link>
        </div>

        {/* PETITS ARGUMENTS (RASSURE GOOGLE ET LES USERS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-6 bg-white/50 rounded-3xl border border-gray-100">
            <Zap className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold mb-2">{t.feat1}</h3>
            <p className="text-sm text-gray-500">Outils optimisés pour une utilisation instantanée sans délai.</p>
          </div>
          <div className="p-6 bg-white/50 rounded-3xl border border-gray-100">
            <Shield className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold mb-2">{t.feat2}</h3>
            <p className="text-sm text-gray-500">Vos données ne sont jamais stockées sur nos serveurs.</p>
          </div>
          <div className="p-6 bg-white/50 rounded-3xl border border-gray-100">
            <Globe className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold mb-2">{t.feat3}</h3>
            <p className="text-sm text-gray-500">Fichiers conformes aux standards pro (EAN13, PNG HD).</p>
          </div>
        </div>
      </main>
    </div>
  );
}