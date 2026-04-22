/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-undef */

import { useCanvas } from "./CanvasContext";

// ─── Layers panel ─────────────────────────────────────────────────────────────
export default function LayersPanel({ lang ,icons}: { lang: 'fr' | 'en',icons:any }) {
  const { elements, selectedId, selectElement, deleteElement, bringToFront, sendToBack } = useCanvas();
  const typeIcon: Record<string, string> = {
    text: '𝕋', rectangle: '▬', circle: '●', line: '—', image: '🖼', group: '⊞', container: '⊞',
  };
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Calques' : 'Layers'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 gap-2 py-12">
            <icons.Layers />
            <p className="text-xs">{lang === 'fr' ? 'Aucun calque' : 'No layers yet'}</p>
          </div>
        )}
        {[...elements].reverse().map((el, i) => (
          <div key={el.id} onClick={() => selectElement(el.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer
              transition-all duration-150 group mb-1
              ${selectedId === el.id
                ? 'bg-violet-100 dark:bg-violet-900/40 ring-1 ring-violet-400/50'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
          >
            <span className="text-sm w-5 text-center text-gray-400 font-mono">
              {typeIcon[el.type] || '◈'}
            </span>
            <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
              {el.type === 'text' ? (el as any).text?.slice(0, 20) || 'Texte' : `${el.type} ${elements.length - i}`}
            </span>
            <div className="hidden group-hover:flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); bringToFront(el.id); }}
                className="text-gray-400 hover:text-violet-500 text-xs px-1">↑</button>
              <button onClick={(e) => { e.stopPropagation(); sendToBack(el.id); }}
                className="text-gray-400 hover:text-violet-500 text-xs px-1">↓</button>
              <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                className="text-gray-400 hover:text-red-500 text-xs px-1">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
