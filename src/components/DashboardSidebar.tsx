/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Link2, Wrench, ChevronLeft, ChevronRight, 
  LogOut, LayoutDashboard, Star, Store, BarChart3, Settings, 
  Award,
  Calendar,
  Users
} from 'lucide-react';

// 1. On crée le dictionnaire d'icônes côté CLIENT
const IconMap: { [key: string]: any } = {
  dashboard: LayoutDashboard,
  links: Link2,
  star: Star,
  store: Store,
  award: Award,
  calendar: Calendar, // Pour "Événements"
  users: Users,       // Pour "Mes Organisations"
  analytics: BarChart3,
  settings: Settings
};

export default function DashboardSidebar({ navItems, t, lang }: { navItems: any[], t: any, lang: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // On lit le localStorage une seule fois
    const saved = localStorage.getItem('sidebar-collapsed');
    
    // On utilise un petit délai (0ms) pour sortir de la pile d'exécution synchrone
    // Cela supprime l'erreur "Cascading renders"
    const timer = setTimeout(() => {
      if (saved === 'true') setIsCollapsed(true);
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  // Rendu de secours pendant l'hydratation (Digest fix)
  if (!isMounted) {
    return <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-gray-100 h-screen sticky top-0"></aside>;
  }

  return (
    <aside className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-all duration-300 ease-in-out z-20 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      <button onClick={toggleSidebar} className="absolute -right-3 top-10 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 border-none cursor-pointer">
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-8 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex-shrink-0 flex items-center justify-center">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && <span className="text-2xl font-black text-gray-900 dark:text-white uppercase truncate">RetailBox</span>}
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const IconComponent = IconMap[item.iconName] || LayoutDashboard;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all no-underline ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'text-gray-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600' } ${isCollapsed ? 'justify-center' : ''}`}>
              <IconComponent className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {!isCollapsed && item.badge && <span className="ml-auto text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 px-2 py-0.5 rounded-lg font-black uppercase">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout avec style harmonisé */}
      <div className="p-4 mt-auto border-t border-gray-50 dark:border-slate-800">
        <form action="/auth/signout" method="post">
          <button type="submit" className={`flex items-center gap-3 px-4 py-3 w-full text-gray-400 dark:text-slate-500 font-bold hover:bg-red-500 hover:text-white rounded-2xl transition-all border-none bg-transparent cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span>{t.logout}</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}