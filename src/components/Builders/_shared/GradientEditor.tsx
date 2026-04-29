/* eslint-disable @typescript-eslint/no-explicit-any */
import ColorDot from "./ColorDot";
import { DEFAULT_STOPS, GradientConfig, GradientStop } from "./types";

// ─── GradientEditor ───────────────────────────────────────────────────────────
export default function GradientEditor({ gradient, onChange, lang }: {
  gradient: GradientConfig; onChange: (g: GradientConfig) => void; lang: 'fr' | 'en';
}) {
  const stops = (gradient.stops?.length >= 2 ? gradient.stops : DEFAULT_STOPS)
    .slice().sort((a, b) => a.position - b.position);

  const addStop = () => {
    const mid = stops.length >= 2
      ? (stops[stops.length - 2].position + stops[stops.length - 1].position) / 2
      : 0.5;
    onChange({ ...gradient, stops: [...stops, { id: crypto.randomUUID(), color: '#ffffff', position: mid }] });
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    onChange({ ...gradient, stops: stops.filter((s) => s.id !== id) });
  };

  const updateStop = (id: string, patch: Partial<GradientStop>) => {
    onChange({ ...gradient, stops: stops.map((s) => s.id === id ? { ...s, ...patch } : s) });
  };

  const previewCss = (() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sorted.map((s) => `${s.color} ${s.position * 100}%`).join(', ');
    return gradient.type === 'radial'
      ? `radial-gradient(circle, ${stopsStr})`
      : `linear-gradient(${gradient.direction ?? 90}deg, ${stopsStr})`;
  })();

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="h-8 rounded-xl shadow-inner" style={{ background: previewCss }} />

      {/* Stops */}
      <div className="space-y-2">
        {stops.map((stop:any) => (
          <div key={stop.id} className="flex items-center gap-2">
            <ColorDot value={stop.color} onChange={(v) => updateStop(stop.id, { color: v })} />
            <div className="flex-1">
              <input
                type="range" min={0} max={100}
                value={Math.round(stop.position * 100)}
                onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) / 100 })}
                className="w-full h-1.5 rounded-full accent-violet-600 cursor-pointer"
              />
            </div>
            <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 w-7 text-right">
              {Math.round(stop.position * 100)}%
            </span>
            <button
              onClick={() => removeStop(stop.id)}
              disabled={stops.length <= 2}
              className="w-5 h-5 rounded-md text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add stop */}
      <button onClick={addStop}
        className="w-full py-2 rounded-xl border border-dashed border-violet-300 dark:border-violet-700
          text-xs font-semibold text-violet-600 dark:text-violet-400
          hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
      >
        + {lang === 'fr' ? 'Ajouter une couleur' : 'Add color stop'}
      </button>

      {/* Direction (linear) */}
      {gradient.type === 'linear' && (
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Direction</p>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {[0, 45, 90, 135].map((deg) => (
              <button key={deg}
                onClick={() => onChange({ ...gradient, direction: deg })}
                className={`py-1.5 text-xs rounded-lg font-mono transition-all ${
                  (gradient.direction ?? 90) === deg
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={360}
              value={gradient.direction ?? 90}
              onChange={(e) => onChange({ ...gradient, direction: Number(e.target.value) })}
              className="flex-1 h-1.5 rounded-full accent-violet-600 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-violet-600 w-8 text-right">
              {gradient.direction ?? 90}°
            </span>
          </div>
        </div>
      )}

      {/* Radius (radial) */}
      {gradient.type === 'radial' && (
        <div>
          <div className="flex justify-between mb-1.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {lang === 'fr' ? 'Rayon' : 'Radius'}
            </p>
            <span className="text-[10px] font-mono text-violet-600">
              {Math.round((gradient.radius ?? 1) * 100)}%
            </span>
          </div>
          <input type="range" min={10} max={150}
            value={Math.round((gradient.radius ?? 1) * 100)}
            onChange={(e) => onChange({ ...gradient, radius: Number(e.target.value) / 100 })}
            className="w-full h-1.5 rounded-full accent-violet-600 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}