/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Newspaper } from 'lucide-react';
import { Data } from './data';

export default async function BlogPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full relative z-10">
        
        {/* EN-TÊTE DE SECTION */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Newspaper className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Expertise
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            {t.blog_title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.blog_sub}
          </p>
        </div>

        {/* GRILLE D'ARTICLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {t.posts.map((p: any) => (
            <Link 
              key={p.id} 
              href={`/blog/${p.id}`} 
              className="group bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {p.title}
                </h2>
                <p className="text-gray-500 dark:text-slate-400 mb-10 line-clamp-3 font-medium text-lg leading-relaxed">
                  {p.intro}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs tracking-widest border-b-2 border-indigo-600/20 group-hover:border-indigo-600 transition-all pb-1">
                  {lang === 'fr' ? 'Lire l\'article' : 'Read more'}
                </span>
                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SECTION CTA BAS DE PAGE */}
        <div className="mt-24 p-10 md:p-16 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-gray-100 dark:border-slate-800 text-center transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {lang === 'fr' ? "Prêt à digitaliser votre boutique ?" : "Ready to digitalize your shop?"}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-xl mx-auto font-medium">
                {lang === 'fr' 
                  ? "Utilisez nos outils gratuits dès aujourd'hui pour optimiser votre logistique et vos ventes." 
                  : "Start using our free tools today to optimize your logistics and boost your sales."}
            </p>
            <Link href="/" className="inline-flex px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                {lang === 'fr' ? "Retour à l'accueil" : "Back to Home"}
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}