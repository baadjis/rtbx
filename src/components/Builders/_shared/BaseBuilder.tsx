/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/BaseBuilder.tsx
'use client';

import React, { useState } from 'react';
import { CanvasProvider, useCanvas } from './CanvasContext';
import Toolbar from './Toolbar';
import EditCanvas from './EditCanvas';
import { CanvasTemplate } from './types';
import { sharedBuilderData } from './data';
import PropertyPanel from './PropertyPanel';
import TemplatesPanel from './TemplatesPanel';
import TextPanel from './TextPanel';
import ShapesPanel from './ShapesPanel';
import LayersPanel from './LayerPanel';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Templates: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
      <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
    </svg>
  ),
  Text: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  ),
  Shapes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <circle cx="8" cy="16" r="4"/><rect x="12" y="3" width="9" height="9" rx="1"/>
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  Draw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
};

type SidebarPanel = 'templates' | 'text' | 'shapes' | 'images' | 'layers' | null;

type BaseBuilderProps = {
  title?: string;
  width: number;
  height: number;
  defaultTemplates: CanvasTemplate[];
  extraTools?: string[];
  lang: 'fr' | 'en';
};

// ─── Sidebar icon button ──────────────────────────────────────────────────────
function SidebarIconBtn({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        relative flex flex-col items-center gap-1.5 w-full py-3 px-1 rounded-xl
        transition-all duration-200
        ${active
          ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
          : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-300'
        }
      `}
    >
      {icon}
      <span className="text-[10px] font-semibold leading-none">{label}</span>
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-violet-500 rounded-r-full" />
      )}
    </button>
  );
}


// ─── BaseBuilderContent ───────────────────────────────────────────────────────
function BaseBuilderContent({ title, width, height, defaultTemplates, extraTools = [], lang }: BaseBuilderProps) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { loadTemplate } = useCanvas();
  const [activePanel, setActivePanel] = useState<SidebarPanel>('templates');
  const finalTitle = title || t.title;

  const togglePanel = (panel: SidebarPanel) =>
    setActivePanel((prev) => (prev === panel ? null : panel));

  const sidebarItems: { id: SidebarPanel; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: lang === 'fr' ? 'Templates' : 'Templates', icon: <Icons.Templates /> },
    { id: 'text',      label: lang === 'fr' ? 'Texte' : 'Text',          icon: <Icons.Text /> },
    { id: 'shapes',    label: lang === 'fr' ? 'Formes' : 'Shapes',       icon: <Icons.Shapes /> },
    { id: 'images',    label: lang === 'fr' ? 'Images' : 'Images',       icon: <Icons.Image /> },
    { id: 'layers',    label: lang === 'fr' ? 'Calques' : 'Layers',      icon: <Icons.Layers /> },
    { id: null,        label: lang === 'fr' ? 'Dessin' : 'Draw',         icon: <Icons.Draw /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden"
      style={{ fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" }}>

      {/* ── Top bar ── */}
      <header className="h-14 flex items-center px-4 gap-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 z-10">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-300/40 dark:shadow-violet-900/40">
            <span className="text-white text-xs font-bold">✦</span>
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-100 hidden sm:block">{finalTitle}</span>
        </div>
        <Toolbar extraTools={extraTools} lang={lang} />
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* Icon rail */}
        <nav className="w-14 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-3 gap-1 z-10">
          {sidebarItems.map((item) => (
            <SidebarIconBtn
              key={item.id ?? 'draw'}
              icon={item.icon}
              label={item.label}
              active={activePanel === item.id && item.id !== null}
              onClick={() => { if (item.id) togglePanel(item.id); }}
            />
          ))}
        </nav>

        {/* Expandable panel */}
        <div className={`shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out overflow-hidden
            ${activePanel ? 'w-64' : 'w-0'}`}>
          {activePanel === 'templates' && <TemplatesPanel templates={defaultTemplates} onLoad={loadTemplate} lang={lang} />}
          {activePanel === 'text'      && <TextPanel lang={lang} />}
          {activePanel === 'shapes'    && <ShapesPanel lang={lang} />}
          {activePanel === 'layers'    && <LayersPanel lang={lang}  icons={Icons} />}
          {activePanel === 'images'    && (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 gap-3 p-6">
              <Icons.Image />
              <p className="text-xs text-center">
                {lang === 'fr' ? "Utilisez le bouton Image dans la barre d'outils" : 'Use the Image button in the toolbar'}
              </p>
            </div>
          )}
        </div>

        {/* Canvas zone */}
        <main className="flex-1 flex items-center justify-center bg-[#f0f0f2] dark:bg-gray-950 min-h-0 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <EditCanvas designWidth={width} designHeight={height} />
        </main>

        {/* Property panel */}
        <aside className="hidden lg:flex w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-col">
          <PropertyPanel lang={lang} />
        </aside>

      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function BaseBuilder(props: BaseBuilderProps) {
  return (
    <CanvasProvider width={props.width} height={props.height}>
      <BaseBuilderContent {...props} />
    </CanvasProvider>
  );
}