'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Wrench, 
  Wallet, 
  LayoutDashboard, 
  QrCode, 
  Settings 
} from 'lucide-react';

export default function BottomNav({ lang }: { lang: string }) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: lang === 'fr' ? 'Dashboard' : 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard' 
    },
    { 
      name: lang === 'fr' ? 'Outils' : 'Tools', 
      icon: Wrench, 
      href: '/tools' 
    },
    { 
      name: 'Scan', 
      icon: QrCode, 
      href: '/scan', 
      primary: true 
    }, // Bouton central pour le marchand
    { 
      name: 'Wallet', 
      icon: Wallet, 
      href: '/dashboard/wallet' 
    },
    { 
      name: lang === 'fr' ? 'Réglages' : 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings' 
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-2 py-2 pb-6 flex justify-around items-end shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        // Détection de l'état actif (exact ou sous-route)
        const isActive = pathname === item.href;

        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className="no-underline flex flex-col items-center gap-1 group transition-transform active:scale-90"
          >
            <div className={`transition-all duration-300 flex items-center justify-center ${
              item.primary 
                ? 'bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none -translate-y-3 scale-110' 
                : isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-400'
            }`}>
              <item.icon 
                size={item.primary ? 26 : 22} 
                strokeWidth={isActive || item.primary ? 2.5 : 2} 
              />
            </div>
            
            {!item.primary && (
              <span className={`text-[10px] font-black uppercase tracking-tighter ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
              }`}>
                {item.name}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}