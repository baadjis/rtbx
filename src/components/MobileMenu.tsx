/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LangSwitcher from './LangSwitch';

export default function MobileMenu({ links, t, lang, isLoggedIn }: { links: any[], t: any, lang: string, isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex items-center">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 dark:text-slate-300 bg-transparent border-none">
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-6 z-[60] animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold uppercase tracking-wider transition-all no-underline ${
                  pathname === link.href 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                {link.icon && link.icon}
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-gray-100 dark:bg-slate-800 my-2"></div>
            
            {/* ZONE LANGUE */}
            <div className="flex justify-between items-center px-4 py-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {lang === 'fr' ? 'Langue' : 'Language'}
              </span>
              <LangSwitcher currentLang={lang} />
            </div>

            {/* ZONE LOGOUT (AFFICHEE UNIQUEMENT SI CONNECTÉ) */}
            {isLoggedIn && (
              <div className="mt-2 pt-2 border-t border-gray-50 dark:border-slate-800">
                <form action="/auth/signout" method="post">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 p-4 text-red-500 font-black uppercase text-xs tracking-[0.2em] bg-red-50 dark:bg-red-900/10 rounded-2xl border-none cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                    {lang === 'fr' ? 'Déconnexion' : 'Logout'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}