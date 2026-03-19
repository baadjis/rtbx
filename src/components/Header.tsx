import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { Home as HomeIcon } from 'lucide-react';
import LangSwitcher from './LangSwitch';
import NavLinks from './NavLinks'; // On va créer ce petit helper juste en dessous

const NAV_DICT = {
  fr: {
    home: "Accueil",
    blog: "Blog",
    guide: "Guide",
    faq: "FAQ",
    about: "À Propos",
    login: "Espace Pro",
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

  // Liste des liens pour le mapping
  const links = [
    { href: "/", label: t.home, icon: <HomeIcon className="w-4 h-4" /> },
    { href: "/blog", label: t.blog },
    { href: "/guide", label: t.guide },
    { href: "/faq", label: t.faq },
    { href: "/about", label: t.about },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-0 pb-4 md:px-6 md:pt-0 md:pb-4">
      
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.08)] p-3 md:px-8 md:py-4 gap-4 md:gap-0">
        
        {/* 1. LOGO CLIQUABLE */}
        <div className="flex justify-center w-full md:w-auto transition-transform hover:scale-105 active:scale-95">
          <Link href="/" className="no-underline border-none">
            <BrandLogo />
          </Link>
        </div>
        
        {/* 2. NAVIGATION AVEC COULEUR ACTIVE */}
        <div className="w-full md:flex-1 flex justify-center overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 md:gap-6 min-w-max px-2">
            {/* On utilise un composant client pour détecter l'URL et mettre la couleur */}
            <NavLinks links={links} />
          </div>
        </div>

        {/* 3. ACTIONS */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <LangSwitcher currentLang={lang} />
          
          <Link href="/login" className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-xs md:text-sm font-black hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none transition-all hover:scale-105 active:scale-95 whitespace-nowrap no-underline border-none">
            {t.login}
          </Link>
        </div>

      </nav>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </header>
  );
}