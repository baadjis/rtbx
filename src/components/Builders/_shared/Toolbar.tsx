/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/Toolbar.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

type Props = { extraTools?: string[]; lang: 'fr' | 'en' };

export default function Toolbar({ extraTools = [], lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { addElement } = useCanvas();
  const [showShapes, setShowShapes] = useState(false);

  const addText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 150,
      y: 150,
      width: 400,
      height: 80,
      text: lang === 'fr' ? 'Votre texte' : 'Your text',
      fontSize: 42,
      style: { fill: '#000000' },
      align: 'center',
    } as any);
  };

  const addShape = (type: 'rectangle' | 'circle' | 'line') => {
    const base = {
      id: uuidv4(),
      x: 180,
      y: 180,
      width: type === 'line' ? 320 : 220,
      height: type === 'line' ? 6 : 180,
      style: { fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 8 },
    };

    addElement({ ...base, type } as any);
    setShowShapes(false);
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        addElement({
          id: uuidv4(),
          type: 'image',
          x: 120,
          y: 120,
          width: 320,
          height: 320,
          src: ev.target?.result as string,
          style: {},
        } as any);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 gap-2 overflow-x-auto">
      
      {/* Texte */}
      <button
        onClick={addText}
        className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium"
      >
        Aa {t.toolbar.text}
      </button>

      {/* Formes (comme PowerPoint) */}
      <div className="relative">
        <button
          onClick={() => setShowShapes(!showShapes)}
          className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium"
        >
          □ {t.toolbar.shapes}
        </button>

        {/* Panneau des formes */}
        {showShapes && (
          <div className="absolute top-14 left-0 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-4 grid grid-cols-4 gap-3 z-50 w-72">
            <button onClick={() => addShape('rectangle')} className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl">
              <div className="w-10 h-10 border-2 border-gray-700 rounded-md"></div>
              <span className="text-xs">{t.shapesPanel.rectangle}</span>
            </button>
            <button onClick={() => addShape('circle')} className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl">
              <div className="w-10 h-10 border-2 border-gray-700 rounded-full"></div>
              <span className="text-xs">{t.shapesPanel.circle}</span>
            </button>
            <button onClick={() => addShape('line')} className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl">
              <div className="w-10 h-2 bg-gray-700 rounded"></div>
              <span className="text-xs">{t.shapesPanel.line}</span>
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <button
        onClick={addImage}
        className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium"
      >
        📸 {t.toolbar.image}
      </button>

      <div className="flex-1" />

      <button className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl">
        {t.toolbar.export}
      </button>
    </div>
  );
}