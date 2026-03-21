import { cookies } from 'next/headers';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default async function NotFound() {
  // 1. Détection de la langue via le cookie partagé
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';

  // 2. Dictionnaire local pour la page 404
  const t = {
    fr: {
      title: "Page introuvable",
      desc: "Oups ! La page que vous recherchez n'existe pas ou a été déplacée vers une nouvelle adresse.",
      btn: "Retour à l'accueil",
      code: "Erreur 404"
    },
    en: {
      title: "Page Not Found",
      desc: "Oops! The page you are looking for does not exist or has been moved to a new address.",
      btn: "Back to Home",
      code: "Error 404"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      {/* On garde le header pour que l'utilisateur puisse naviguer ailleurs */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-20 flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-xl w-full text-center">
          
          {/* Illustration Icone */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="relative p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800">
                <Ghost className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Texte d'erreur */}
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4 block">
            {t.code}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            {t.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">
            {t.desc}
          </p>

          {/* Bouton de secours */}
          <div className="flex justify-center">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all no-underline"
            >
              <Home className="w-5 h-5" />
              {t.btn}
              <ArrowLeft className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}