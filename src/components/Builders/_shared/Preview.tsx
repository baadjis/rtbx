// components/builders/_shared/Preview.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';

type Props = {
  lang: 'fr' | 'en';
};

export default function Preview({ lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { exportToPNG } = useCanvas();

  const handleExportPNG = async () => {
    const dataUrl = await exportToPNG();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'mon-design.png';
    link.click();
  };

  return (
    <div className="p-6 flex flex-col h-full bg-white dark:bg-gray-950">
      <h3 className="text-xl font-semibold mb-8 tracking-tight">
        {t.preview}
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-4xl">👁️</span>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
            Aperçu en temps réel
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Le design s’adapte automatiquement à ton écran
          </p>
        </div>
      </div>

      <button
        onClick={handleExportPNG}
        className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                   text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
      >
        ↓ Télécharger en PNG (Haute qualité)
      </button>

      <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-6">
        Sur iPhone, le mode sombre est automatique
      </p>
    </div>
  );
}