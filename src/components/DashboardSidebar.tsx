/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Link2, Wrench, ChevronLeft, ChevronRight, 
  LogOut, LayoutDashboard, Home, Star, BarChart3, Settings
} from 'lucide-react';

export default function Sidebar({ navItems, t, lang }: { navItems: any[], t: any, lang: string }) {
  // 1. Initialisation neutre : on ne touche à rien au début
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReady, setIsReady] = useState(false); 
  const pathname = usePathname();

  // 2. Un seul useEffect pour tout préparer
  useEffect(() => {
    // On récupère la valeur en mémoire
    const saved = localStorage.getItem('sidebar-collapsed');
    const initialValue = saved !== null ? JSON.parse(saved) : false;

    // L'ASTUCE : On utilise requestAnimationFrame pour décaler la mise à jour
    // Cela évite le "cascading render" car on sort du cycle d'hydratation immédiat
    requestAnimationFrame(() => {
      setIsCollapsed(initialValue);
      setIsReady(true);
    });
  }, []);

  // 3. PENDANT L'HYDRATATION : On rend une version "fantôme" identique au serveur
  // Cela empêche l'erreur de "server-side exception" (Digest error)
  if (!isReady) {
    return (
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 h-screen sticky top-0 z-[60]"></aside>
    );
  }

  // 4. LE RENDU RÉEL (Uniquement sur le client après le chargement)
  return (
    <aside 
      className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-all duration-300 ease-in-out z-[60] ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      {/* BOUTON TOGGLE (Flottant) */}
      <button 
        onClick={() => {
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
        }}
        className="absolute -right-3 top-10 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all z-[70] border-none cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* LOGO AREA */}
      <div className={`p-6 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            RetailBox
          </span>
        )}
      </div>

      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 no-underline group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
                : 'text-gray-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-black uppercase">
                    {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        
        <div className={`pt-6 mt-6 border-t border-gray-50 dark:border-slate-800 ${isCollapsed ? 'px-2' : ''}`}>
          <Link 
            href="/tools" 
            title={isCollapsed ? (lang === 'fr' ? 'Boîte à Outils' : 'Toolbox') : ""}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-gray-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all no-underline ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Wrench className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span>{lang === 'fr' ? 'Boîte à Outils' : 'Toolbox'}</span>}
          </Link>
        </div>
      </nav>

      {/* DÉCONNEXION */}
      <div className="p-4 mt-auto border-t border-gray-50 dark:border-slate-800">
        <form action="/auth/signout" method="post">
          <button 
            type="submit"
            title={isCollapsed ? t.logout : ""}
            className={`flex items-center gap-3 px-4 py-3 w-full text-gray-400 dark:text-slate-500 font-bold hover:text-red-600 dark:hover:text-red-400 transition-colors group border-none bg-transparent cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-6 h-6 flex-shrink-0 group-hover:text-red-500" />
            {!isCollapsed && <span>{t.logout}</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}