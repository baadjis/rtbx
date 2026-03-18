import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Share2, ArrowRight } from 'lucide-react';
import { Data } from '../data';

export default async function BlogPost({ params }: { params: Promise<{ Id: string }> }) {
  // Correction technique : Next.js 15 utilise 'id' en minuscule si le dossier est [id]
  const resolvedParams = await params;
  const currentId = resolvedParams.Id; 

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];
  
  // Recherche robuste de l'article
  const post = t.posts.find((p: { id: string; }) => String(p.id).toLowerCase() === String(currentId).toLowerCase());

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{lang === 'fr' ? 'Article introuvable' : 'Article not found'}</h1>
            <Link href="/blog" className="text-indigo-600 mt-4 block font-bold no-underline">
              {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%)'}}>
      
      {/* Header aligné */}
      <Header />

      {/* Main avec le container max-w-7xl et px-6 pour un alignement vertical parfait avec le header */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* FIL D'ARIANE / RETOUR - Aligné sur la grille de l'article (max-w-3xl) */}
        <div className="max-w-3xl mx-auto mb-12">
          <Link href="/blog" className="group inline-flex items-center gap-2 text-gray-400 dark:text-slate-500 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            {lang === 'fr' ? 'Retour aux articles' : 'Back to articles'}
          </Link>
        </div>

        <article className="max-w-3xl mx-auto">
          {/* HEADER DE L'ARTICLE */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-6">
              <span className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">Expertise</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 3 min read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
              {post.title}
            </h1>

            {/* INTRO BOX STYLE "SPLENDIDE" */}
            <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 shadow-sm overflow-hidden">
              <p className="relative z-10 text-indigo-900 dark:text-indigo-200 font-bold text-xl md:text-2xl italic leading-relaxed tracking-tight">
                {post.intro}
              </p>
              <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-600/10 dark:text-white/5 -rotate-12" />
            </div>
          </header>

          {/* CORPS DE L'ARTICLE */}
          <div className="space-y-8 text-gray-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
            {post.content.split('\n').map((para: string, i: number) => (
              para.trim() && <p key={i} className="first-letter:text-3xl first-letter:font-black first-letter:text-indigo-600 dark:first-letter:text-indigo-400 first-letter:mr-1">{para}</p>
            ))}
          </div>

          {/* FOOTER DE L'ARTICLE / PARTAGE */}
          <footer className="mt-20 pt-10 border-t border-gray-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                R
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Équipe RetailBox</p>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-bold">Expertise Commerce & Digital</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border-none cursor-pointer">
              <Share2 className="w-4 h-4" /> {lang === 'fr' ? 'Partager l\'expertise' : 'Share insight'}
            </button>
          </footer>
        </article>

        {/* CTA DE FIN */}
        <div className="max-w-3xl mx-auto mt-24">
          <Link href="/" className="group block p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-500 text-center no-underline">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
              {lang === 'fr' ? "Besoin de mettre cela en pratique ?" : "Need to put this into practice?"}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 font-medium mb-8">
              Découvrez nos outils gratuits de génération QR, Barcode et Détourage IA.
            </p>
            <span className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black transition-all group-hover:scale-105 group-hover:bg-indigo-700">
              Essayer nos outils <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}