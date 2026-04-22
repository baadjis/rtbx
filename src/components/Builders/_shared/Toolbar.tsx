/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/Toolbar.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import { v4 as uuidv4 } from 'uuid';

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

// ─── Toolbar ──────────────────────────────────────────────────────────────────
export default function Toolbar({ extraTools = [], lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { addElement, undo, redo, canUndo, canRedo, exportToPNG, zoom, zoomIn, zoomOut, resetZoom } = useCanvas();

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
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
          bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500
          text-white shadow-md shadow-violet-300/30 dark:shadow-violet-900/40
          transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]
          select-none shrink-0"
      >
        <ExportIcon />
        <span className="hidden sm:inline">{t.toolbar.export}</span>
      </button>

    </div>
  );
}