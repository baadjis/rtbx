import { sharedBuilderData } from "./data";
import { CanvasTemplate } from "./types";

// ─── Templates panel ──────────────────────────────────────────────────────────
export default function TemplatesPanel({ templates, onLoad, lang }: {
  templates: CanvasTemplate[]; onLoad: (t: CanvasTemplate) => void; lang: 'fr' | 'en';
}) {
  const t = sharedBuilderData[lang];
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
          {t.templates}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onLoad(tpl)}
            className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-700/60
              hover:border-violet-400 dark:hover:border-violet-500
              hover:shadow-md hover:shadow-violet-100 dark:hover:shadow-violet-900/20
              transition-all duration-200 overflow-hidden bg-white dark:bg-gray-900"
          >
            <div className="h-24 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/30 flex items-center justify-center">
              <span className="text-3xl opacity-30">✦</span>
            </div>
            <div className="px-3 py-2.5">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{tpl.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tpl.width} × {tpl.height} px</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
