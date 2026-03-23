import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { 
  LayoutDashboard, Link2, BarChart3, 
  Settings, LogOut, Wrench, Star, 
  ChevronRight, Globe 
} from 'lucide-react';
import Link from 'next/link';
import { Data } from './data';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const langValue = cookieStore.get('lang')?.value;
  const lang = (langValue === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = Data[lang];

  // Navigation interne du Dashboard
  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, href: '/dashboard', active: true },
    { name: t.my_links, icon: Link2, href: '#', badge: null },
    { name: t.analytics, icon: BarChart3, href: '#', badge: t.beta },
    { name: t.google_reviews, icon: Star, href: '/tools/google-reviews', badge: null },
    { name: t.settings, icon: Settings, href: '#', badge: null },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* SIDEBAR - Desktop (Sticky & Modern) */}
      <aside className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-colors">
        
        {/* LOGO AREA */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white block leading-none">
                {t.brand}
            </span>
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1 block">
                {t.workspace}
            </span>
          </div>
        </div>

        {/* NAVIGATION PRINCIPALE */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group ${
                item.active 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">
                    {item.badge}
                </span>
              )}
            </Link>
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-50 dark:border-slate-800">
            <Link 
              href="/tools" 
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-gray-400 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                <span>{t.back_to_tools}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </nav>

        {/* FOOTER SIDEBAR (USER) */}
        <div className="p-6 mt-auto border-t border-gray-50 dark:border-slate-800">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 dark:text-slate-500 font-bold hover:text-red-600 dark:hover:text-red-400 transition-colors group">
              <LogOut className="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-red-500" />
              {t.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Navbar Header */}
        <div className="md:hidden sticky top-0 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t.brand}</span>
            </div>
            <Link href="/dashboard" className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
            </Link>
        </div>
        
        {/* Scrollable area */}
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            {children}
          </div>
        </div>

        {/* Bouton Mobile Flottant (CTA) */}
        <Link href="/tools" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50">
            <Wrench size={24} />
        </Link>
      </main>
    </div>
  );
}