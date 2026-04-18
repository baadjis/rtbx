// components/builders/flyer/FlyerBuilder.tsx
'use client';

import BaseBuilder from '../_shared/BaseBuilder';
import { flyerTemplates } from './templates';
import { sharedBuilderData } from '../_shared/data';

// Fonction pour récupérer la langue depuis les cookies (PWA)
function getCurrentLang(): 'fr' | 'en' {
  // Méthode simple avec document.cookie (fonctionne bien en PWA)
  if (typeof document === 'undefined') return 'fr';

  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(cookie => cookie.trim().startsWith('lang='));

  if (langCookie) {
    const lang = langCookie.split('=')[1]?.trim();
    if (lang === 'en' || lang === 'fr') return lang;
  }

  // Par défaut on retourne français
  return 'fr';
}

export default function FlyerBuilder() {
  const lang = getCurrentLang();

  const t = sharedBuilderData[lang] || sharedBuilderData.fr;

  return (
    <BaseBuilder
      // Tu peux surcharger le titre si tu veux
      title={lang=="fr"?"Créateur de Flyer":"Flyer designer"}
      width={794}           // A4 à 300 DPI (portrait)
      height={1123}
      defaultTemplates={flyerTemplates}
      extraTools={['bleed']}   // Outils spécifiques au flyer
      lang={lang}
    />
  );
}