import { useState } from "react";
import { useCanvas } from "./CanvasContext";
import { LangType } from "@/lib/lang/types";
import { CanvasElement } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export  default // ─── LayersPanel ──────────────────────────────────────────────────────────────
function LayersPanel({ lang,icons }: { lang: LangType, icons:any }) {
  const {
    elements, selectedId, selectElement,
    deleteElement, bringToFront, sendToBack,
    groupElements, ungroupElements,toggleLock
  } = useCanvas();

  const [multiSelect, setMultiSelect] = useState<string[]>([]);

  // ── Icônes SVG par type ────────────────────────────────────────────────────
  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'text':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
        );
      case 'image':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        );
      case 'group':
      case 'container':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <rect x="3" y="3" width="8" height="8" rx="2"/>
            <rect x="13" y="3" width="8" height="8" rx="2"/>
            <rect x="3" y="13" width="8" height="8" rx="2"/>
            <rect x="13" y="13" width="8" height="8" rx="2"/>
          </svg>
        );
      case 'rectangle':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
          </svg>
        );
      case 'circle':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        );
      case 'triangle':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 4L22 20H2L12 4z"/>
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>
          </svg>
        );
      case 'line':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M4 12h16"/>
          </svg>
        );
      case 'arrow':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        );
      case 'bezier':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M3 20C8 8 16 8 21 20" strokeLinecap="round"/>
          </svg>
        );
      case 'draw':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 2l10 10-10 10L2 12z"/>
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M17 2H7L2 12l5 10h10l5-10z"/>
          </svg>
        );
      case 'pentagon':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 2l10 7.27-3.82 11.73H5.82L2 9.27z"/>
          </svg>
        );
      case 'octagon':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/>
          </svg>
        );
      case 'cross':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 2v20M2 12h20"/>
          </svg>
        );
      case 'blob':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <path d="M12 3C9 3 6.5 4 5 6c-1.5 2-2 4-1.5 6.5.5 2.5 2 4.5 4 5.5 2 1 4.5 1.5 6.5.5 2-1 3.5-3 4-5.5.5-2.5 0-5-1.5-7C15 3.5 13 3 12 3z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
          </svg>
        );
    }
  };

  const getLabel = (el: CanvasElement, index: number): string => {
    if (el.type === 'text')  return (el as any).text?.slice(0, 20) || 'Texte';
    if (el.type === 'group') return `${lang === 'fr' ? 'Groupe' : 'Group'} (${(el as any).children?.length ?? 0})`;
    if (el.type === 'draw')  return `${lang === 'fr' ? 'Trait' : 'Stroke'} ${index + 1}`;
    return `${el.type} ${index + 1}`;
  };

  const reversed = [...elements].reverse();

  const toggleMulti = (id: string) => {
    setMultiSelect((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGroup = () => {
    if (multiSelect.length < 2) return;
    groupElements(multiSelect);
    setMultiSelect([]);
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Calques' : 'Layers'}
        </p>
        <span className="text-[10px] font-mono text-gray-300 dark:text-gray-600">
          {elements.length}
        </span>
      </div>

      {/* ── Bouton group (multi-select actif) ── */}
      {multiSelect.length >= 2 && (
        <div className="px-3 pt-2 pb-1">
          <button
            onClick={handleGroup}
            className="w-full py-2 rounded-xl text-xs font-bold
              bg-gradient-to-r from-violet-600 to-indigo-600 text-white
              hover:from-violet-500 hover:to-indigo-500
              shadow-md shadow-violet-300/30 transition-all"
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="3" y="3" width="8" height="8" rx="2"/>
                <rect x="13" y="3" width="8" height="8" rx="2"/>
                <rect x="3" y="13" width="8" height="8" rx="2"/>
                <rect x="13" y="13" width="8" height="8" rx="2"/>
              </svg>
              {lang === 'fr' ? `Grouper (${multiSelect.length})` : `Group (${multiSelect.length})`}
            </span>
          </button>
          <button
            onClick={() => setMultiSelect([])}
            className="w-full py-1.5 mt-1 rounded-xl text-[10px] font-semibold
              text-gray-400 hover:text-gray-600 transition-colors"
          >
            {lang === 'fr' ? 'Annuler la sélection' : 'Cancel selection'}
          </button>
        </div>
      )}

      {/* ── Liste des calques ── */}
      <div className="flex-1 overflow-y-auto p-2">
        {reversed.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
            <icons.Layers />
            <p className="text-xs text-gray-300 dark:text-gray-600">
              {lang === 'fr' ? 'Aucun calque' : 'No layers yet'}
            </p>
          </div>
        )}

        {reversed.map((el, i) => {
          const isSelected = selectedId === el.id;
          const isMulti    = multiSelect.includes(el.id);
          const isGroup    = el.type === 'group';

          return (
            <div key={el.id}>
              {/* ── Row ── */}
              <div
                onClick={() => {
                  if (multiSelect.length > 0) {
                    toggleMulti(el.id);
                  } else {
                    selectElement(el.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleMulti(el.id);
                }}
                className={`
                  flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer
                  transition-all duration-150 group mb-0.5 select-none
                  ${isSelected && !isMulti
                    ? 'bg-violet-100 dark:bg-violet-900/40 ring-1 ring-violet-400/40'
                    : isMulti
                    ? 'bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-400/40'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }
                `}
              >
                {/* Checkbox multi-select */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleMulti(el.id); }}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center
                    flex-shrink-0 transition-all ${
                    isMulti
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 bg-transparent'
                  }`}
                >
                  {isMulti && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>

                {/* Type icon */}
                <span className={`flex-shrink-0 ${
                  isSelected ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  <TypeIcon type={el.type} />
                </span>

                {/* Label */}
                <span className={`flex-1 text-xs font-medium truncate ${
                  isSelected
                    ? 'text-violet-700 dark:text-violet-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {getLabel(el, elements.length - 1 - i)}
                </span>

                {/* Actions (visibles au hover) */}
                <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); bringToFront(el.id); }}
                    title={lang === 'fr' ? 'Amener devant' : 'Bring forward'}
                    className="w-5 h-5 rounded-md flex items-center justify-center
                      text-gray-400 hover:text-violet-500 hover:bg-violet-100
                      dark:hover:bg-violet-900/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); sendToBack(el.id); }}
                    title={lang === 'fr' ? 'Envoyer derrière' : 'Send back'}
                    className="w-5 h-5 rounded-md flex items-center justify-center
                      text-gray-400 hover:text-violet-500 hover:bg-violet-100
                      dark:hover:bg-violet-900/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                  </button>
                  {isGroup && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); ungroupElements(el.id); }}
                      title={lang === 'fr' ? 'Dégrouper' : 'Ungroup'}
                      className="w-5 h-5 rounded-md flex items-center justify-center
                        text-gray-400 hover:text-orange-500 hover:bg-orange-100
                        dark:hover:bg-orange-900/30 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
                      </svg>
                    </button>

                    
                  )}

<button
  type="button"
  onClick={(e) => { e.stopPropagation(); toggleLock(el.id); }}
  title={el.locked
    ? (lang === 'fr' ? 'Déverrouiller' : 'Unlock')
    : (lang === 'fr' ? 'Verrouiller'   : 'Lock')
  }
  className={`w-5 h-5 rounded-md flex items-center justify-center
    transition-all ${
    el.locked
      ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30'
      : 'text-gray-400 hover:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30'
  }`}
>
  {el.locked ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 019.9-1"/>
    </svg>
  )}
</button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                    title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                    className="w-5 h-5 rounded-md flex items-center justify-center
                      text-gray-400 hover:text-red-500 hover:bg-red-100
                      dark:hover:bg-red-900/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Enfants du groupe (indentés) */}
              {isGroup && (el as any).children?.map((child: any, ci: number) => (
                <div
                  key={child.id}
                  className="flex items-center gap-2 pl-7 pr-2 py-1.5 mb-0.5
                    rounded-lg text-gray-400 dark:text-gray-500
                    border-l-2 border-violet-200 dark:border-violet-800/40 ml-3"
                >
                  <span className="flex-shrink-0 opacity-70">
                    <TypeIcon type={child.type} />
                  </span>
                  <span className="text-[11px] truncate">
                    {child.type === 'text'
                      ? child.text?.slice(0, 16) || 'Texte'
                      : `${child.type} ${ci + 1}`}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Footer hint ── */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[9px] text-gray-300 dark:text-gray-600 text-center leading-relaxed">
          {lang === 'fr'
            ? '☑ Clic droit ou case à cocher pour multi-sélectionner'
            : '☑ Right-click or checkbox to multi-select'}
        </p>
      </div>
    </div>
  );
}