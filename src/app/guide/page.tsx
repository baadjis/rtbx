/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { BookOpen, CheckCircle, Info } from 'lucide-react';
import { Data } from './data';

export default async function GuidePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        
        {/* HERO SECTION GUIDE */}
        <div className="text-center mb-20 md:mb-32">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl">
                    <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic tracking-tight">
              {t.guide_title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
              {t.guide_sub}
            </p>
        </div>

        {/* GRILLE DYNAMIQUE DE TOUS LES GUIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {t.guides.map((item: any, index: number) => (
            <section 
                key={index} 
                className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 rounded-[2.5rem] border border-transparent dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl transition-all duration-500 flex flex-col group"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle className="text-indigo-600 dark:text-indigo-400 w-6 h-6" /> 
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {item.title}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-medium text-lg flex-1">
                  {item.desc}
                </p>
            </section>
          ))}
        </div>

        {/* SECTION EXPERT ADVICE (Contrastée pour AdSense) */}
        <div className="mt-24 md:mt-32 p-10 md:p-16 bg-indigo-600 dark:bg-indigo-700 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight flex items-center gap-3">
                    {t.expert_title}
                </h2>
                <p className="text-indigo-100 text-lg md:text-xl mb-10 font-medium italic opacity-90">
                    {t.expert_p}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-50 font-bold">
                    <li className="flex gap-4 items-start">
                        <div className="mt-1 p-1 bg-white/20 rounded-lg">
                            <Info className="w-5 h-5 flex-shrink-0 text-white" /> 
                        </div>
                        <span className="text-lg">
                            {lang === 'fr' ? "Utilisez du papier mat pour vos codes-barres afin d'éviter les reflets lors du scan." : "Use matte paper for your barcodes to avoid reflections during scanning."}
                        </span>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="mt-1 p-1 bg-white/20 rounded-lg">
                            <Info className="w-5 h-5 flex-shrink-0 text-white" /> 
                        </div>
                        <span className="text-lg">
                            {lang === 'fr' ? "Privilégiez les logos contrastés et centrés pour une lisibilité optimale de vos QR Codes." : "Prefer high-contrast, centered logos for optimal QR Code readability."}
                        </span>
                    </li>
                </ul>
            </div>
            {/* Décoration subtile en fond */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}