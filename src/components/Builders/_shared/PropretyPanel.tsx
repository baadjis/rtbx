/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/PropertyPanel.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';

type Props = { lang: 'fr' | 'en' };

export default function PropertyPanel({ lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const {
    selectedId,
    elements,
    updateElement,
    deleteElement,
    bringToFront,
    sendToBack,
    addElement,
  } = useCanvas();

  const selected = elements.find((el) => el.id === selectedId);
  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <div className="text-6xl mb-6">👆</div>
        <p className="text-lg font-medium">{t.noSelection}</p>
      </div>
    );
  }

  const isText = selected.type === 'text';

  const duplicateElement = () => {
    const newElement = {
      ...selected,
      id: crypto.randomUUID(),
      x: selected.x + 30,
      y: selected.y + 30,
    };
    addElement(newElement as any);
  };

  return (
    <div className="p-6 h-full overflow-auto bg-white dark:bg-gray-950">
      <h3 className="font-semibold text-lg mb-6">{t.properties}</h3>

      {/* Rotation rapide */}
      <div className="mb-8">
        <label className="block text-sm text-gray-500 mb-3">{t.rotation}</label>
        <div className="grid grid-cols-4 gap-2">
          {[0, 90, 180, 270].map((angle) => (
            <button
              key={angle}
              onClick={() => updateElement(selected.id, { rotation: angle })}
              className="py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl"
            >
              {angle}°
            </button>
          ))}
        </div>
      </div>

      {/* Opacité */}
      <div className="mb-8">
        <label className="block text-sm text-gray-500 mb-3">{t.opacity}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round((selected.style.opacity ?? 1) * 100)}
          onChange={(e) => updateElement(selected.id, { style: { ...selected.style, opacity: Number(e.target.value) / 100 } })}
          className="w-full accent-blue-600"
        />
        <div className="text-right text-sm text-gray-500">{Math.round((selected.style.opacity ?? 1) * 100)}%</div>
      </div>

      {/* Ombre (Shadow) */}
      <div className="mb-8">
        <label className="block text-sm text-gray-500 mb-3">{t.shadow}</label>
        <div className="flex gap-4">
          <input
            type="color"
            value={selected.style.shadowColor || '#000000'}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, shadowColor: e.target.value } })}
          />
          <input
            type="range"
            min="0"
            max="30"
            value={selected.style.shadowBlur ?? 0}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, shadowBlur: Number(e.target.value) } })}
            className="flex-1 accent-blue-600"
          />
        </div>
      </div>

      {/* Alignement (seulement pour texte) */}
      {isText && (
        <div className="mb-8">
          <label className="block text-sm text-gray-500 mb-3">{t.alignment}</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => updateElement(selected.id, { align: align as any })}
                className={`flex-1 py-3 text-sm font-medium rounded-2xl ${
                  (selected as any).align === align ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {align === 'left' ? t.left : align === 'center' ? t.center : t.right}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-3 mt-10">
        <button onClick={() => bringToFront(selected.id)} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">↑ Bring to Front</button>
        <button onClick={() => sendToBack(selected.id)} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">↓ Send to Back</button>
        <button onClick={duplicateElement} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">📋 Dupliquer</button>
      </div>

      {/* Supprimer */}
      <button
        onClick={() => deleteElement(selected.id)}
        className="w-full py-4 mt-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl font-medium"
      >
        🗑️ {t.delete}
      </button>
    </div>
  );
}