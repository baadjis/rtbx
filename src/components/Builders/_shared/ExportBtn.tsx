/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/ExportBtn.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';

type Props = { lang: 'fr' | 'en' };

const ExportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

export default function ExportBtn({ lang }: Props) {
  const t = sharedBuilderData[lang];
  const { stageRef } = useCanvas();

  const [open, setOpen]       = useState(false);
  const [pos,  setPos]        = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  // ── Calcule la position du dropdown par rapport au bouton ─────────────────
  const handleToggle = () => {
    if (!btnRef.current) { setOpen((o) => !o); return; }
    const rect   = btnRef.current.getBoundingClientRect();
    const right  = window.innerWidth - rect.right;
    const top    = rect.bottom + 6;
    setPos({ top, right });
    setOpen((o) => !o);
  };

  // ── Ferme au clic extérieur ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    let active = true;
    const timeout = setTimeout(() => {
      if (!active) return;
      const handler = (e: MouseEvent) => {
        if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      (timeout as any)._handler = handler;
    }, 50);
    return () => {
      active = false;
      clearTimeout(timeout);
      const handler = (timeout as any)._handler;
      if (handler) document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  // ── Ferme si scroll ou resize ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll',  close, true);
    window.addEventListener('resize',  close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  // ── Helpers export ────────────────────────────────────────────────────────
  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportPNG = async ( stageRef: any ,transparent = false) => {
    setOpen(false);
    if (!stageRef?.current) return;
    const stage = stageRef.current;

    if (transparent) {
      // Cherche un rectangle de fond et le cache temporairement
      const bg = stage.findOne('.background');
      if (bg) bg.hide();
      const url = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
      if (bg) bg.show();
      stage.batchDraw();
      triggerDownload(url, 'design-transparent.png');
    } else {
      const url = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
      triggerDownload(url, 'design.png');
    }
  };

  const exportJPG = async (stageRef:any) => {
    setOpen(false);
    if (!stageRef?.current) return;
    const url = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType:   'image/jpeg',
      quality:    0.95,
    });
    triggerDownload(url, 'design.jpg');
  };

  const exportHD = async (stageRef:any) => {
    setOpen(false);
    if (!stageRef?.current) return;
    const url = stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });
    triggerDownload(url, 'design-hd.png');
  };

  // ── Export SVG ────────────────────────────────────────────────────────────────
const exportSVG = async (stageRef:any) => {
  setOpen(false);
  if (!stageRef?.current) return;
  const stage = stageRef.current;
  const w = stage.width();
  const h = stage.height();

  // Konva → canvas → dataURL → image dans SVG
  const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image href="${dataUrl}" x="0" y="0" width="${w}" height="${h}"/>
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  triggerDownload(url, 'design.svg');
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ── Export PDF ────────────────────────────────────────────────────────────────
const exportPDF = async (stageRef:any) => {
  setOpen(false);
  if (!stageRef?.current) return;

  const { default: jsPDF } = await import('jspdf');
  const stage  = stageRef.current;
  const w      = stage.width();
  const h      = stage.height();
  const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });

  // Orientation selon les proportions
  const orientation = w >= h ? 'landscape' : 'portrait';

  // Unité px → mm (1px ≈ 0.2646mm)
  const mmW = w * 0.2646;
  const mmH = h * 0.2646;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [mmW, mmH],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, mmW, mmH);
  pdf.save('design.pdf');
};

  // ── Options ───────────────────────────────────────────────────────────────
  const options = [
    {
      label:    'PNG',
      sublabel: lang === 'fr' ? 'Haute qualité ×2' : 'High quality ×2',
      color:    'text-violet-600',
      onClick:  () => exportPNG(stageRef,false),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
      ),
    },
    {
      label:    lang === 'fr' ? 'PNG transparent' : 'PNG transparent',
      sublabel: lang === 'fr' ? 'Sans fond' : 'No background',
      color:    'text-blue-500',
      onClick:  () => exportPNG(stageRef,true),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="4 2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
      ),
    },
    {
      label:    'JPG',
      sublabel: lang === 'fr' ? 'Qualité 95%' : '95% quality',
      color:    'text-orange-500',
      onClick: ()=> exportJPG(stageRef),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M8 12h8M12 8v8"/>
        </svg>
      ),
    },
    {
      label:    lang === 'fr' ? 'PNG HD' : 'PNG HD',
      sublabel: lang === 'fr' ? 'Ultra qualité ×3' : 'Ultra quality ×3',
      color:    'text-green-600',
      onClick:  ()=>exportHD(stageRef),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      label:    lang === 'fr' ? 'Partager' : 'Share',
      sublabel: lang === 'fr' ? 'Bientôt disponible' : 'Coming soon',
      color:    'text-gray-300',
      disabled: true,
      onClick:  () => {},
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
      ),
    },
    {
  label:    'SVG',
  sublabel: lang === 'fr' ? 'Vectoriel + image' : 'Vector + image',
  color:    'text-teal-600',
  onClick:  exportSVG,
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
},
{
  label:    'PDF',
  sublabel: lang === 'fr' ? 'Document imprimable' : 'Printable document',
  color:    'text-red-500',
  onClick:  exportPDF,
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1"/>
    </svg>
  ),
},
  ];

  return (
    <>
      {/* ── Bouton principal ── */}
      <div ref={btnRef} className="flex items-center rounded-xl overflow-hidden
        bg-gradient-to-r from-violet-600 to-indigo-600
        shadow-md shadow-violet-300/30 dark:shadow-violet-900/40 flex-shrink-0">

        {/* Action principale PNG */}
        <button
          type="button"
          onClick={() => exportPNG(stageRef,false)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white
            hover:brightness-110 active:scale-[0.97] transition-all"
        >
          <ExportIcon />
          <span className="hidden sm:inline">{t.toolbar.export}</span>
        </button>

        {/* Séparateur */}
        <div className="w-px h-5 bg-white/30 flex-shrink-0" />

        {/* Chevron */}
        <button
          type="button"
          onClick={handleToggle}
          className="px-2 py-2 text-white hover:brightness-110 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* ── Dropdown via portal — rendu dans document.body ── */}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[99999] w-56
            bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
            border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ top: pos.top, right: pos.right }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
              {lang === 'fr' ? "Format d'export" : 'Export format'}
            </p>
          </div>

          {/* Options */}
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={opt.onClick}
              disabled={opt.disabled}
              className="w-full flex items-center gap-3 px-4 py-3
                hover:bg-gray-50 dark:hover:bg-gray-800/60
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors text-left group"
            >
              <span className={`${opt.color} flex-shrink-0`}>{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  opt.disabled
                    ? 'text-gray-400'
                    : 'text-gray-800 dark:text-gray-100'
                }`}>
                  {opt.label}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                  {opt.sublabel}
                </p>
              </div>
              {opt.disabled ? (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md
                  bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
                  soon
                </span>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600
                    group-hover:text-gray-500 dark:group-hover:text-gray-400
                    transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}