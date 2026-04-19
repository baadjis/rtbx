/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/PropertyPanel.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';

type Props = { lang: 'fr' | 'en' };

export default function PropertyPanel({ lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { selectedId, elements, updateElement, deleteElement } = useCanvas();

  const selected = elements.find(el => el.id === selectedId);

  if (!selected) {
    return (
      <div className="p-6 text-center text-gray-400 dark:text-gray-600 mt-20">
        <div className="text-5xl mb-4">👆</div>
        <p className="font-medium">{t.noSelection}</p>
        <p className="text-sm mt-2">Cliquez sur un élément du canvas pour modifier ses propriétés</p>
      </div>
    );
  }

  const isText = selected.type === 'text';

  return (
    <div className="p-6 h-full overflow-auto bg-white dark:bg-gray-950">
      <h3 className="font-semibold text-lg mb-6">{t.properties}</h3>

      {/* Couleur */}
      <div className="mb-8">
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Couleur de remplissage</label>
        <input
          type="color"
          value={selected.style.fill || '#000000'}
          onChange={(e) => 
            updateElement(selected.id, { 
              style: { ...selected.style, fill: e.target.value } 
            })
          }
          className="w-14 h-12 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
        />
      </div>

      {/* Si c'est du texte */}
      {isText && (
        <>
          <div className="mb-8">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3">Taille de police</label>
            <input
              type="range"
              min="12"
              max="120"
              step="1"
              value={(selected as any).fontSize || 32}
              onChange={(e) => 
                updateElement(selected.id, { 
                  fontSize: parseInt(e.target.value) 
                })
              }
              className="w-full accent-blue-600"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {(selected as any).fontSize || 32}px
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3">Alignement</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateElement(selected.id, { align: align as any })}
                  className={`flex-1 py-3 text-sm font-medium rounded-2xl transition-all ${
                    (selected as any).align === align 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bouton Supprimer */}
      <button
        onClick={() => deleteElement(selected.id)}
        className="w-full py-4 mt-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        🗑️ {t.delete}
      </button>
    </div>
  );
}