import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import { LayoutDashboard, Wrench, Home, LogIn, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function ToolsLayout({ children }: { children: ReactNode }) {
  // 1. Authentification
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Langue
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  const navItems = [
    { name: t.home, icon: Home, href: '/' },
    { name: lang === 'fr' ? 'Mes Outils' : 'My Tools', icon: Wrench, href: '/tools', active: true },
    { name: t.dashboard, icon: LayoutDashboard, href: '/dashboard' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- SIDEBAR DESKTOP --- */}
      {user && (
        <aside className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-colors z-20">
          <div className="p-8 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Pro Space</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <Link 
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
              </Link>
            ))}
          </nav>

          <div className="p-6 mt-auto border-t border-gray-50 dark:border-slate-800">
             <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 dark:text-slate-500 font-bold hover:text-indigo-600 transition-colors no-underline">
                <User size={20} /> {t.dashboard}
             </Link>
          </div>
        </aside>
      )}

      {/* --- ZONE DE CONTENU PRINCIPALE --- */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${!user ? 'w-full' : ''}`}>
        
        {/* Banner incitative pour les non-connectés (Fixe en haut) */}
        {!user && (
            <div className="sticky top-0 z-30 bg-indigo-600 p-3 text-center text-white text-[10px] md:text-xs font-black uppercase tracking-[0.15em] shadow-lg">
                {lang === 'fr' 
                    ? "Connectez-vous pour sauvegarder vos créations" 
                    : "Sign in to save your creations"} 
                <Link href="/login" className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded-full inline-flex items-center gap-1 hover:bg-indigo-50 transition-colors no-underline">
                    <LogIn size={12}/> {lang === 'fr' ? 'Connexion' : 'Login'}
                </Link>
            </div>
        )}

        {/* Contenu de la page avec padding bas sur mobile pour la nav basse */}
        <div className={`h-full overflow-y-auto ${user ? 'pb-24 md:pb-8' : 'pb-8'}`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>

        {/* --- BOTTOM NAV MOBILE (App-like) --- */}
        {user && (
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-6 py-3 pb-6 flex justify-between items-center shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className={`flex flex-col items-center gap-1 no-underline transition-all ${
                            item.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'
                        }`}
                    >
                        <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
                    </Link>
                ))}
            </nav>
        )}
      </main>
    </div>
  );
}