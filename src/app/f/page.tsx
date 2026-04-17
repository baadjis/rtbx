import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, CheckCircle2, QrCode, BarChart3, ArrowRight } from 'lucide-react';

export default async function FormsLandingPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'fr') as 'en' | 'fr';

  const t = {
    fr: {
      title: "RetailBox Forms",
      sub: "La solution professionnelle pour vos enquêtes de satisfaction et collectes d'avis.",
      desc: "RetailBox Forms permet aux commerçants et organisateurs d'événements de créer des formulaires interactifs, de générer des QR Codes de partage et d'analyser les résultats en temps réel.",
      cta: "Créer mon formulaire gratuit",
      feat1: "QR Code intelligent",
      feat2: "Analyse des scores",
      feat3: "Conforme RGPD"
    },
    en: {
      title: "RetailBox Forms",
      sub: "The professional solution for your surveys and feedback collection.",
      desc: "RetailBox Forms enables merchants and event organizers to create interactive forms, generate sharing QR Codes, and analyze results in real-time.",
      cta: "Create my free form",
      feat1: "Smart QR Code",
      feat2: "Score Analytics",
      feat3: "GDPR Compliant"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
            
            <div className="flex justify-center mb-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <FileText size={48} />
                </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {t.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                {t.sub}
            </p>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl mb-16 transition-colors">
                <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed mb-10 font-medium">
                    {t.desc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-center gap-3">
                        <QrCode className="text-indigo-600" size={20} />
                        <span className="font-bold text-sm dark:text-white">{t.feat1}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-indigo-600" size={20} />
                        <span className="font-bold text-sm dark:text-white">{t.feat2}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-indigo-600" size={20} />
                        <span className="font-bold text-sm dark:text-white">{t.feat3}</span>
                    </div>
                </div>
            </div>

            <Link href="/dashboard/forms/new" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all no-underline">
                {t.cta} <ArrowRight />
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}