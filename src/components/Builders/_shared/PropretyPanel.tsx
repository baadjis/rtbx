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
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8">
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
    <div className="p-6 h-full overflow-auto bg-white dark:bg-gray-950 space-y-8">
      <h3 className="font-semibold text-lg">{t.properties}</h3>

      {/* === COULEUR DE REMPLISSAGE + GRADIENT === */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">{t.fillColor}</label>
        <div className="flex gap-3">
          <input
            type="color"
            value={selected.style.fill || '#3b82f6'}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, fill: e.target.value } })}
            className="w-12 h-10 border rounded-xl cursor-pointer"
          />
          {/* Gradient simple (à améliorer plus tard avec 2 couleurs) */}
          <button
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl"
            onClick={() => {
              // Pour l'instant on met un gradient bleu-violet par défaut
              updateElement(selected.id, {
                style: { ...selected.style, fill: 'linear-gradient(#3b82f6, #8b5cf6)' }
              });
            }}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* === CONTOUR === */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">{t.stroke}</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={selected.style.stroke || '#000000'}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, stroke: e.target.value } })}
            className="w-10 h-10 border rounded-xl cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="20"
            value={selected.style.strokeWidth ?? 4}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, strokeWidth: Number(e.target.value) } })}
            className="flex-1 accent-blue-600"
          />
        </div>
      </div>

      {/* === TAILLE POLICE (texte uniquement) === */}
      {isText && (
        <div>
          <label className="block text-sm text-gray-500 mb-2">{t.fontSize}</label>
          <input
            type="range"
            min="12"
            max="120"
            value={(selected as any).fontSize || 32}
            onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
          <div className="text-right text-sm text-gray-500">
            {(selected as any).fontSize || 32}px
          </div>
        </div>
      )}

      {/* === ALIGNEMENT (texte uniquement) === */}
      {isText && (
        <div>
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
                {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : 'Droite'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === ROTATION === */}
      <div>
        <label className="block text-sm text-gray-500 mb-3">{t.rotation}</label>
        <div className="grid grid-cols-4 gap-2 mb-4">
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

      {/* === OPACITÉ === */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">{t.opacity}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round((selected.style.opacity ?? 1) * 100)}
          onChange={(e) => updateElement(selected.id, { style: { ...selected.style, opacity: Number(e.target.value) / 100 } })}
          className="w-full accent-blue-600"
        />
      </div>

      {/* === OMBRE + BLUR === */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-2">{t.shadow}</label>
          <input
            type="color"
            value={selected.style.shadowColor || '#000000'}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, shadowColor: e.target.value } })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-2">Blur</label>
          <input
            type="range"
            min="0"
            max="30"
            value={selected.style.shadowBlur ?? 0}
            onChange={(e) => updateElement(selected.id, { style: { ...selected.style, shadowBlur: Number(e.target.value) } })}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* === ACTIONS === */}
      <div className="grid grid-cols-2 gap-3 mt-10">
        <button onClick={() => bringToFront(selected.id)} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">{t.bring_to_front}</button>
        <button onClick={() => sendToBack(selected.id)} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">{t.sent_to_back}</button>
        <button onClick={duplicateElement} className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-2xl text-sm">📋 {t.duplicate}</button>
      </div>

      <button
        onClick={() => deleteElement(selected.id)}
        className="w-full py-4 mt-6 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl font-medium"
      >
        🗑️ {t.delete}
      </button>
    </div>
  );
}