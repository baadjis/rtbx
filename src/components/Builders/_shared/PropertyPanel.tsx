/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/PropertyPanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import RemoveBgButton from './RemoveBgButton';
import Image from 'next/image';
import { ClipShape, GradientConfig, GradientStop, DEFAULT_STOPS } from './types';

type Props = { lang: 'fr' | 'en' };

// ─── SectionTitle ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-2.5">
      {children}
    </p>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-4 py-4 border-b border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, min, max, value, unit = '', onChange }: {
  label: string; min: number; max: number; value: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-mono font-semibold text-violet-600 dark:text-violet-400">
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-violet-600 cursor-pointer"
      />
    </div>
  );
}

// ─── TabBtn ───────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
        active
          ? 'bg-violet-600 text-white shadow-sm shadow-violet-300/40'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
      }`}>
      {children}
    </button>
  );
}

// ─── ColorDot ─────────────────────────────────────────────────────────────────
function ColorDot({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hex,  setHex]  = useState(value);
  const ref = useRef<HTMLDivElement>(null);

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
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-700 shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-violet-400"
        style={
          value === 'transparent'
            ? checkerStyle
            : { backgroundColor: value }
        }
      />
      {label && <span className="text-[10px] text-gray-400">{label}</span>}

      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999]
            bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border
            border-gray-200 dark:border-gray-700 p-3 w-52"
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

// ─── GradientEditor ───────────────────────────────────────────────────────────
function GradientEditor({ gradient, onChange, lang }: {
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
        {stops.map((stop) => (
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

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  'Sora', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Raleway',
  'Playfair Display', 'Cormorant Garamond', 'Bebas Neue',
  'Montserrat', 'Oswald', 'Lato', 'Poppins',
];

const SHAPE_TYPES = [
  'rectangle', 'circle', 'line', 'triangle', 'arrow',
  'star', 'pentagon', 'hexagon', 'diamond', 'cross', 'octagon', 'blob',
];

// ─── PropertyPanel ────────────────────────────────────────────────────────────
export default function PropertyPanel({ lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const {
    selectedId, elements, updateElement, deleteElement,
    bringToFront, sendToBack, addElement, startEditingBezier,
  } = useCanvas();

  const selected = elements.find((el) => el.id === selectedId);
  const [fillTab, setFillTab] = useState<'solid' | 'gradient' | 'radial'>('solid');

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => {
      if (!selected.style.gradientEnabled) setFillTab('solid');
      else if (selected.style.gradient?.type === 'radial') setFillTab('radial');
      else setFillTab('gradient');
    }, 0);
    return () => clearTimeout(t);
  }, [selected?.id]);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 p-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">✦</div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{t.noSelection}</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            {lang === 'fr' ? 'Cliquez sur un élément' : 'Click on an element'}
          </p>
        </div>
      </div>
    );
  }

  const isText  = selected.type === 'text';
  const isShape = SHAPE_TYPES.includes(selected.type);
  const isRect  = selected.type === 'rectangle';
  const style   = selected.style || {};

  const upd      = (patch: Partial<typeof selected>) => updateElement(selected.id, patch);
  const updStyle = (patch: Record<string, any>) => upd({ style: { ...style, ...patch } } as any);
  const duplicate = () =>
    addElement({ ...selected, id: crypto.randomUUID(), x: selected.x + 30, y: selected.y + 30 } as any);

  // Helper gradient
  const currentGradient = (type: 'linear' | 'radial'): GradientConfig => ({
    type,
    direction: style.gradient?.direction ?? 90,
    radius:    style.gradient?.radius    ?? 1,
    stops:     style.gradient?.stops     ?? DEFAULT_STOPS,
  });

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 flex flex-col"
      style={{ fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
            {t.properties}
          </p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5 capitalize">{selected.type}</p>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase">
          {selected.type}
        </span>
      </div>

      {/* ── Position & Taille ── */}
      <Section>
        <SectionTitle>{lang === 'fr' ? 'Position & Taille' : 'Position & Size'}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {([['X','x'],['Y','y'],['W','width'],['H','height']] as const).map(([lbl, key]) => (
            <div key={key} className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">{lbl}</span>
              <input type="number"
                value={Math.round((selected as any)[key] ?? 0)}
                onChange={(e) => upd({ [key]: Number(e.target.value) } as any)}
                className="w-full pl-7 pr-2 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700 focus:outline-none
                  focus:ring-1 focus:ring-violet-400 font-mono text-gray-800 dark:text-gray-100"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Fill ── */}
      {(isShape || isText || selected.type === 'bezier') && (
        <Section>
          <SectionTitle>{t.fillColor || 'Couleur de remplissage'}</SectionTitle>

          {/* Tabs gradient — shapes seulement */}
          {isShape && (
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
              <TabBtn active={fillTab === 'solid'}
                onClick={() => { setFillTab('solid'); updStyle({ gradientEnabled: false }); }}>
                {lang === 'fr' ? 'Solide' : 'Solid'}
              </TabBtn>
              <TabBtn active={fillTab === 'gradient'}
                onClick={() => { setFillTab('gradient'); updStyle({ gradientEnabled: true, gradient: { ...currentGradient('linear'), type: 'linear' } }); }}>
                Linear
              </TabBtn>
              <TabBtn active={fillTab === 'radial'}
                onClick={() => { setFillTab('radial'); updStyle({ gradientEnabled: true, gradient: { ...currentGradient('radial'), type: 'radial' } }); }}>
                Radial
              </TabBtn>
            </div>
          )}

          {/* Solid */}
          {(fillTab === 'solid' || isText || selected.type === 'bezier') && (
            <div className="flex items-center gap-3">
              <ColorDot
                value={style.fill || (isText ? '#111111' : 'transparent')}
                onChange={(v) => updStyle({ fill: v, gradientEnabled: false })}
              />
              <div className="flex-1 h-8 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{
                  backgroundColor: (!style.fill || style.fill === 'transparent') ? 'transparent' : style.fill,
                  backgroundImage: (!style.fill || style.fill === 'transparent')
                    ? 'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)'
                    : 'none',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
                }}
              />
              <button
                onClick={() => updStyle({ fill: style.fill === 'transparent' ? '#7c3aed' : 'transparent' })}
                title="Transparent"
                className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold ${
                  style.fill === 'transparent' || !style.fill
                    ? 'border-violet-500 text-violet-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400'
                }`}
                style={{
                  backgroundImage: 'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)',
                  backgroundSize: '6px 6px',
                  backgroundPosition: '0 0,0 3px,3px -3px,-3px 0',
                }}
              >∅</button>
            </div>
          )}

          {/* Linear */}
          {fillTab === 'gradient' && isShape && (
            <GradientEditor
              gradient={currentGradient('linear')}
              onChange={(g) => updStyle({ gradient: g, gradientEnabled: true })}
              lang={lang}
            />
          )}

          {/* Radial */}
          {fillTab === 'radial' && isShape && (
            <GradientEditor
              gradient={currentGradient('radial')}
              onChange={(g) => updStyle({ gradient: g, gradientEnabled: true })}
              lang={lang}
            />
          )}
        </Section>
      )}

      {/* ── Stroke ── */}
      <Section>
        <SectionTitle>{t.stroke}</SectionTitle>
        <div className="flex items-center gap-3">
          <ColorDot value={style.stroke || '#000000'} onChange={(v) => updStyle({ stroke: v })} />
          <div className="flex-1">
            <Slider label={lang === 'fr' ? 'Épaisseur' : 'Width'} min={0} max={20}
              value={style.strokeWidth ?? 0} unit="px"
              onChange={(v) => updStyle({ strokeWidth: v })}
            />
          </div>
        </div>
      </Section>

      {/* ── Border radius ── */}
      {isRect && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Arrondi des coins' : 'Corner Radius'}</SectionTitle>
          <Slider label={lang === 'fr' ? 'Rayon' : 'Radius'} min={0} max={100}
            value={style.borderRadius ?? 0} unit="px"
            onChange={(v) => updStyle({ borderRadius: v })}
          />
          <div className="flex gap-1.5 mt-2.5">
            {[0, 8, 16, 32, 9999].map((r) => (
              <button key={r} onClick={() => updStyle({ borderRadius: r })}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  style.borderRadius === r
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
                }`}>
                {r === 9999 ? '⬤' : r === 0 ? '□' : r}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ── Typographie ── */}
      {isText && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Typographie' : 'Typography'}</SectionTitle>
          <div className="space-y-3">

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{lang === 'fr' ? 'Police' : 'Font'}</p>
              <select value={(selected as any).fontFamily || 'Sora'}
                onChange={(e) => upd({ fontFamily: e.target.value } as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700 focus:outline-none
                  focus:ring-1 focus:ring-violet-400 text-gray-800 dark:text-gray-100">
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <Slider label={t.fontSize} min={8} max={200}
              value={(selected as any).fontSize || 32} unit="px"
              onChange={(v) => upd({ fontSize: v } as any)}
            />
            <Slider label={lang === 'fr' ? 'Espacement lettres' : 'Letter Spacing'} min={-5} max={30}
              value={(selected as any).letterSpacing ?? 0} unit="px"
              onChange={(v) => upd({ letterSpacing: v } as any)}
            />
            <Slider label={lang === 'fr' ? 'Interligne' : 'Line Height'} min={0.8} max={3}
              value={(selected as any).lineHeight ?? 1.3}
              onChange={(v) => upd({ lineHeight: v } as any)}
            />

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{t.alignment}</p>
              <div className="flex gap-1">
                {(['left','center','right'] as const).map((val) => (
                  <button key={val} onClick={() => upd({ align: val } as any)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold transition-all ${
                      (selected as any).align === val
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
                    }`}>
                    {val === 'left' ? (lang === 'fr' ? 'G' : 'L') : val === 'center' ? 'C' : (lang === 'fr' ? 'D' : 'R')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Style</p>
              <div className="flex gap-1.5">
                {[
                  { label: 'B', prop: 'fontStyle',      on: 'bold',      off: 'normal',    active: (selected as any).fontStyle === 'bold' },
                  { label: 'I', prop: 'fontStyle',      on: 'italic',    off: 'normal',    active: (selected as any).fontStyle === 'italic' },
                  { label: 'U', prop: 'textDecoration', on: 'underline', off: 'none',      active: (selected as any).textDecoration === 'underline' },
                ].map((btn) => (
                  <button key={btn.label}
                    onClick={() => upd({ [btn.prop]: btn.active ? btn.off : btn.on } as any)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      btn.active ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-100'
                    }`}
                    style={{ fontStyle: btn.label === 'I' ? 'italic' : 'normal' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                {lang === 'fr' ? 'Contour texte' : 'Text stroke'}
              </p>
              <div className="flex items-center gap-3">
                <ColorDot value={(selected as any).stroke || '#000000'}
                  onChange={(v) => upd({ stroke: v } as any)} />
                <div className="flex-1">
                  <Slider label={lang === 'fr' ? 'Épaisseur' : 'Width'} min={0} max={20}
                    value={(selected as any).strokeWidth ?? 0} unit="px"
                    onChange={(v) => upd({ strokeWidth: v } as any)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {lang === 'fr' ? 'Fill transparent' : 'Transparent fill'}
              </span>
              <button
                onClick={() => updStyle({ fill: style.fill === 'transparent' ? '#000000' : 'transparent' })}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  style.fill === 'transparent' ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  style.fill === 'transparent' ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* ── Gradient texte ── */}
      {isText && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Gradient texte' : 'Text gradient'}</SectionTitle>
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
            <TabBtn
              active={!(selected as any).textGradient?.enabled}
              onClick={() => upd({ textGradient: { ...((selected as any).textGradient ?? {}), enabled: false } } as any)}
            >
              {lang === 'fr' ? 'Solide' : 'Solid'}
            </TabBtn>
            <TabBtn
              active={(selected as any).textGradient?.enabled}
              onClick={() => upd({
                textGradient: {
                  enabled:   true,
                  color1:    (selected as any).textGradient?.color1    ?? '#7c3aed',
                  color2:    (selected as any).textGradient?.color2    ?? '#06b6d4',
                  direction: (selected as any).textGradient?.direction ?? 90,
                },
              } as any)}
            >
              Gradient
            </TabBtn>
          </div>

          {(selected as any).textGradient?.enabled && (
            <div className="space-y-3">
              <div className="flex items-end gap-3">
                <ColorDot
                  value={(selected as any).textGradient?.color1 ?? '#7c3aed'}
                  onChange={(v) => upd({ textGradient: { ...(selected as any).textGradient, color1: v } } as any)}
                  label={t.gradient_start}
                />
                <div className="flex-1 h-8 rounded-lg" style={{
                  background: `linear-gradient(${(selected as any).textGradient?.direction ?? 90}deg,
                    ${(selected as any).textGradient?.color1 ?? '#7c3aed'},
                    ${(selected as any).textGradient?.color2 ?? '#06b6d4'})`,
                }} />
                <ColorDot
                  value={(selected as any).textGradient?.color2 ?? '#06b6d4'}
                  onChange={(v) => upd({ textGradient: { ...(selected as any).textGradient, color2: v } } as any)}
                  label={t.gradient_end}
                />
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 45, 90, 135].map((deg) => (
                  <button key={deg}
                    onClick={() => upd({ textGradient: { ...(selected as any).textGradient, direction: deg } } as any)}
                    className={`py-1.5 text-xs rounded-lg font-mono transition-all ${
                      (selected as any).textGradient?.direction === deg
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Masque image ── */}
      {isText && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Masque image' : 'Image mask'}</SectionTitle>
          <div className="space-y-2">
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file'; input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => upd({ maskImageSrc: ev.target?.result as string } as any);
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-violet-300 dark:border-violet-700
                text-xs font-semibold text-violet-600 dark:text-violet-400
                hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
            >
              📁 {lang === 'fr' ? 'Choisir une image masque' : 'Choose mask image'}
            </button>
            {(selected as any).maskImageSrc && (
              <button onClick={() => upd({ maskImageSrc: undefined } as any)}
                className="w-full py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-all">
                ✕ {lang === 'fr' ? 'Retirer le masque' : 'Remove mask'}
              </button>
            )}
          </div>
        </Section>
      )}

      {/* ── Filtres image ── */}
      {selected.type === 'image' && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Filtres' : 'Filters'}</SectionTitle>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Normal',   patch: {} },
                { label: 'B&W',      patch: { grayscale: true } },
                { label: 'Sépia',    patch: { sepia: true } },
                { label: 'Inverser', patch: { invert: true } },
                { label: 'Doux',     patch: { brightness: 0.1, contrast: -0.1 } },
                { label: 'Vif',      patch: { brightness: 0.05, contrast: 0.3, saturation: 0.5 } },
              ].map((p) => (
                <button key={p.label} onClick={() => upd({ filters: p.patch } as any)}
                  className="py-1.5 text-[10px] font-semibold rounded-lg bg-gray-100 dark:bg-gray-800
                    hover:bg-violet-100 hover:text-violet-600 transition-all text-gray-600 dark:text-gray-300">
                  {p.label}
                </button>
              ))}
            </div>
            <Slider label={lang === 'fr' ? 'Luminosité' : 'Brightness'} min={-100} max={100}
              value={Math.round(((selected as any).filters?.brightness ?? 0) * 100)}
              onChange={(v) => upd({ filters: { ...(selected as any).filters, brightness: v / 100 } } as any)}
            />
            <Slider label="Contraste" min={-100} max={100}
              value={Math.round(((selected as any).filters?.contrast ?? 0) * 100)}
              onChange={(v) => upd({ filters: { ...(selected as any).filters, contrast: v / 100 } } as any)}
            />
            <Slider label="Saturation" min={-100} max={100}
              value={Math.round(((selected as any).filters?.saturation ?? 0) * 100)}
              onChange={(v) => upd({ filters: { ...(selected as any).filters, saturation: v / 100 } } as any)}
            />
            <Slider label="Teinte (Hue)" min={0} max={360}
              value={(selected as any).filters?.hue ?? 0} unit="°"
              onChange={(v) => upd({ filters: { ...(selected as any).filters, hue: v } } as any)}
            />
            <Slider label="Flou" min={0} max={40}
              value={(selected as any).filters?.blur ?? 0} unit="px"
              onChange={(v) => upd({ filters: { ...(selected as any).filters, blur: v } } as any)}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <SectionTitle>{lang === 'fr' ? 'Arrière-plan' : 'Background'}</SectionTitle>
            <RemoveBgButton element={selected as any} lang={lang} />
          </div>
        </Section>
      )}

      {/* ── Blend mode ── */}
      {selected.type === 'image' && (
        <Section>
          <SectionTitle>Blend Mode</SectionTitle>
          <select
            value={(selected as any).blendMode || 'source-over'}
            onChange={(e) => upd({ blendMode: e.target.value } as any)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700 focus:outline-none
              focus:ring-1 focus:ring-violet-400 text-gray-800 dark:text-gray-100"
          >
            {[
              ['source-over','Normal'],['multiply','Multiply'],['screen','Screen'],
              ['overlay','Overlay'],['darken','Darken'],['lighten','Lighten'],
              ['color-dodge','Color Dodge'],['color-burn','Color Burn'],
              ['hard-light','Hard Light'],['soft-light','Soft Light'],
              ['difference','Difference'],['exclusion','Exclusion'],
              ['hue','Hue'],['saturation','Saturation'],['color','Color'],['luminosity','Luminosity'],
            ].map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
          </select>
        </Section>
      )}

      {/* ── Clip shape ── */}
      {selected.type === 'image' && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Découpe par forme' : 'Clip shape'}</SectionTitle>
          <div className="grid grid-cols-4 gap-1.5">
            {([
              { key: 'none',     icon: '▭', label: lang === 'fr' ? 'Aucun'    : 'None'   },
              { key: 'rounded',  icon: '▢', label: lang === 'fr' ? 'Arrondi'  : 'Round'  },
              { key: 'circle',   icon: '◯', label: lang === 'fr' ? 'Cercle'   : 'Circle' },
              { key: 'triangle', icon: '△', label: lang === 'fr' ? 'Triangle' : 'Tri'    },
              { key: 'diamond',  icon: '◇', label: 'Diamond'                              },
              { key: 'star',     icon: '☆', label: lang === 'fr' ? 'Étoile'   : 'Star'   },
              { key: 'hexagon',  icon: '⬡', label: 'Hex'                                  },
              { key: 'blob',     icon: '⬬', label: 'Blob'                                 },
            ] as { key: ClipShape; icon: string; label: string }[]).map((s) => (
              <button key={s.key} onClick={() => upd({ clipShape: s.key } as any)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs border transition-all ${
                  (selected as any).clipShape === s.key
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-violet-300'
                }`}>
                <span className="text-lg leading-none">{s.icon}</span>
                <span className="text-[9px] font-semibold leading-none">{s.label}</span>
              </button>
            ))}
          </div>
          {(selected as any).clipShape === 'rounded' && (
            <div className="mt-3">
              <Slider label={lang === 'fr' ? 'Arrondi' : 'Radius'} min={0} max={100}
                value={(selected as any).clipRadius ?? 20} unit="px"
                onChange={(v) => upd({ clipRadius: v } as any)}
              />
            </div>
          )}
        </Section>
      )}

      {/* ── Background (après remove bg) ── */}
      {selected.type === 'image' && (selected as any).bgRemoved && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Fond de remplacement' : 'Background fill'}</SectionTitle>
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
            {(['color','gradient','image'] as const).map((type) => (
              <button key={type}
                onClick={() => upd({ background: { ...((selected as any).background ?? {}), type } } as any)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  (selected as any).background?.type === type
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                }`}>
                {type === 'color' ? (lang === 'fr' ? 'Couleur' : 'Color') : type === 'gradient' ? 'Gradient' : (lang === 'fr' ? 'Image' : 'Image')}
              </button>
            ))}
          </div>

          {/* Color */}
          {(selected as any).background?.type === 'color' && (
            <div className="flex items-center gap-3">
              <ColorDot
                value={(selected as any).background?.color ?? '#ffffff'}
                onChange={(v) => upd({ background: { ...((selected as any).background ?? {}), type: 'color', color: v } } as any)}
              />
              <div className="flex-1 h-8 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: (selected as any).background?.color ?? '#ffffff' }} />
            </div>
          )}

          {/* Gradient */}
          {(selected as any).background?.type === 'gradient' && (
            <GradientEditor
              gradient={(selected as any).background?.gradient ?? { type: 'linear', direction: 90, stops: DEFAULT_STOPS }}
              onChange={(g) => upd({
                background: { ...((selected as any).background ?? {}), type: 'gradient', gradient: g }
              } as any)}
              lang={lang}
            />
          )}

          {/* Image */}
          {(selected as any).background?.type === 'image' && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => upd({
                      background: { ...((selected as any).background ?? {}), type: 'image', imageSrc: ev.target?.result as string }
                    } as any);
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-violet-300
                  dark:border-violet-700 text-xs font-semibold text-violet-600
                  hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
              >
                📁 {lang === 'fr' ? 'Choisir une image de fond' : 'Choose background image'}
              </button>
              {(selected as any).background?.imageSrc && (
                <div className="relative h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image src={(selected as any).background.imageSrc} fill className="object-cover" alt="bg preview" />
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* ── Rotation ── */}
      <Section>
        <SectionTitle>{t.rotation}</SectionTitle>
        <div className="flex gap-1.5">
          {[0, 90, 180, 270].map((angle) => (
            <button key={angle} onClick={() => upd({ rotation: angle })}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                selected.rotation === angle
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
              }`}>
              {angle}°
            </button>
          ))}
        </div>
      </Section>

      {/* ── Bézier ── */}
      {selected.type === 'bezier' && (
        <Section>
          <SectionTitle>Bézier</SectionTitle>
          <div className="space-y-3">
            <Slider label="Tension" min={0} max={100}
              value={Math.round(((selected as any).tension ?? 0.4) * 100)}
              onChange={(v) => upd({ tension: v / 100 } as any)}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {lang === 'fr' ? 'Courbe fermée' : 'Closed curve'}
              </span>
              <button
                onClick={() => upd({ closed: !(selected as any).closed } as any)}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  (selected as any).closed ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  (selected as any).closed ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <button onClick={() => startEditingBezier(selected.id)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold
                border border-violet-300 dark:border-violet-700 text-violet-600
                hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
            >
              ✏️ {lang === 'fr' ? 'Éditer les points' : 'Edit points'}
            </button>
          </div>
        </Section>
      )}

      {/* ── Opacité ── */}
      <Section>
        <Slider label={t.opacity} min={0} max={100}
          value={Math.round((style.opacity ?? 1) * 100)} unit="%"
          onChange={(v) => updStyle({ opacity: v / 100 })}
        />
      </Section>

      {/* ── Ombre ── */}
      <Section>
        <SectionTitle>{t.shadow}</SectionTitle>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ColorDot value={style.shadowColor || '#000000'}
              onChange={(v) => updStyle({ shadowColor: v })}
              label={lang === 'fr' ? 'Couleur' : 'Color'}
            />
            <div className="flex-1">
              <Slider label="Blur" min={0} max={60}
                value={style.shadowBlur ?? 0} unit="px"
                onChange={(v) => updStyle({ shadowBlur: v })}
              />
            </div>
          </div>
          <Slider label={lang === 'fr' ? 'Décalage X' : 'Offset X'} min={-30} max={30}
            value={style.shadowOffsetX ?? 0} unit="px"
            onChange={(v) => updStyle({ shadowOffsetX: v })}
          />
          <Slider label={lang === 'fr' ? 'Décalage Y' : 'Offset Y'} min={-30} max={30}
            value={style.shadowOffsetY ?? 0} unit="px"
            onChange={(v) => updStyle({ shadowOffsetY: v })}
          />
        </div>
      </Section>

      {/* ── Calque ── */}
      <Section>
        <SectionTitle>{lang === 'fr' ? 'Calque' : 'Layer'}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: t.bring_to_front,       fn: () => bringToFront(selected.id) },
            { label: t.sent_to_back,         fn: () => sendToBack(selected.id)   },
            { label: `📋 ${t.duplicate}`,    fn: duplicate                        },
          ].map((action) => (
            <button key={action.label} onClick={action.fn}
              className="py-2.5 px-3 text-xs font-medium rounded-xl
                bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:bg-violet-50 dark:hover:bg-violet-900/20
                hover:text-violet-600 dark:hover:text-violet-400
                hover:border-violet-300 transition-all text-left truncate
                text-gray-700 dark:text-gray-300">
              {action.label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Supprimer ── */}
      <div className="px-4 py-4 mt-auto">
        <button onClick={() => deleteElement(selected.id)}
          className="w-full py-3 rounded-xl text-sm font-semibold text-red-500
            border border-red-200 dark:border-red-900/50
            hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
          🗑 {t.delete}
        </button>
      </div>

    </div>
  );
}