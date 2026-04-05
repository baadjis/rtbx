import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Data } from './data';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Import des composants réutilisables
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import BottomNav from '@/components/BottomNav';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Protection de la zone Dashboard
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const t = Data[lang];

  // Liste des items pour la Sidebar Desktop
  const navItems = [
    { name: t.dashboard, iconName: 'dashboard', href: '/dashboard' },
    { name: lang === 'fr' ? "Mes Liens" : "My Links", iconName: 'links', href: '/dashboard/links' },
    { name: lang === 'fr' ? "Avis Google" : "Google Reviews", iconName: 'star', href: '/tools/google-reviews' },
    { name: t.my_businesses, iconName: 'store', href: '/dashboard/businesses' },
    { name: lang === 'fr' ? "Mes Points" : "My Points", iconName: 'award', href: '/dashboard/points' },
    { name: lang === 'fr' ? "Événements" : "Events", iconName: 'calendar', href: '/dashboard/events', badge: "Beta" },
    { name: lang === 'fr' ? "Mes Organisations" : "Organized Events", iconName: 'users', href: '/dashboard/events/organized', badge: "Beta" },
    { name: t.analytics, iconName: 'analytics', href: '#', badge: "Beta" },
    { name: t.settings, iconName: 'settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. SIDEBAR (Desktop uniquement : lg:flex) */}
      <DashboardSidebar navItems={navItems} t={t} lang={lang} />

      {/* 2. ZONE PRINCIPALE (Header + Content + Nav Mobile) */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* APPEL DU HEADER UNIQUE (Gère Logo + MobileMenu + Login/Dashboard button) */}
        <Header />

        {/* ZONE DE CONTENU DYNAMIQUE */}
        <div className="flex-1 overflow-y-auto pb-32 lg:pb-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
                {children}
            </div>
        </div>

        {/* 3. BOTTOM NAV (Mobile uniquement : lg:hidden) */}
        <BottomNav lang={lang} />

      </main>
    </div>
  );
}