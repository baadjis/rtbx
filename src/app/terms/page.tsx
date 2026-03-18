import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Data } from './data';
import { FileText, ShieldAlert, Scale } from 'lucide-react';

export default async function TermsPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  const content = Data[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="max-w-4xl mx-auto mb-12 text-left">
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

        {/* CONTENU DES CONDITIONS */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="space-y-12">
              
              {/* Section 1 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full group-hover:scale-y-125 transition-transform"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {content.s1}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg font-medium pl-6">
                  {content.p1}
                </p>
              </section>

              {/* Section 2 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full group-hover:scale-y-125 transition-transform"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {content.s2}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg font-medium pl-6">
                  {content.p2}
                </p>
              </section>

              {/* Section 3 */}
              <section className="group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full group-hover:scale-y-125 transition-transform"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {content.s3}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg font-medium pl-6">
                  {content.p3}
                </p>
              </section>

            </div>

            {/* RAPPEL SÉCURITÉ BAS DE CARTE */}
            <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                  {lang === 'fr' 
                    ? "En utilisant nos outils, vous reconnaissez que RetailBox n'exerce aucun contrôle sur l'usage final des fichiers générés et décline toute responsabilité en cas d'utilisation frauduleuse."
                    : "By using our tools, you acknowledge that RetailBox has no control over the end-use of generated files and disclaims any liability for fraudulent use."
                  }
                </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}