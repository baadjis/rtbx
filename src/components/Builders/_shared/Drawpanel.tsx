/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCanvas } from "./CanvasContext";

// ─── DrawPanel ────────────────────────────────────────────────────────────────
export default function DrawPanel({ lang }: { lang: 'fr' | 'en' }) {
  const { drawTool, setDrawTool, drawColor, setDrawColor, drawSize, setDrawSize, elements, deleteElement } = useCanvas();

  const tools = [
    {
      key: 'pen' as const,
      label: lang === 'fr' ? 'Stylo' : 'Pen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
    },
    {
      key: 'brush' as const,
      label: lang === 'fr' ? 'Pinceau' : 'Brush',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08"/>
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1 3.5 1 1.66 0 3-1.34 3-3s-1.34-3.04-1.5-3.04z"/>
        </svg>
      ),
    },
    {
      key: 'eraser' as const,
      label: lang === 'fr' ? 'Gomme' : 'Eraser',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M20 20H7L3 16l10-10 7 7-1.5 1.5"/>
          <path d="M6.5 17.5l5-5"/>
        </svg>
      ),
    },
  ];

  // Palette de couleurs rapides
  const palette = [
    '#000000', '#ffffff', '#7c3aed', '#06b6d4',
    '#f59e0b', '#ef4444', '#10b981', '#f97316',
    '#ec4899', '#6366f1', '#84cc16', '#64748b',
  ];

  const drawEls = elements.filter((el:any) => el.type === 'draw');

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Dessin' : 'Draw'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Outils */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">
            {lang === 'fr' ? 'Outil' : 'Tool'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <button
                key={tool.key}
                onClick={() => setDrawTool(drawTool === tool.key ? null : tool.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  drawTool === tool.key
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-violet-300 hover:bg-violet-50/50'
                }`}
              >
                {tool.icon}
                <span className="text-[10px] font-semibold">{tool.label}</span>
              </button>
            ))}
          </div>
          {drawTool && (
            <p className="text-[10px] text-violet-500 text-center mt-2 font-medium">
              {lang === 'fr' ? '● Mode dessin actif — cliquer pour désactiver' : '● Draw mode active — click to deactivate'}
            </p>
          )}
        </div>

        {/* Taille */}
        {drawTool && drawTool !== 'eraser' && (
          <div>
            <div className="flex justify-between mb-1.5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                {lang === 'fr' ? 'Taille' : 'Size'}
              </p>
              <span className="text-xs font-mono font-bold text-violet-600">{drawSize}px</span>
            </div>
            <input
              type="range" min={1} max={50} value={drawSize}
              onChange={(e) => setDrawSize(Number(e.target.value))}
              className="w-full h-1.5 rounded-full accent-violet-600 cursor-pointer"
            />
            {/* Preview taille */}
            <div className="flex items-center justify-center mt-2 h-8">
              <div
                className="rounded-full bg-current"
                style={{
                  width:  Math.min(drawSize * 2, 48),
                  height: Math.min(drawSize * 2, 48),
                  backgroundColor: drawColor,
                  opacity: drawTool === 'brush' ? 0.7 : 1,
                }}
              />
            </div>
          </div>
        )}

        {/* Couleur */}
        {drawTool && drawTool !== 'eraser' && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">
              {lang === 'fr' ? 'Couleur' : 'Color'}
            </p>
            {/* Palette rapide */}
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              {palette.map((color) => (
                <button
                  key={color}
                  onClick={() => setDrawColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    drawColor === color
                      ? 'border-violet-500 scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                />
              ))}
            </div>
            {/* Color picker custom */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: drawColor }}
              >
                <input
                  type="color" value={drawColor}
                  onChange={(e) => setDrawColor(e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-500 font-mono">{drawColor}</span>
            </label>
          </div>
        )}

        {/* Gomme — taille seulement */}
        {drawTool === 'eraser' && (
          <div>
            <div className="flex justify-between mb-1.5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                {lang === 'fr' ? 'Taille gomme' : 'Eraser size'}
              </p>
              <span className="text-xs font-mono font-bold text-violet-600">{drawSize}px</span>
            </div>
            <input
              type="range" min={5} max={80} value={drawSize}
              onChange={(e) => setDrawSize(Number(e.target.value))}
              className="w-full h-1.5 rounded-full accent-violet-600 cursor-pointer"
            />
          </div>
        )}

        {/* Traits dessinés — liste + effacer tout */}
        {drawEls.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                {lang === 'fr' ? `${drawEls.length} trait(s)` : `${drawEls.length} stroke(s)`}
              </p>
              <button
                onClick={() => drawEls.forEach((el:any) => deleteElement(el.id))}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors"
              >
                {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}