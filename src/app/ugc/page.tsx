import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Data } from './data';
import { Fingerprint, UserCheck, ShieldCheck } from 'lucide-react';

export default async function UgcPage() {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  const content = Data[lang];

  // Préparation des sections pour le mapping (Logique robuste)
  const sections = [
    { h: content.s1, p: content.p1 },
    { h: content.s2, p: content.p2 },
    { h: content.s3, p: content.p3 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 100%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      {/* Alignement strict max-w-7xl et px-6 identique au Header et à la Home */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="max-w-4xl mx-auto mb-12 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Fingerprint className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Ownership
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
            {content.title}
          </h1>
          <p className="text-xl text-indigo-600 dark:text-indigo-400 font-bold italic">
            {content.sub}
          </p>
        </div>

        {/* CARTE DE CONTENU */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="space-y-12">
              
              {sections.map((section, index) => (
                section.h && (
                  <section key={index} className="group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full group-hover:scale-y-110 transition-transform duration-300"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight italic">
                            {section.h}
                        </h2>
                    </div>
                    <div className="pl-6 border-l border-gray-50 dark:border-slate-800">
                        <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
                            {section.p}
                        </p>
                    </div>
                  </section>
                )
              ))}

            </div>

            {/* BOX DE RÉASSURANCE PROPRIÉTÉ */}
            <div className="mt-16 p-8 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/30 flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-indigo-900/50 rounded-xl shadow-sm">
                    <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                    <p className="text-indigo-900 dark:text-indigo-200 font-bold mb-1">
                        {lang === 'fr' ? "Engagement Utilisateur" : "User Commitment"}
                    </p>
                    <p className="text-indigo-700/70 dark:text-indigo-300/60 text-sm font-medium leading-relaxed">
                        {lang === 'fr' 
                          ? "RetailBox n'exerce aucun droit de regard sur vos créations. Votre propriété intellectuelle est respectée et protégée par notre architecture technique sans stockage."
                          : "RetailBox does not exercise any right of review over your creations. Your intellectual property is respected and protected by our storage-free technical architecture."
                        }
                    </p>
                </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}