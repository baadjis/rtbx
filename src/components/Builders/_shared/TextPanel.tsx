/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCanvas } from "./CanvasContext";
import { v4 as uuidv4 } from 'uuid';


// ─── Text panel ───────────────────────────────────────────────────────────────
export default function TextPanel({ lang }: { lang: 'fr' | 'en' }) {
  const { addElement } = useCanvas();
  const presets = [
    { label: lang === 'fr' ? 'Titre principal' : 'Main Title', fontSize: 64, weight: 800, sample: 'Titre' },
    { label: lang === 'fr' ? 'Sous-titre' : 'Subtitle', fontSize: 40, weight: 600, sample: 'Sous-titre' },
    { label: lang === 'fr' ? 'Corps de texte' : 'Body', fontSize: 24, weight: 400, sample: 'Corps de texte' },
    { label: lang === 'fr' ? 'Légende' : 'Caption', fontSize: 16, weight: 400, sample: 'Légende' },
  ];
    
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Texte' : 'Text'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() =>
              addElement({
                id: uuidv4(), type: 'text',
                x: 100, y: 100,
                width: 400, height: p.fontSize * 1.6,
                text: p.sample, fontSize: p.fontSize,
                fontFamily: 'Sora, sans-serif',
                style: { fill: '#111111' }, align: 'left',
              } as any)
            }
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700/60
              hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all duration-200"
          >
            <p className="text-gray-800 dark:text-gray-100 truncate"
              style={{ fontSize: Math.min(p.fontSize * 0.38, 28), fontWeight: p.weight }}>
              {p.sample}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{p.label} — {p.fontSize}px</p>
          </button>
        ))}
      </div>
    </div>
  );
}