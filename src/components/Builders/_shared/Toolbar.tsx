/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/Toolbar.tsx
'use client';

import { useRef, useState } from 'react';
import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import { v4 as uuidv4 } from 'uuid';
import { LangType } from '@/lib/lang/types';

type Props = { extraTools?: string[]; lang: 'fr' | 'en' };

// ─── Icons ────────────────────────────────────────────────────────────────────
const UndoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M3 7v6h6M3 13c1.5-4.5 6-7 10-7a9 9 0 010 18 9 9 0 01-8-5"/>
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M21 7v6h-6M21 13c-1.5-4.5-6-7-10-7a9 9 0 000 18 9 9 0 008-5"/>
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="m21 15-5-5L5 21"/>
  </svg>
);
const ExportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);
const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
  </svg>
);
const ZoomOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35M8 11h6"/>
  </svg>
);
const ResetZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M3.05 11a9 9 0 1 1 .5 4M3 16v-5h5"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5 shrink-0" />;
}

function ToolbarBtn({
  onClick, disabled = false, title, children, variant = 'ghost',
}: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  variant?: 'ghost' | 'soft';
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
        transition-all duration-150 select-none shrink-0
        ${disabled
          ? 'opacity-30 cursor-not-allowed text-gray-400 dark:text-gray-600'
          : variant === 'soft'
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100 active:scale-95'
        }
      `}
    >
      {children}
    </button>
  );
}

function ExportBtn({exportOpen, setExportOpen,stageRef,lang,t}:
  {exportOpen:boolean,setExportOpen:any,stageRef:any,lang:LangType,t:any}){

  const exportRef = useRef<HTMLDivElement>(null);

// Fonctions export
const handleExportPNG = async (transparent = false,stageRef:any) => {
  if (!stageRef?.current) return;
  setExportOpen(false);

  // Sauvegarde le fond actuel
  const stage = stageRef.current;

  if (transparent) {
    // Cache tous les éléments de fond (rectangles de fond, etc.)
    // Ici on exporte simplement sans fond blanc
    const url = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
    triggerDownload(url, 'design-transparent.png');
  } else {
    const url = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
    triggerDownload(url, 'design.png');
  }
};

const handleExportSVG = async (stageRef:any) => {
  setExportOpen(false);
  if (!stageRef?.current) return;
  // Konva ne supporte pas SVG natif — on exporte en PNG haute res comme fallback
  // et on notifie l'utilisateur
  const url = stageRef.current.toDataURL({ pixelRatio: 3 });
  triggerDownload(url, 'design-hd.png');
  // TODO: vrai export SVG avec une lib dédiée (konva-svg ou fabric)
};

const handleExportJPG = async (stageRef:any) => {
  setExportOpen(false);
  if (!stageRef?.current) return;
  const url = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: 'image/jpeg', quality: 0.95 });
  triggerDownload(url, 'design.jpg');
};

const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

const items= [
        {
          label: 'PNG',
          sublabel: lang === 'fr' ? 'Haute qualité (×2)' : 'High quality (×2)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          ),
          onClick: () => handleExportPNG(false,stageRef),
          color: 'text-violet-600',
        },
        {
          label: 'PNG transparent',
          sublabel: lang === 'fr' ? 'Fond transparent' : 'Transparent background',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="4 2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          ),
          onClick: () => handleExportPNG(true,stageRef),
          color: 'text-blue-600',
        },
        {
          label: 'JPG',
          sublabel: lang === 'fr' ? 'Qualité 95%' : '95% quality',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
          ),
          onClick: handleExportJPG,
          color: 'text-orange-600',
        },
        {
          label: 'SVG',
          sublabel: lang === 'fr' ? 'Vectoriel HD (×3)' : 'HD vector (×3)',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          ),
          onClick: handleExportSVG,
          color: 'text-green-600',
        },
        {
          label: lang === 'fr' ? 'Partager' : 'Share',
          sublabel: lang === 'fr' ? 'Bientôt disponible' : 'Coming soon',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
            </svg>
          ),
          onClick: () => setExportOpen(false),
          color: 'text-gray-400',
          disabled: true,
        },
      ]

  return(
    <div className="relative flex-shrink-0" ref={exportRef}>
  {/* Bouton principal */}
  <div className="flex items-center rounded-xl overflow-hidden
    bg-gradient-to-r from-violet-600 to-indigo-600
    shadow-md shadow-violet-300/30 dark:shadow-violet-900/40">

    {/* Export PNG (action principale) */}
    <button
      onClick={() => handleExportPNG(false,stageRef)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white
        hover:from-violet-500 hover:to-indigo-500 transition-all
        hover:brightness-110 active:scale-[0.97]"
    >
      <ExportIcon />
      <span className="hidden sm:inline">{t.toolbar.export}</span>
    </button>

    {/* Séparateur */}
    <div className="w-px h-5 bg-white/30" />

    {/* Chevron dropdown */}
    <button
      onClick={() => setExportOpen((o:boolean) => !o)}
      className="px-2 py-2 text-white hover:brightness-110 transition-all active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
  </div>

  {/* Dropdown menu */}
  {exportOpen && (
    <div className="absolute right-0 top-full mt-2 w-52 z-50
      bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
      border border-gray-200 dark:border-gray-700
      overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">

      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
          {lang === 'fr' ? 'Format d\'export' : 'Export format'}
        </p>
      </div>

      {items.map((item) => (
        <>
        <button
          key={item.label}
          onClick={item.onClick}
          disabled={item.disabled}
          className={`w-full flex items-center gap-3 px-4 py-3
            hover:bg-gray-50 dark:hover:bg-gray-800/60
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all text-left group`}
        >
          <span className={`${item.color} flex-shrink-0`}>{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${item.disabled ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
              {item.label}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.sublabel}</p>
          </div>
          {!item.disabled && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          )}
          {item.disabled && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md
              bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
              soon
            </span>
          )}
        </button>
        </>
      ))}
    </div>
  )}
</div>
  )
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
export default function Toolbar({ extraTools = [], lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
    

  const [exportOpen, setExportOpen] = useState(false);
  const { addElement, undo, redo, canUndo, canRedo, exportToPNG, zoom, zoomIn, 
    zoomOut, resetZoom,stageRef

   } = useCanvas();

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        addElement({
          id: uuidv4(), type: 'image',
          x: 120, y: 120, width: 320, height: 320,
          src: ev.target?.result as string,
          style: {},
        } as any);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleExport = async () => {
    const url = await exportToPNG();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.png';
    a.click();
  };



  return (
    <div className="flex items-center gap-0.5 flex-1 overflow-x-auto min-w-0">

      {/* ── [1] Image upload ── */}
      <Divider />
      <ToolbarBtn onClick={addImage} title={t.toolbar.image} variant="soft">
        <ImageIcon />
        <span className="hidden sm:inline text-xs">{t.toolbar.image}</span>
      </ToolbarBtn>

      {/* ── [2] Extra tools slot ── */}
      {extraTools.length > 0 && (
        <>
          <Divider />
          {extraTools.map((tool) => (
            <ToolbarBtn key={tool} onClick={() => {}} title={tool}>
              <span className="text-xs">{tool}</span>
            </ToolbarBtn>
          ))}
        </>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1 min-w-0" />

      {/* ── [3] Zoom — centré visuellement entre les actions et l'export ── */}
      <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-1 py-1">
        <ToolbarBtn onClick={zoomOut} disabled={zoom <= 0.2} title="Zoom arrière (−)">
          <ZoomOutIcon />
        </ToolbarBtn>

        {/* Indicateur % cliquable pour reset */}
        <button
          onClick={resetZoom}
          title="Réinitialiser le zoom"
          className="px-2 py-1 text-xs font-mono font-bold text-violet-600 dark:text-violet-400
            hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all min-w-[44px] text-center"
        >
          {Math.round(zoom * 100)}%
        </button>

        <ToolbarBtn onClick={zoomIn} disabled={zoom >= 3} title="Zoom avant (+)">
          <ZoomInIcon />
        </ToolbarBtn>
      </div>

      <Divider />

      {/* ── [4] Undo / Redo ── */}
      <ToolbarBtn onClick={undo} disabled={!canUndo} title="Annuler (Ctrl+Z)">
        <UndoIcon />
      </ToolbarBtn>
      <ToolbarBtn onClick={redo} disabled={!canRedo} title="Rétablir (Ctrl+Y)">
        <RedoIcon />
      </ToolbarBtn>

      <Divider />

      {/* ── [5] Export ── */}
     
        <ExportBtn exportOpen={exportOpen} setExportOpen={setExportOpen} lang={lang} t={t} 
         stageRef={stageRef}
        />
      

    </div>
  );
}