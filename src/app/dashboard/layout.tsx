import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import { LayoutDashboard, Link2, BarChart3, Settings, LogOut, Wrench } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Récupération de la langue depuis le cookie partagé (Compatible Next.js 15)
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = DICT[lang];

  // 2. Définition des items de navigation traduits
  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, href: '/dashboard', active: true },
    { name: t.my_links || (lang === 'fr' ? "Mes Liens" : "My Links"), icon: Link2, href: '#', active: false },
    { name: t.analytics || (lang === 'fr' ? "Statistiques" : "Analytics"), icon: BarChart3, href: '#', active: false },
    { name: t.settings || (lang === 'fr' ? "Paramètres" : "Settings"), icon: Settings, href: '#', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      
      {/* SIDEBAR - Fixe sur Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-colors">
        
        {/* LOGO AREA */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {t.brand || "RetailLink"}
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                item.active 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
              {item.name}
            </a>
          ))}
          
          {/* LIEN VERS LE SITE PYTHON (Hugging Face) */}
          <div className="pt-4 mt-4 border-t border-gray-50 dark:border-slate-800">
            <Link 
    href="/tools" 
    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all group"
  >
    <Wrench className="w-5 h-5 text-gray-400 group-hover:text-white" />
    {t.back_to_tools || (lang === 'fr' ? "Accéder aux Outils" : "Access Tools")}
  </Link>
          </div>
        </nav>

        {/* USER / LOGOUT AREA */}
        <div className="p-6 mt-auto border-t border-gray-50 dark:border-slate-800">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 dark:text-slate-500 font-bold hover:text-red-600 dark:hover:text-red-400 transition-colors group">
              <LogOut className="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-red-500" />
              {t.logout || (lang === 'fr' ? "Déconnexion" : "Logout")}
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Version mobile header (iPhone Safe) */}
        <div className="md:hidden p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-gray-900 dark:text-white">{t.brand || "RetailLink"}</span>
            </div>
            <button className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
            </button>
        </div>
        
        {/* Scrollable content area */}
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}