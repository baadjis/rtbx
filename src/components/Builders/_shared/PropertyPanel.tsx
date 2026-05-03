/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/PropertyPanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvas } from './CanvasContext';
import { sharedBuilderData } from './data';
import RemoveBgButton from './RemoveBgButton';
import Image from 'next/image';
import { ClipShape, GradientConfig, DEFAULT_STOPS, BorderStyle } from './types';
import ColorDot from './ColorDot';
import GradientEditor from './GradientEditor';

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
    bringToFront, sendToBack, addElement, startEditingBezier,ungroupElements,toggleLock
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
  const isGroup = selected.type === 'group';
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
      {/* ── Groupe ── */}
{isGroup && (
  <Section>
    <SectionTitle>{lang === 'fr' ? 'Groupe' : 'Group'}</SectionTitle>
    <div className="space-y-2">
      {/* Infos */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Éléments' : 'Elements'}
        </span>
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
          {(selected as any).children?.length ?? 0}
        </span>
      </div>
      {/* Ungroup */}
      <button
        onClick={() => ungroupElements(selected.id)}
        className="w-full py-2.5 rounded-xl text-xs font-semibold
          border border-orange-300 dark:border-orange-700
          text-orange-600 dark:text-orange-400
          hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all
          flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
        </svg>
        {lang === 'fr' ? 'Dégrouper' : 'Ungroup'}
      </button>
    </div>
  </Section>
)}

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
      {(isShape || isText || selected.type === 'bezier' || isGroup) && (
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

      {/* ── BORDER AVANCÉ ── */}
{(isShape || isText || selected.type === 'bezier') && (
  <Section>
    <SectionTitle>{lang === 'fr' ? 'Bordure' : 'Border'}</SectionTitle>

    {/* Style tabs */}
    <div className="grid grid-cols-3 gap-1.5 mb-3">
      {([
        { key: 'none',     label: lang === 'fr' ? 'Aucune' : 'None'   },
        { key: 'solid',    label: 'Solid'                               },
        { key: 'dashed',   label: 'Dashed'                              },
        { key: 'dotted',   label: 'Dotted'                              },
        { key: 'double',   label: 'Double'                              },
        { key: 'gradient', label: 'Gradient'                            },
        { key: 'image',    label: lang === 'fr' ? 'Image' : 'Image'    },
      ] as { key: BorderStyle; label: string }[]).map((s) => (
        <button
          key={s.key}
          onClick={() => updStyle({
            border: {
              ...(style.border ?? { width: 4, color: '#7c3aed' }),
              style: s.key,
            }
          })}
          className={`py-1.5 text-[10px] font-semibold rounded-lg transition-all ${
            (style.border?.style ?? 'none') === s.key
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-100'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>

    {/* Propriétés si border actif */}
    {style.border && style.border.style !== 'none' && (
      <div className="space-y-3">

        {/* Épaisseur globale */}
        <Slider
          label={lang === 'fr' ? 'Épaisseur' : 'Width'}
          min={1} max={40}
          value={style.border.width ?? 4}
          unit="px"
          onChange={(v) => updStyle({ border: { ...style.border!, width: v } })}
        />

        {/* Couleur (si pas gradient ni image) */}
        {style.border.style !== 'gradient' && style.border.style !== 'image' && (
          <div className="flex items-center gap-3">
            <ColorDot
              value={style.border.color || '#7c3aed'}
              onChange={(v) => updStyle({ border: { ...style.border!, color: v } })}
            />
            <div className="flex-1 h-8 rounded-lg"
              style={{ backgroundColor: style.border.color || '#7c3aed' }} />
          </div>
        )}

        {/* Dash/Gap pour dashed et dotted */}
        {(style.border.style === 'dashed' || style.border.style === 'dotted') && (
          <>
            <Slider
              label={lang === 'fr' ? 'Taille trait' : 'Dash size'}
              min={2} max={40}
              value={style.border.dashSize ?? 10}
              unit="px"
              onChange={(v) => updStyle({ border: { ...style.border!, dashSize: v } })}
            />
            <Slider
              label={lang === 'fr' ? 'Espace' : 'Gap'}
              min={1} max={30}
              value={style.border.gapSize ?? 6}
              unit="px"
              onChange={(v) => updStyle({ border: { ...style.border!, gapSize: v } })}
            />
          </>
        )}

        {/* Gap pour double */}
        {style.border.style === 'double' && (
          <Slider
            label={lang === 'fr' ? 'Espace entre lignes' : 'Lines gap'}
            min={1} max={20}
            value={style.border.doubleGap ?? 3}
            unit="px"
            onChange={(v) => updStyle({ border: { ...style.border!, doubleGap: v } })}
          />
        )}

        {/* Gradient border */}
        {style.border.style === 'gradient' && (
          <GradientEditor
            gradient={style.border.gradient ?? {
              type: 'linear', direction: 90, stops: DEFAULT_STOPS,
            }}
            onChange={(g) => updStyle({ border: { ...style.border!, gradient: g } })}
            lang={lang}
          />
        )}

        {/* Image border */}
        {style.border.style === 'image' && (
          <div className="space-y-2">
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file'; input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => updStyle({
                    border: { ...style.border!, imageSrc: ev.target?.result as string }
                  });
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-violet-300
                dark:border-violet-700 text-xs font-semibold text-violet-600
                hover:bg-violet-50 transition-all"
            >
              📁 {lang === 'fr' ? 'Choisir image de bordure' : 'Choose border image'}
            </button>
            <Slider
              label={lang === 'fr' ? 'Taille du motif' : 'Pattern size'}
              min={8} max={64}
              value={style.border.imageSize ?? 32}
              unit="px"
              onChange={(v) => updStyle({ border: { ...style.border!, imageSize: v } })}
            />
          </div>
        )}

        {/* Radius des coins */}
        {isShape && (
          <Slider
            label={lang === 'fr' ? 'Arrondi des coins' : 'Corner radius'}
            min={0} max={100}
            value={style.border.radius ?? 0}
            unit="px"
            onChange={(v) => updStyle({ border: { ...style.border!, radius: v } })}
          />
        )}

        {/* Par côté */}
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            {lang === 'fr' ? 'Par côté' : 'Per side'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(['top','right','bottom','left'] as const).map((side) => (
              <div key={side} className="space-y-1">
                <p className="text-[10px] text-gray-400 capitalize">{side}</p>
                <div className="flex items-center gap-1.5">
                  <ColorDot
                    value={style.border?.[side]?.color ?? style.border?.color ?? '#7c3aed'}
                    onChange={(v) => updStyle({
                      border: {
                        ...style.border!,
                        [side]: { ...style.border?.[side], color: v },
                      }
                    })}
                  />
                  <input
                    type="number" min={0} max={40}
                    value={style.border?.[side]?.width ?? style.border?.width ?? 4}
                    onChange={(e) => updStyle({
                      border: {
                        ...style.border!,
                        [side]: { ...style.border?.[side], width: Number(e.target.value) },
                      }
                    })}
                    className="w-full px-2 py-1 text-xs rounded-lg bg-gray-50 dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700 font-mono
                      focus:outline-none focus:ring-1 focus:ring-violet-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    )}
  </Section>
)}

      {/* ── Border radius ── */}
      {isRect && (
        <Section>
          <SectionTitle>{lang === 'fr' ? 'Arrondi des coins' : 'Corner Radius'}</SectionTitle>
          <Slider label={lang === 'fr' ? 'Rayon' : 'Radius'} min={0} max={100}
            value={style.borderRadius ?? 0} unit="px"
            // Dans la section Border radius existante (isRect) :
onChange={(v) => updStyle({
  borderRadius: v,
  // ← Sync avec le border radius aussi
  border: style.border ? { ...style.border, radius: v } : style.border,
})}
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
  { label: 'B', prop: 'fontStyle',      on: 'bold',        off: 'normal', active: (selected as any).fontStyle === 'bold' },
  { label: 'I', prop: 'fontStyle',      on: 'italic',      off: 'normal', active: (selected as any).fontStyle === 'italic' },
  { label: 'U', prop: 'textDecoration', on: 'underline',   off: 'none',   active: (selected as any).textDecoration === 'underline' },
  { label: 'S', prop: 'textDecoration', on: 'line-through', off: 'none',  active: (selected as any).textDecoration === 'line-through' },
].map((btn) => (
  <button key={btn.label}
    onClick={() => upd({ [btn.prop]: btn.active ? btn.off : btn.on } as any)}
    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
      btn.active
        ? 'bg-violet-600 text-white'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-100'
    }`}
    style={{
      fontStyle:      btn.label === 'I' ? 'italic'    : 'normal',
      textDecoration: btn.label === 'S' ? 'line-through' : btn.label === 'U' ? 'underline' : 'none',
    }}
  >
    {btn.label}
  </button>
))}
              </div>
            </div>

            {/* Surlignage */}
<div>
  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
    {lang === 'fr' ? 'Surlignage' : 'Highlight'}
  </p>
  <div className="flex items-center gap-3">
    <ColorDot
      value={(selected as any).textBackground || 'transparent'}
      onChange={(v) => upd({ textBackground: v } as any)}
    />
    <div className="flex-1 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center px-3"
      style={{
        backgroundColor: (selected as any).textBackground || 'transparent',
        backgroundImage: (!(selected as any).textBackground || (selected as any).textBackground === 'transparent')
          ? 'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)'
          : 'none',
        backgroundSize: '8px 8px',
      }}
    >
      <span className="text-xs font-medium"
        style={{ color: (selected as any).textBackground ? '#000' : '#9ca3af' }}>
        Aa
      </span>
    </div>
    {(selected as any).textBackground && (selected as any).textBackground !== 'transparent' && (
      <button
        onClick={() => upd({ textBackground: 'transparent' } as any)}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
      >✕</button>
    )}
  </div>
  {(selected as any).textBackground && (selected as any).textBackground !== 'transparent' && (
    <div className="mt-2">
      <Slider
        label={lang === 'fr' ? 'Padding' : 'Padding'}
        min={0} max={20}
        value={(selected as any).textBackgroundPadding ?? 4}
        unit="px"
        onChange={(v) => upd({ textBackgroundPadding: v } as any)}
      />
    </div>
  )}
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
        onClick={() => upd({
          textGradient: { ...((selected as any).textGradient ?? {}), enabled: false }
        } as any)}
      >
        {lang === 'fr' ? 'Solide' : 'Solid'}
      </TabBtn>
      <TabBtn
        active={(selected as any).textGradient?.enabled === true}
        onClick={() => upd({
          textGradient: {
            enabled:  true,
            gradient: (selected as any).textGradient?.gradient ?? {
              type:      'linear',
              direction: 90,
              stops:     DEFAULT_STOPS,
            },
          },
        } as any)}
      >
        Gradient
      </TabBtn>
    </div>

    {(selected as any).textGradient?.enabled && (
      <GradientEditor
        gradient={(selected as any).textGradient?.gradient ?? {
          type: 'linear', direction: 90, stops: DEFAULT_STOPS,
        }}
        onChange={(g) => upd({
          textGradient: { enabled: true, gradient: g }
        } as any)}
        lang={lang}
      />
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

          {/* Lock toggle */}
<button
  onClick={() => toggleLock(selected.id)}
  className={`w-full py-2.5 rounded-xl text-xs font-semibold
    border transition-all flex items-center justify-center gap-2 ${
    (selected as any).locked
      ? 'border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
  }`}
>
  {(selected as any).locked ? (
    <>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      {lang === 'fr' ? 'Verrouillé — cliquer pour déverrouiller' : 'Locked — click to unlock'}
    </>
  ) : (
    <>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 019.9-1"/>
      </svg>
      {lang === 'fr' ? 'Verrouiller' : 'Lock'}
    </>
  )}
</button>
        </div>
      </Section>

      {/* ── Group / Ungroup ── */}
<Section>
  <SectionTitle>{lang === 'fr' ? 'Grouper' : 'Group'}</SectionTitle>
  <div className="space-y-2">
    {selected.type === 'group' ? (
      // Ungroup si l'élément sélectionné est un groupe
      <button
        onClick={() => ungroupElements(selected.id)}
        className="w-full py-2.5 rounded-xl text-xs font-semibold
          border border-orange-300 dark:border-orange-700
          text-orange-600 dark:text-orange-400
          hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
      >
        ⊞ {lang === 'fr' ? 'Dégrouper' : 'Ungroup'}
      </button>
    ) : (
      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
        {lang === 'fr'
          ? 'Sélectionnez plusieurs éléments dans les calques pour grouper'
          : 'Select multiple elements in layers to group'}
      </p>
    )}
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