'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';

export default function LangSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  // Trouver la langue actuelle dans la liste
  const current = languages.find(l => l.code === currentLang) || languages[0];

  const changeLang = (newLang: string) => {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
    router.refresh();
  };

  // Fermer le menu si on clique ailleurs sur la page
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Principal (Affiche la langue actuelle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm group border-none cursor-pointer"
      >
        <span className="text-base">{current.flag}</span>
        <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-slate-200">
          {current.code}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border-none bg-transparent cursor-pointer
                  ${currentLang === lang.code 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}