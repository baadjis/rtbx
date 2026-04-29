
'use client';

import { useEffect, useRef, useState } from "react";

// ─── ColorDot ─────────────────────────────────────────────────────────────────
export default function ColorDot({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hex,  setHex]  = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const t = setTimeout(() => setHex(value), 0);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const hexToRgb = (h: string) => {
    const clean = h.replace('#', '');
    if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgb = hexToRgb(hex);

  const updateChannel = (channel: 'r' | 'g' | 'b', val: number) => {
    const next = rgbToHex(
      channel === 'r' ? val : rgb.r,
      channel === 'g' ? val : rgb.g,
      channel === 'b' ? val : rgb.b,
    );
    setHex(next);
    onChange(next);
  };

  const handleHexInput = (v: string) => {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  const swatches = [
    '#000000', '#ffffff', '#f9fafb', '#6b7280',
    '#7c3aed', '#4f46e5', '#0ea5e9', '#06b6d4',
    '#10b981', '#84cc16', '#f59e0b', '#ef4444',
    '#ec4899', '#f97316', '#8b5cf6', '#14b8a6',
  ];

  const checkerStyle = {
    backgroundImage: 'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)',
    backgroundSize: '6px 6px',
    backgroundPosition: '0 0,0 3px,3px -3px,-3px 0',
  };

  return (
    <div className="relative flex flex-col items-center gap-1" ref={ref}>
      <button
        onClick={() => {
  if (!ref.current) { setOpen((o) => !o); return; }
  const rect = ref.current.getBoundingClientRect();
  const top  = rect.top > 300 ? rect.top - 320 : rect.bottom + 8;
  const left = Math.min(
    Math.max(rect.left - 100, 8),
    window.innerWidth - 224,
  );
  setPopoverPos({ top, left });
  setOpen((o) => !o);
}}
      />
      {label && <span className="text-[10px] text-gray-400">{label}</span>}

      {open && (
        <div
    className="fixed z-[9999] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
      border border-gray-200 dark:border-gray-700 p-3 w-52"
    style={{ top: popoverPos.top, left: popoverPos.left }}
    onClick={(e) => e.stopPropagation()}
  >
          {/* Color picker natif */}
          <div className="relative w-full h-8 mb-3">
            <div className="w-full h-8 rounded-xl border border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: hex === 'transparent' ? '#ffffff' : hex }} />
            <input type="color"
              value={hex === 'transparent' ? '#ffffff' : hex}
              onChange={(e) => { setHex(e.target.value); onChange(e.target.value); }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          {/* Swatches */}
          <div className="grid grid-cols-8 gap-1 mb-3">
            {swatches.map((s) => (
              <button key={s} onClick={() => { setHex(s); onChange(s); }}
                className={`w-5 h-5 rounded-md border-2 hover:scale-110 transition-transform ${
                  hex === s ? 'border-violet-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: s,
                  boxShadow: s === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : undefined }}
              />
            ))}
          </div>

          {/* Sliders RGB */}
          <div className="space-y-2 mb-3">
            {(['r', 'g', 'b'] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase w-3"
                  style={{ color: ch === 'r' ? '#ef4444' : ch === 'g' ? '#10b981' : '#3b82f6' }}>
                  {ch}
                </span>
                <input type="range" min={0} max={255} value={rgb[ch]}
                  onChange={(e) => updateChannel(ch, Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full cursor-pointer"
                  style={{ accentColor: ch === 'r' ? '#ef4444' : ch === 'g' ? '#10b981' : '#3b82f6' }}
                />
                <span className="text-[10px] font-mono text-gray-400 w-6 text-right">{rgb[ch]}</span>
              </div>
            ))}
          </div>

          {/* Hex input + transparent */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: hex === 'transparent' ? 'transparent' : hex }} />
            <input type="text" value={hex}
              onChange={(e) => handleHexInput(e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono rounded-lg bg-gray-50 dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1
                focus:ring-violet-400 text-gray-800 dark:text-gray-100"
              placeholder="#000000" maxLength={7}
            />
            <button
              onClick={() => { setHex('transparent'); onChange('transparent'); }}
              title="Transparent"
              className={`w-6 h-6 rounded-md border-2 text-[9px] font-bold flex items-center justify-center transition-all ${
                hex === 'transparent' ? 'border-violet-500 text-violet-600' : 'border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
              style={checkerStyle}
            >
              ∅
            </button>
          </div>
        </div>
      )}
    </div>
  );
}