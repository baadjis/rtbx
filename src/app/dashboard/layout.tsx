import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { DICT } from '@/lib/locales';
import { LayoutDashboard, Link2, BarChart3, Settings, LogOut, Wrench } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Récupération de la langue depuis le cookie partagé
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr') as 'en' | 'fr';
  const t = DICT[lang];

  // 2. Définition des items de navigation traduits
  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, href: '/dashboard', active: true },
    { name: t.my_links, icon: Link2, href: '#', active: false },
    { name: t.analytics, icon: BarChart3, href: '#', active: false },
    { name: t.settings, icon: Settings, href: '#', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* SIDEBAR - Fixe sur Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">
        {/* LOGO AREA */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">{t.brand}</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                item.active 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-600' : 'text-gray-400'}`} />
              {item.name}
            </a>
          ))}
          
          {/* LIEN VERS LE SITE PYTHON */}
          <div className="pt-4 mt-4 border-t border-gray-50">
            <a 
              href="https://baadjis-utilitybox.hf.space" 
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-indigo-600 hover:text-white transition-all group"
            >
              <Wrench className="w-5 h-5 text-gray-400 group-hover:text-white" />
              {t.back_to_tools}
            </a>
          </div>
        </nav>

        {/* USER / LOGOUT AREA */}
        <div className="p-6 mt-auto border-t border-gray-50">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 font-bold hover:text-red-600 transition-colors group">
              <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-500" />
              {t.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Version mobile header simple si besoin */}
        <div className="md:hidden p-4 bg-white border-b flex justify-between items-center">
            <span className="font-black text-indigo-600">{t.brand}</span>
            <button className="p-2 bg-gray-50 rounded-lg"><LayoutDashboard className="w-5 h-5" /></button>
        </div>
        
        <div className="h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}