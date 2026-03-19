/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({ links }: { links: any[] }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        // Détecte si le lien est actif
        const isActive = pathname === link.href;

        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`flex items-center gap-2 text-[13px] md:text-sm font-bold uppercase tracking-wider no-underline transition-all
              ${isActive 
                ? 'text-indigo-600 dark:text-indigo-400' // Couleur quand actif
                : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400' // Couleur normale
              }`}
          >
            {link.icon && link.icon}
            {link.label}
          </Link>
        );
      })}
    </>
  );
}