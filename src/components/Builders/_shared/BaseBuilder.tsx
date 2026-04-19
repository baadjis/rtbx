// components/builders/_shared/BaseBuilder.tsx
'use client';

import { CanvasProvider, useCanvas } from './CanvasContext';
import Toolbar from './Toolbar';
import EditCanvas from './EditCanvas';
import Preview from './Preview';
import { CanvasTemplate } from './types';
import { sharedBuilderData } from './data';
import PropertyPanel from './PropretyPanel';

type BaseBuilderProps = {
  title?: string;
  width: number;
  height: number;
  defaultTemplates: CanvasTemplate[];
  extraTools?: string[];
  lang: 'fr' | 'en';
};

// Contenu interne (utilise useCanvas)
function BaseBuilderContent({
  title,
  width,
  height,
  defaultTemplates,
  extraTools = [],
  lang,
}: BaseBuilderProps) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { loadTemplate } = useCanvas();

  const finalTitle = title || t.title;

  const handleLoadTemplate = (template: CanvasTemplate) => {
    loadTemplate(template);
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      
      {/* Sidebar gauche - Templates */}
      <div className="hidden md:flex w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold">{finalTitle}</h2>
        </div>
        
        <div className="p-5 overflow-auto flex-1">
          <h3 className="uppercase text-xs tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            {t.templates}
          </h3>
          <div className="space-y-3">
            {defaultTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                className="w-full text-left p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-[0.985]"
              >
                <div className="font-medium text-base">{template.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {template.width} × {template.height} px
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone centrale */}
      <div className="flex-1 flex flex-col min-h-0">
        <Toolbar 
          extraTools={extraTools} 
          lang={lang}
        />
        
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
          <EditCanvas 
            designWidth={width} 
            designHeight={height} 
          />
        </div>
      </div>

      {/* Sidebar droite - Preview */}
      {/* Sidebar droite - Propriétés */}
<div className="hidden lg:flex w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-col">
  <PropertyPanel lang={lang} />
</div>
    </div>
  );
}

// Wrapper principal
export default function BaseBuilder(props: BaseBuilderProps) {
  return (
    <CanvasProvider width={props.width} height={props.height}>
      <BaseBuilderContent {...props} />
    </CanvasProvider>
  );
}