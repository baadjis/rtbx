import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { Home as HomeIcon, LayoutDashboard, LogOut } from 'lucide-react';
import LangSwitcher from './LangSwitch';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import { createClient } from '@/utils/supabase/server'; // Import du client serveur

const NAV_DICT = {
  fr: { 
    home: "Accueil", 
    blog: "Blog", 
    guide: "Guide", 
    faq: "FAQ", 
    about: "À Propos", 
    login: "Espace Pro",
    dashboard: "Mon Dashboard" 
  },
  en: { 
    home: "Home", 
    blog: "Blog", 
    guide: "Guide", 
    faq: "FAQ", 
    about: "About", 
    login: "Pro Dashboard",
    dashboard: "My Dashboard"
  }
};

export default async function Header() {
  // 1. Vérification de l'authentification côté serveur
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // 2. Gestion de la langue
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = NAV_DICT[lang];

  const links = [
    { href: "/", label: t.home, icon: <HomeIcon size={18} /> },
    { href: "/blog", label: t.blog },
    { href: "/guide", label: t.guide },
    { href: "/faq", label: t.faq },
    { href: "/about", label: t.about },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-0 pb-4 md:px-6 md:pt-0 md:pb-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(79,70,229,0.08)] p-2 md:px-8 md:py-4">
        
        {/* LOGO */}
        <div className="transition-transform hover:scale-105 active:scale-95 flex-shrink-0">
          <Link href="/" className="no-underline border-none">
            <BrandLogo />
          </Link>
        </div>
        
        {/* NAVIGATION DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLinks links={links} />
        </div>

        {/* ACTIONS (Langue + Login/Dashboard) */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:block">
            <LangSwitcher currentLang={lang} />
          </div>
          
          {/* AFFICHAGE CONDITIONNEL */}
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-xs md:text-sm font-black hover:shadow-lg hover:shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-2 no-underline border-none"
            >
              <LayoutDashboard size={16} />
              {t.dashboard}
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-xs md:text-sm font-black hover:shadow-lg hover:shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 whitespace-nowrap no-underline border-none"
            >
              {t.login}
            </Link>
          )}

          {/* MENU MOBILE */}
          <MobileMenu links={links} t={t} lang={lang} />
        </div>

      </nav>
    </header>
  );
}