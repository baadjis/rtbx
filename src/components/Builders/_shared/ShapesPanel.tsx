/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCanvas } from "./CanvasContext";
import { sharedBuilderData } from "./data";
import { v4 as uuidv4 } from 'uuid';


// ─── Shapes panel ─────────────────────────────────────────────────────────────
export default function ShapesPanel({ lang }: { lang: 'fr' | 'en' }) {
  const { addElement } = useCanvas();
  const t = sharedBuilderData[lang];

  const addShape = (type: 'rectangle' | 'circle' | 'line') => {
    addElement({
      id: uuidv4(), type,
      x: 180, y: 180,
      width: type === 'line' ? 320 : 200,
      height: type === 'line' ? 4 : 200,
      style: { fill: '#7c3aed', stroke: '#5b21b6', strokeWidth: 0 },
    } as any);
  };

  const shapes = [
    { key: 'rectangle', label: t.shapesPanel.rectangle, color: '#7c3aed',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><rect x="3" y="6" width="18" height="12" rx="2" opacity="0.9"/></svg> },
    { key: 'circle', label: t.shapesPanel.circle, color: '#0ea5e9',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><circle cx="12" cy="12" r="9" opacity="0.9"/></svg> },
    { key: 'line', label: t.shapesPanel.line, color: '#f59e0b',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-7 h-7"><path d="M4 12h16"/></svg> },
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