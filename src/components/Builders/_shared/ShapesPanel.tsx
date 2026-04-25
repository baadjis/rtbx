/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCanvas } from "./CanvasContext";
import { sharedBuilderData } from "./data";
import { v4 as uuidv4 } from 'uuid';
import { ShapeType } from "./types";


// ─── Shapes panel ─────────────────────────────────────────────────────────────
export default function ShapesPanel({ lang }: { lang: 'fr' | 'en' }) {
  const { addElement,startBezierDraw } = useCanvas();
  const t = sharedBuilderData[lang];
const addShape = (type: ShapeType) => {

    const isLine  = type === 'line' || type === 'arrow';
     if (type === 'bezier') {
    startBezierDraw(); // ← active le mode dessin
    return;
  }
    addElement({
      id: uuidv4(), type,
      x: 160, y: 160,
      width:  isLine ? 280 : 180,
      height: isLine ? 4   : 180,
      style: { fill: '#7c3aed', strokeWidth: 0 },
    } as any);

    
  };

  const shapes: { key: ShapeType; label: string; color: string; icon: React.ReactNode }[] = [
    {
      key: 'rectangle', label: 'Rectangle', color: '#7c3aed',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>,
    },
    {
      key: 'circle', label: 'Cercle', color: '#0ea5e9',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><circle cx="12" cy="12" r="10"/></svg>,
    },
    {
      key: 'triangle', label: 'Triangle', color: '#10b981',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 3L22 21H2L12 3z"/></svg>,
    },
    {
      key: 'diamond', label: 'Diamant', color: '#f59e0b',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2l10 10-10 10L2 12z"/></svg>,
    },
    {
      key: 'star', label: 'Étoile', color: '#f43f5e',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>
        </svg>
      ),
    },
    {
      key: 'pentagon', label: 'Pentagone', color: '#8b5cf6',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 2l10 7.27-3.82 11.73H5.82L2 9.27z"/>
        </svg>
      ),
    },
    {
      key: 'hexagon', label: 'Hexagone', color: '#06b6d4',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17 2H7L2 12l5 10h10l5-10z"/>
        </svg>
      ),
    },
    {
      key: 'cross', label: 'Croix', color: '#ef4444',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3v-6h6z"/>
        </svg>
      ),
    },
    {
      key: 'line', label: 'Ligne', color: '#64748b',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7"><path d="M4 12h16"/></svg>,
    },
    {
      key: 'arrow', label: 'Flèche', color: '#f97316',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      ),
    },

    {
  key: 'bezier' as any,
  label: 'Bézier',
  color: '#ec4899',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
      <path d="M3 20 C 8 8, 16 8, 21 20" strokeLinecap="round"/>
      <circle cx="3"  cy="20" r="1.5" fill="currentColor"/>
      <circle cx="21" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  ),
},
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {t.shapesPanel.title}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((s) => (
            <button key={s.key} onClick={() => addShape(s.key as any)}
              style={{ color: s.color }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200
                dark:border-gray-700/60 hover:border-violet-400 hover:bg-violet-50
                dark:hover:bg-violet-900/10 transition-all duration-200"
            >
              {s.icon}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}