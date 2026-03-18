import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { Home as HomeIcon } from 'lucide-react';

const NAV_DICT = {
  fr: {
    home: "Accueil",
    blog: "Blog",
    guide: "Guide",
    faq: "FAQ",
    about: "À Propos",
    login: "Mon Espace Pro",
  },
  en: {
    home: "Home",
    blog: "Blog",
    guide: "Guide",
    faq: "FAQ",
    about: "About",
    login: "Pro Dashboard",
  }
};

export default async function Header() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = NAV_DICT[lang];

  return (
    // Le conteneur extérieur gère le positionnement sticky et le padding global
    <div className="sticky top-0 z-50 w-full px-4 py-4 md:px-6 pt-0">
      
      {/* La barre de navigation avec bords arrondis (L'île flottante) */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.08)]">
        
        {/* LOGO CLIQUABLE */}
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <BrandLogo />
        </Link>
        
        {/* Liens de Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider">
            <HomeIcon className="w-4 h-4" /> {t.home}
          </Link>
          <Link href="/blog" className="text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider">
            {t.blog}
          </Link>
          <Link href="/guide" className="text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider">
            {t.guide}
          </Link>
          <Link href="/faq" className="text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider">
            {t.faq}
          </Link>
          <Link href="/about" className="text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider">
            {t.about}
          </Link>
        </div>

        {/* Bouton Connexion / Dashboard */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-sm font-black hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none transition-all hover:scale-105 active:scale-95">
            {t.login}
          </Link>
        </div>
      </nav>
    </div>
  );
}