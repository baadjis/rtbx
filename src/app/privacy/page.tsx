import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Data } from './data';
import { Scale, ShieldAlert } from 'lucide-react';

export default async function TermsPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  const content = Data[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      {/* Alignement strict max-w-7xl et px-6 pour correspondre au Header */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* EN-TÊTE */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Scale className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Legal
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            {content.update}
          </p>
        </div>

        {/* CONTENU DYNAMIQUE (MAPPING) */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="space-y-12">
              
              {/* On boucle sur TOUTES les sections de la donnée */}
              {content.sections.map((section, index) => (
                <section key={index} className="group">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-1.5 h-8 bg-indigo-600 rounded-full group-hover:scale-y-125 transition-transform duration-300"></div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                          {section.h}
                      </h2>
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                      {section.p}
                    </p>
                  </div>
                </section>
              ))}

            </div>

            {/* BOX DE SÉCURITÉ */}
            <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                  {lang === 'fr' 
                    ? "En utilisant RetailBox, vous acceptez d'assumer l'entière responsabilité des fichiers générés."
                    : "By using RetailBox, you agree to take full responsibility for the generated files."}
                </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}