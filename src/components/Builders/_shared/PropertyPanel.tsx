/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/PropertyPanel.tsx
'use client';

import { useState } from 'react';
import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';

type Props = { lang: 'fr' | 'en' };

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-2.5">
      {children}
    </p>
  );
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-4 py-4 border-b border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

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

function ColorDot({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  return (
    <label className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-700 shadow-md group-hover:scale-110 transition-transform"
        style={{ backgroundColor: value }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="opacity-0 w-full h-full cursor-pointer" />
      </div>
      {label && <span className="text-[10px] text-gray-400">{label}</span>}
    </label>
  );
}

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

const FONT_OPTIONS = [
  'Sora', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Raleway',
  'Playfair Display', 'Cormorant Garamond', 'Bebas Neue',
  'Montserrat', 'Oswald', 'Lato', 'Poppins',
];

// ─── PropertyPanel ────────────────────────────────────────────────────────────
export default function PropertyPanel({ lang }: Props) {
  const t = sharedBuilderData[lang] || sharedBuilderData.fr;
  const { selectedId, elements, updateElement, deleteElement, bringToFront, sendToBack, addElement } = useCanvas();
  const [fillTab, setFillTab] = useState<'solid' | 'gradient'>('solid');

  const selected = elements.find((el) => el.id === selectedId);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 p-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
          ✦
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{t.noSelection}</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            {lang === 'fr' ? 'Cliquez sur un élément' : 'Click on an element'}
          </p>
        </div>
      </div>
    );
  }

  const isText   = selected.type === 'text';
  const isShape  = ['rectangle', 'circle'].includes(selected.type);
  const isRect   = selected.type === 'rectangle';
  const style    = selected.style || {};
  const isGradient = fillTab === 'gradient';

  const upd      = (patch: Partial<typeof selected>) => updateElement(selected.id, patch);
  const updStyle = (patch: Record<string, any>) => upd({ style: { ...style, ...patch } } as any);
  const duplicate = () =>
    addElement({ ...selected, id: crypto.randomUUID(), x: selected.x + 30, y: selected.y + 30 } as any);

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

      {/* ── Position & Size ── */}
      <Section>
        <SectionTitle>{lang === 'fr' ? 'Position & Taille' : 'Position & Size'}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {([['X', 'x'], ['Y', 'y'], ['W', 'width'], ['H', 'height']] as const).map(([label, key]) => (
            <div key={key} className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">{label}</span>
              <input
                type="number"
                value={Math.round((selected as any)[key] ?? 0)}
                onChange={(e) => upd({ [key]: Number(e.target.value) } as any)}
                className="w-full pl-7 pr-2 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  focus:outline-none focus:ring-1 focus:ring-violet-400 font-mono
                  text-gray-800 dark:text-gray-100"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Fill color ── */}
      {(isShape || isText) && (
        <Section>
          <SectionTitle>{t.fillColor || 'Couleur de remplissage'}</SectionTitle>

          {isShape && (
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
              <TabBtn active={fillTab === 'solid'} onClick={() => setFillTab('solid')}>
                {lang === 'fr' ? 'Solide' : 'Solid'}
              </TabBtn>
              <TabBtn active={fillTab === 'gradient'} onClick={() => setFillTab('gradient')}>
                Gradient
              </TabBtn>
            </div>
          )}

          {isGradient && isShape ? (
            <div className="space-y-3">
              <div className="flex items-end gap-3">
                <ColorDot
                  value={style.gradientColor1 || '#7c3aed'}
                  onChange={(v) => updStyle({ gradientColor1: v, gradientEnabled: true })}
                  label={t.gradient_start}
                />
                <div className="flex-1 h-8 rounded-lg shadow-inner" style={{
                  background: `linear-gradient(${style.gradientDirection ?? 90}deg, ${style.gradientColor1 || '#7c3aed'}, ${style.gradientColor2 || '#06b6d4'})`,
                }} />
                <ColorDot
                  value={style.gradientColor2 || '#06b6d4'}
                  onChange={(v) => updStyle({ gradientColor2: v, gradientEnabled: true })}
                  label={t.gradient_end}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Direction</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 45, 90, 135].map((deg) => (
                    <button key={deg}
                      onClick={() => updStyle({ gradientDirection: deg, gradientEnabled: true })}
                      className={`py-1.5 text-xs rounded-lg font-mono transition-all ${
                        style.gradientDirection === deg
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/20 text-gray-600 dark:text-gray-300'
                      }`}>
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ColorDot
                value={isText ? (style.fill || '#111111') : (style.fill || '#7c3aed')}
                onChange={(v) => updStyle({ fill: v, gradientEnabled: false })}
              />
              <div className="flex-1 h-8 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: isText ? (style.fill || '#111111') : (style.fill || '#7c3aed') }} />
            </div>
          )}
        </Section>
      )}

      {/* ── Stroke ── */}
      <Section>
        <SectionTitle>{t.stroke}</SectionTitle>
        <div className="flex items-center gap-3">
          <ColorDot value={style.stroke || '#000000'} onChange={(v) => updStyle({ stroke: v })} />
          <div className="flex-1">
            <Slider
              label={lang === 'fr' ? 'Épaisseur' : 'Width'}
              min={0} max={20}
              value={style.strokeWidth ?? 0}
              unit="px"
              onChange={(v) => updStyle({ strokeWidth: v })}
            />
          </div>
        </div>
      </Section>

      {/* ── Border radius (rectangle only) ── */}
      {isRect && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Arrondi des coins' : 'Corner Radius'}</SectionTitle>
          <Slider
            label={lang === 'fr' ? 'Rayon' : 'Radius'}
            min={0} max={100}
            value={style.borderRadius ?? 0}
            unit="px"
            onChange={(v) => updStyle({ borderRadius: v })}
          />
          <div className="flex gap-1.5 mt-2.5">
            {[0, 8, 16, 32, 9999].map((r) => (
              <button key={r}
                onClick={() => updStyle({ borderRadius: r })}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  style.borderRadius === r
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100 dark:hover:bg-violet-900/20'
                }`}>
                {r === 9999 ? '⬤' : r === 0 ? '□' : r}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ── Typography (text only) ── */}
      {isText && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Typographie' : 'Typography'}</SectionTitle>
          <div className="space-y-3">

            {/* Font family */}
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{lang === 'fr' ? 'Police' : 'Font'}</p>
              <select
                value={(selected as any).fontFamily || 'Sora'}
                onChange={(e) => upd({ fontFamily: e.target.value } as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  focus:outline-none focus:ring-1 focus:ring-violet-400
                  text-gray-800 dark:text-gray-100">
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Font size */}
            <Slider
              label={t.fontSize} min={8} max={200}
              value={(selected as any).fontSize || 32}
              unit="px"
              onChange={(v) => upd({ fontSize: v } as any)}
            />

            {/* Letter spacing */}
            <Slider
              label={lang === 'fr' ? 'Espacement lettres' : 'Letter Spacing'}
              min={-5} max={30}
              value={(selected as any).letterSpacing ?? 0}
              unit="px"
              onChange={(v) => upd({ letterSpacing: v } as any)}
            />

            {/* Line height */}
            <Slider
              label={lang === 'fr' ? 'Interligne' : 'Line Height'}
              min={0.8} max={3}
              value={(selected as any).lineHeight ?? 1.3}
              onChange={(v) => upd({ lineHeight: v } as any)}
            />

            {/* Alignment */}
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{t.alignment}</p>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((val) => (
                  <button key={val}
                    onClick={() => upd({ align: val } as any)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold transition-all ${
                      (selected as any).align === val
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100 dark:hover:bg-violet-900/20'
                    }`}>
                    {val === 'left'
                      ? (lang === 'fr' ? 'G' : 'L')
                      : val === 'center' ? 'C'
                      : (lang === 'fr' ? 'D' : 'R')}
                  </button>
                ))}
              </div>
            </div>

            {/* Bold / Italic / Underline */}
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Style</p>
              <div className="flex gap-1.5">
                {[
                  { label: 'B', prop: 'fontStyle',      on: 'bold',      off: 'normal',  active: (selected as any).fontStyle === 'bold' },
                  { label: 'I', prop: 'fontStyle',      on: 'italic',    off: 'normal',  active: (selected as any).fontStyle === 'italic' },
                  { label: 'U', prop: 'textDecoration', on: 'underline', off: 'none',    active: (selected as any).textDecoration === 'underline' },
                ].map((btn) => (
                  <button key={btn.label}
                    onClick={() => upd({ [btn.prop]: btn.active ? btn.off : btn.on } as any)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      btn.active
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/20'
                    }`}
                    style={{ fontStyle: btn.label === 'I' ? 'italic' : 'normal' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ── Rotation ── */}
      <Section>
        <SectionTitle>{t.rotation}</SectionTitle>
        <div className="flex gap-1.5">
          {[0, 90, 180, 270].map((angle) => (
            <button key={angle}
              onClick={() => upd({ rotation: angle })}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                selected.rotation === angle
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100 dark:hover:bg-violet-900/20'
              }`}>
              {angle}°
            </button>
          ))}
        </div>
      </Section>

      {/* ── Opacity ── */}
      <Section>
        <Slider
          label={t.opacity} min={0} max={100}
          value={Math.round((style.opacity ?? 1) * 100)}
          unit="%"
          onChange={(v) => updStyle({ opacity: v / 100 })}
        />
      </Section>

      {/* ── Shadow ── */}
      <Section>
        <SectionTitle>{t.shadow}</SectionTitle>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ColorDot
              value={style.shadowColor || '#000000'}
              onChange={(v) => updStyle({ shadowColor: v })}
              label={lang === 'fr' ? 'Couleur' : 'Color'}
            />
            <div className="flex-1">
              <Slider label="Blur" min={0} max={60}
                value={style.shadowBlur ?? 0} unit="px"
                onChange={(v) => updStyle({ shadowBlur: v })} />
            </div>
          </div>
          <Slider
            label={lang === 'fr' ? 'Décalage X' : 'Offset X'}
            min={-30} max={30}
            value={style.shadowOffsetX ?? 0} unit="px"
            onChange={(v) => updStyle({ shadowOffsetX: v })}
          />
          <Slider
            label={lang === 'fr' ? 'Décalage Y' : 'Offset Y'}
            min={-30} max={30}
            value={style.shadowOffsetY ?? 0} unit="px"
            onChange={(v) => updStyle({ shadowOffsetY: v })}
          />
        </div>
      </Section>

      {/* ── Layer actions ── */}
      <Section>
        <SectionTitle>{lang === 'fr' ? 'Calque' : 'Layer'}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: t.bring_to_front, fn: () => bringToFront(selected.id) },
            { label: t.sent_to_back,   fn: () => sendToBack(selected.id) },
            { label: `📋 ${t.duplicate}`, fn: duplicate },
          ].map((action) => (
            <button key={action.label} onClick={action.fn}
              className="py-2.5 px-3 text-xs font-medium rounded-xl
                bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:bg-violet-50 dark:hover:bg-violet-900/20
                hover:text-violet-600 dark:hover:text-violet-400
                hover:border-violet-300 dark:hover:border-violet-700
                transition-all text-left truncate text-gray-700 dark:text-gray-300">
              {action.label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Delete ── */}
      <div className="px-4 py-4 mt-auto">
        <button onClick={() => deleteElement(selected.id)}
          className="w-full py-3 rounded-xl text-sm font-semibold
            text-red-500 border border-red-200 dark:border-red-900/50
            hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
          🗑 {t.delete}
        </button>
      </div>

    </div>
  );
}