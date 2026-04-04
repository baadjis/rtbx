import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Data } from './data';
import { 
  LayoutDashboard, Link2, BarChart3, 
  Settings, LogOut, Wrench, Star, 
  Home, Store
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { BrandLogo } from '@/components/BrandLogo';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  const navItems = [
    { name: t.dashboard, iconName: 'dashboard', href: '/dashboard' },
    { name: lang === 'fr' ? "Mes Liens" : "My Links", iconName: 'links', href: '/dashboard/links' },
    { name: lang === 'fr' ? "Avis Google" : "Google Reviews", iconName: 'star', href: '/tools/google-reviews' },
    { name: t.my_businesses, iconName: 'store', href: '/dashboard/businesses' },
    { name: lang === 'fr' ? "Mes Points" : "My Points", iconName: 'award', href: '/dashboard/points' },
    { name: t.analytics, iconName: 'analytics', href: '#', badge: "Beta" },
    { name: t.settings, iconName: 'settings', href: '/dashboard/settings' },

  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar visible sur Desktop */}
      <DashboardSidebar navItems={navItems} t={t} lang={lang} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header : Unique header sur mobile pour le Dashboard */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 p-4 transition-colors">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-2">
                <Link href="/" className="no-underline active:scale-95 transition-transform">
                  <BrandLogo />
                </Link>
                <Link href="/dashboard" className="p-2 bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm">
                    <LayoutDashboard size={22} />
                </Link>
            </div>
        </header>

        {/* Zone de contenu : pb-28 pour laisser la place au BottomNav mobile */}
        <div className="h-full overflow-y-auto pb-28 lg:pb-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {children}
            </div>
        </div>

        {/* --- BOTTOM NAV MOBILE (App UX) --- */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-800 px-4 py-3 pb-8 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors">
            <Link href="/" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500 hover:text-indigo-600 transition-colors">
                <Home size={20} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
            </Link>
            <Link href="/tools" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500 hover:text-indigo-600 transition-colors">
                <Wrench size={20} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Tools</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 no-underline text-indigo-600 dark:text-indigo-400">
                <LayoutDashboard size={22} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Space</span>
            </Link>
            <Link href="/dashboard/links" className="flex flex-col items-center gap-1 no-underline text-gray-400 dark:text-slate-500 hover:text-indigo-600 transition-colors">
                <Link2 size={20} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Links</span>
            </Link>
            <form action="/auth/signout" method="post" className="flex flex-col items-center">
                <button type="submit" className="flex flex-col items-center gap-1 bg-transparent border-none p-0 m-0 text-gray-400 dark:text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                    <LogOut size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
                </button>
            </form>
        </nav>
      </main>
    </div>
  );
}