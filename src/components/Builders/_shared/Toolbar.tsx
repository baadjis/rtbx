/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/Toolbar.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  extraTools?: string[];
  lang: 'fr' | 'en';
};

export default function Toolbar({ extraTools = [], lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { addElement } = useCanvas();

  const addText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 120,
      y: 150,
      width: 400,
      height: 80,
      text: lang === 'fr' ? 'Votre texte ici' : 'Your text here',
      fontSize: 42,
      style: { fill: '#000000' },
      align: 'center',
    } as any);
  };

  const addRectangle = () => {
    addElement({
      id: uuidv4(),
      type: 'rectangle',
      x: 180,
      y: 220,
      width: 300,
      height: 180,
      style: { 
        fill: '#3b82f6', 
        stroke: '#1e40af', 
        strokeWidth: 6,
        borderRadius: 12 
      },
    } as any);
  };

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 gap-3 overflow-x-auto">
      
      {/* Bouton Templates sur mobile */}
      <button 
        className="md:hidden px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
      >
        ☰ {t.toolbar.templatesBtn}
      </button>

      <button 
        onClick={addText}
        className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium transition-all active:scale-95"
      >
        Aa {t.toolbar.text}
      </button>

      <button 
        onClick={addRectangle}
        className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium transition-all active:scale-95"
      >
        □ {t.toolbar.shape}
      </button>

      {extraTools.includes('bleed') && (
        <button className="px-6 py-2.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-2xl text-sm font-medium">
          Fond perdu
        </button>
      )}

      <div className="flex-1" />

      {/* Bouton Export */}
      <button className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl text-sm transition-all">
        ↓ {t.toolbar.export}
      </button>
    </div>
  );
}