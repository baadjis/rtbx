import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import { 
  LayoutDashboard, Link2, BarChart3, 
  Settings, LogOut, Wrench, Star, 
  Home, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { BrandLogo } from '@/components/BrandLogo';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Authentification & Langue
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = DICT[lang];

  // 2. Navigation du Dashboard (Seulement liens internes)
  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, href: '/dashboard' },
    { name: lang === 'fr' ? "Mes Liens" : "My Links", icon: Link2, href: '/dashboard/links' },
    { name: lang === 'fr' ? "Avis Google" : "Google Reviews", icon: Star, href: '/tools/google-reviews' },
    { name: t.analytics, icon: BarChart3, href: '#', badge: "Beta" },
    { name: t.settings, icon: Settings, href: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 sticky top-0 h-screen transition-colors">
        
        {/* Brand Area */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            RetailBox
          </span>
        </div>

        {/* Links Area */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group no-underline"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-black uppercase">
                    {item.badge}
                </span>
              )}
            </Link>
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-50 dark:border-slate-800">
            <Link 
              href="/tools" 
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-gray-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group no-underline"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                <span>{lang === 'fr' ? 'Boîte à Outils' : 'Toolbox'}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-6 mt-auto border-t border-gray-50 dark:border-slate-800">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 dark:text-slate-500 font-bold hover:text-red-600 dark:hover:text-red-400 transition-colors group border-none bg-transparent cursor-pointer">
              <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-500" />
              {t.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* --- ZONE PRINCIPALE --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Header (Sticky) */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 p-4 transition-colors">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="no-underline"><BrandLogo /></Link>
                <Link href="/dashboard" className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-xl">
                    <LayoutDashboard size={20} />
                </Link>
            </div>
        </header>

        {/* Content Area */}
        <div className="h-full overflow-y-auto pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>

        {/* --- BOTTOM NAV MOBILE (App UX) --- */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-800 px-6 py-3 pb-8 flex justify-between items-center transition-colors shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <Link href="/" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500">
                <Home size={22} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
            </Link>
            <Link href="/tools" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500">
                <Wrench size={22} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Tools</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 no-underline text-indigo-600 dark:text-indigo-400">
                <LayoutDashboard size={22} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Space</span>
            </Link>
            <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500">
                <Settings size={22} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Config</span>
            </Link>
        </nav>

      </main>
    </div>
  );
}