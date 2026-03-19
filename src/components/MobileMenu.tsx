/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { Menu, X, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LangSwitcher from './LangSwitch';

export default function MobileMenu({ links, t, lang }: { links: any[], t: any, lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex items-center gap-2">
      {/* Bouton Hamburger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay du Menu (Tiroir) */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-2xl p-6 z-[60] animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold uppercase tracking-wider transition-all ${
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
            
            {/* LangSwitcher à l'intérieur du menu mobile */}
            <div className="flex justify-between items-center px-4">
              <span className="text-sm font-bold text-gray-400 uppercase">{lang === 'fr' ? 'Langue' : 'Language'}</span>
              <LangSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}