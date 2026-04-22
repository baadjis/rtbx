/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/RemoveBgButton.tsx
'use client';

import { useState } from 'react';
import { useCanvas } from './CanvasContext';
import { ImageElement } from './types';

// npm install @imgly/background-removal
// Ce package tourne en WASM dans le browser, aucune API externe nécessaire
import { removeBackground } from '@imgly/background-removal';

type Props = { element: ImageElement; lang: 'fr' | 'en' };

export default function RemoveBgButton({ element, lang }: Props) {
  const { updateElement } = useCanvas();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRemoveBg = async () => {
    try {
      setLoading(true);
      setProgress(10);

      // Convertit le src en Blob
      const res  = await fetch(element.src);
      const blob = await res.blob();
      setProgress(30);

      // Remove background (WASM local)
      const resultBlob = await removeBackground(blob, {
        progress: (p:any) => setProgress(Math.round(30 + p * 60)),
      });
      setProgress(95);

      // Convertit en dataURL
      const reader = new FileReader();
      reader.onload = (e) => {
        updateElement(element.id, {
          removedBgSrc: e.target?.result as string,
          originalSrc:  element.src,
          bgRemoved:    true,
        } as any);
        setLoading(false);
        setProgress(0);
      };
      reader.readAsDataURL(resultBlob);

    } catch (err) {
      console.error('Remove BG error:', err);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleRestore = () => {
    updateElement(element.id, {
      bgRemoved: false,
      src: element.originalSrc ?? element.src,
    } as any);
  };

  return (
    <div className="space-y-2">
      {!element.bgRemoved ? (
        <button
          onClick={handleRemoveBg}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold
            bg-gradient-to-r from-violet-600 to-indigo-600 text-white
            hover:from-violet-500 hover:to-indigo-500
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all shadow-md shadow-violet-300/30"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity={0.3}/>
                <path d="M21 12a9 9 0 00-9-9"/>
              </svg>
              {progress}%
            </span>
          ) : (
            `✂️ ${lang === 'fr' ? 'Supprimer le fond' : 'Remove background'}`
          )}
        </button>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <span className="text-green-600 text-sm">✓</span>
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
              {lang === 'fr' ? 'Fond supprimé' : 'Background removed'}
            </span>
          </div>
          <button
            onClick={handleRestore}
            className="w-full py-2 rounded-xl text-xs font-semibold
              border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            {lang === 'fr' ? '↩ Restaurer le fond' : '↩ Restore background'}
          </button>
        </div>
      )}

      {/* Progress bar */}
      {loading && (
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}