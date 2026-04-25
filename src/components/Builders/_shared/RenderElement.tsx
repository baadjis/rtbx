/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/RenderElement.tsx
'use client';

import {
  Rect, Text, Circle, Line, Group,
  Image as KonvaImage, Arrow,
} from 'react-konva';
import { useCanvas } from './CanvasContext';
import {
  CanvasElement, TextElement, ImageElement,
  ShapeElement, ContainerElement, GroupElement,
  StyleProps, ShapeType, ImageFilters,
} from './types';
import useImage from 'use-image';
import Konva from 'konva';
import type { Filter } from 'konva/lib/Node';
import { Grayscale } from 'konva/lib/filters/Grayscale';
import { Sepia }     from 'konva/lib/filters/Sepia';
import { Invert }    from 'konva/lib/filters/Invert';
import { Blur }      from 'konva/lib/filters/Blur';
import { Brighten }  from 'konva/lib/filters/Brighten';
import { Contrast }  from 'konva/lib/filters/Contrast';
import { HSL }       from 'konva/lib/filters/HSL';
import {Image as KonvaImageClass }from 'konva/lib/shapes/Image';

import { useEffect, useMemo, useRef, useState } from 'react';

// ─── Shadow & gradient helpers (inchangés) ───────────────────────────────────
function shadowProps(style: StyleProps) {
  return {
    shadowColor:   style.shadowColor   ?? 'transparent',
    shadowBlur:    style.shadowBlur    ?? 0,
    shadowOffsetX: style.shadowOffsetX ?? 0,
    shadowOffsetY: style.shadowOffsetY ?? 0,
    shadowEnabled: (style.shadowBlur ?? 0) > 0,
  };
}

function gradientFillProps(style: StyleProps, width: number, height: number): Record<string, any> {
  if (!style.gradientEnabled) return { fill: style.fill ?? '#7c3aed' };
  const deg = style.gradientDirection ?? 90;
  const rad = (deg * Math.PI) / 180;
  const cx = width / 2, cy = height / 2;
  const dx = Math.cos(rad) * cx, dy = Math.sin(rad) * cy;
  return {
    fillLinearGradientStartPoint: { x: cx - dx, y: cy - dy },
    fillLinearGradientEndPoint:   { x: cx + dx, y: cy + dy },
    fillLinearGradientColorStops: [
      0, style.gradientColor1 ?? '#7c3aed',
      1, style.gradientColor2 ?? '#06b6d4',
    ],
    fill: undefined,
  };
}

function polygonPoints(cx: number, cy: number, r: number, sides: number, offset = 0) {
  const pts: number[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (i * 2 * Math.PI) / sides - Math.PI / 2 + offset;
    pts.push(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  return pts;
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number, branches: number) {
  const pts: number[] = [];
  for (let i = 0; i < branches * 2; i++) {
    const a = (i * Math.PI) / branches - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  return pts;
}

function crossPoints(w: number, h: number, t = 0.3) {
  const tx = w * t, ty = h * t;
  return [
    tx, 0, w - tx, 0, w - tx, ty, w, ty,
    w, h - ty, w - tx, h - ty, w - tx, h,
    tx, h, tx, h - ty, 0, h - ty, 0, ty, tx, ty,
  ];
}

function diamondPoints(w: number, h: number) {
  return [w / 2, 0, w, h / 2, w / 2, h, 0, h / 2];
}

const SELECTION = { stroke: '#7c3aed', strokeWidth: 2, dash: [5, 4] as number[] };

// ─── Konva filter builders ───────────────────────────────────────────────────
function buildKonvaFilters(filters: ImageFilters): Filter[] {
  const list: Filter[] = [];
  if (filters.grayscale)                list.push(Grayscale);
  if (filters.sepia)                    list.push(Sepia);
  if (filters.invert)                   list.push(Invert);
  if ((filters.blur       ?? 0) > 0)   list.push(Blur);
  if ((filters.brightness ?? 0) !== 0) list.push(Brighten);
  if ((filters.contrast   ?? 0) !== 0) list.push(Contrast);
  // HSL une seule fois suffit pour hue + saturation
  if ((filters.hue ?? 0) !== 0 || (filters.saturation ?? 0) !== 0) list.push(HSL);
  return list;
}

// ─── Gradient text (canvas 2D trick) ─────────────────────────────────────────
// Konva ne supporte pas nativement le gradient sur Text.
// On génère une image canvas et on l'utilise comme fill pattern.
function useGradientTextImage(element: TextElement): HTMLCanvasElement | null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!element.textGradient?.enabled) return null;

  const canvas = document.createElement('canvas');
  canvas.width  = element.width  || 400;
  canvas.height = element.height || 80;
  const ctx = canvas.getContext('2d')!;

  const deg = element.textGradient.direction ?? 90;
  const rad = (deg * Math.PI) / 180;
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const dx = Math.cos(rad) * cx, dy = Math.sin(rad) * cy;

  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  grad.addColorStop(0, element.textGradient.color1 || '#7c3aed');
  grad.addColorStop(1, element.textGradient.color2 || '#06b6d4');

  ctx.font = `${element.fontStyle || 'normal'} ${element.fontSize}px "${element.fontFamily || 'Sora'}"`;
  ctx.textBaseline = 'top';
  ctx.textAlign    = (element.align as CanvasTextAlign) || 'left';
  ctx.fillStyle    = grad;
  ctx.fillText(element.text, element.align === 'center' ? cx : element.align === 'right' ? canvas.width : 0, 0);

  return canvas;
}

// ─── Gradient Text Component ─────────────────────────────────────────────────
function GradientTextElement({ element, onSelect, isSelected }: {
  element: TextElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const { startEditingText } = useCanvas();
  const gradCanvas = useGradientTextImage(element);
  const [gradImage] = useImage(gradCanvas?.toDataURL() ?? '');

  // Fallback si canvas pas prêt
  if (!gradImage) return null;

  return (
    <KonvaImage
      id={element.id}
      x={element.x} y={element.y}
      width={element.width} height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      image={gradImage}
      draggable={!element.locked}
      {...(isSelected ? SELECTION : {})}
      {...shadowProps(element.style)}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDblClick={() => startEditingText(element.id)}
      onDblTap={() => startEditingText(element.id)}
    />
  );
}

// ─── Mask Text Component ──────────────────────────────────────────────────────
// Affiche une image clippée par la forme du texte
function MaskedTextElement({ element, onSelect, isSelected }: {
  element: TextElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const { startEditingText } = useCanvas();
  const [maskImg]    = useImage(element.maskImageSrc ?? '', 'anonymous');
 
  
const composite = useMemo(() => {
  if (!maskImg || !element.text) return null;

  const w = element.width  || 400;
  const h = element.height || 100;

  const textCanvas = document.createElement('canvas');
  textCanvas.width  = w;
  textCanvas.height = h;
  const tCtx = textCanvas.getContext('2d')!;

  const fontStyle  = element.fontStyle === 'italic' ? 'italic' : 'normal';
  const fontWeight = element.fontStyle === 'bold' ? 'bold' : (element.fontWeight ?? 'normal');
  tCtx.font          = `${fontStyle} ${fontWeight} ${element.fontSize}px "${element.fontFamily || 'Sora'}"`;
  tCtx.textBaseline  = 'top';
  tCtx.fillStyle     = '#ffffff';
  tCtx.textAlign     = (element.align as CanvasTextAlign) || 'left';

  const xOffset = element.align === 'center' ? w / 2
                : element.align === 'right'  ? w : 0;
  tCtx.fillText(element.text, xOffset, 0);

  const compCanvas = document.createElement('canvas');
  compCanvas.width  = w;
  compCanvas.height = h;
  const cCtx = compCanvas.getContext('2d')!;

  cCtx.drawImage(maskImg, 0, 0, w, h);
  cCtx.globalCompositeOperation = 'destination-in';
  cCtx.drawImage(textCanvas, 0, 0);
  cCtx.globalCompositeOperation = 'source-over';

  return compCanvas;
}, [maskImg, element.text, element.fontSize, element.fontFamily,
    element.fontStyle, element.fontWeight, element.align,
    element.width, element.height]);

  // Canvas → dataURL → useImage pour Konva
  const [compositeImage] = useImage(composite?.toDataURL() ?? '');

  return (
    <Group
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      draggable={!element.locked}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDblClick={() => startEditingText(element.id)}
      onDblTap={() => startEditingText(element.id)}
    >
      {/* Hitbox invisible sur toute la zone */}
      <Rect
        width={element.width}
        height={element.height}
        fill="rgba(0,0,0,0.001)"
        stroke={isSelected ? '#7c3aed' : undefined}
        strokeWidth={isSelected ? 2 : 0}
        dash={isSelected ? [5, 4] as number[] : undefined}
      />

      {/* Image composite (image clippée par la forme du texte) */}
      {compositeImage && (
        <KonvaImage
          image={compositeImage}
          width={element.width}
          height={element.height}
        />
      )}

      {/* Fallback : si l'image n'est pas encore chargée, affiche le texte normal */}
      {!compositeImage && (
        <Text
          text={element.text}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily || 'Sora'}
          fontStyle={element.fontStyle || 'normal'}
          fill={element.style.fill || '#000000'}
          width={element.width}
          align={element.align || 'left'}
        />
      )}
    </Group>
  );
}

// ─── Image with filters ───────────────────────────────────────────────────────
function FilteredImageElement({ element, onSelect }: {
  element: ImageElement; onSelect: (id: string) => void;
}) {
  const { selectedId } = useCanvas();
  const isSelected = selectedId === element.id;
  const src = element.bgRemoved && element.removedBgSrc
    ? element.removedBgSrc
    : element.src;

  const [image] = useImage(src, 'anonymous');
  const imgRef  = useRef<any>(null);
  const filters = element.filters ?? {};

 useEffect(() => {
  if (!imgRef.current || !image) return;
  imgRef.current.clearCache();
  imgRef.current.cache();
  imgRef.current.getLayer()?.batchDraw();
}, [
  image, src,
  element.width,  // ← nouveau
  element.height, // ← nouveau
  filters.blur, filters.brightness, filters.contrast,
  filters.grayscale, filters.sepia, filters.invert,
  filters.hue, filters.saturation,
]);

  const konvaFilters = buildKonvaFilters(filters);
  const hasFilters   = konvaFilters.length > 0;

  return (
    <KonvaImage
      ref={imgRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      image={image ?? undefined}
      draggable={!element.locked}
      // ← Pas de dash sur les images (surtout après remove bg)
      {...(isSelected ? { stroke: '#7c3aed', strokeWidth: 2 } : {})}
      {...shadowProps(element.style)}
      {...(hasFilters ? { filters: konvaFilters } : {})}
      blurRadius={filters.blur ?? 0}
      brightness={filters.brightness ?? 0}
      contrast={filters.contrast ?? 0}
      hue={filters.hue ?? 0}
      saturation={filters.saturation ?? 0}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
    />
  );
}

// ─── Shape renderer (inchangé) ────────────────────────────────────────────────
function ShapeRenderer({ element, onSelect, isSelected }: {
  element: ShapeElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const sel      = isSelected ? SELECTION : {};
  const handlers = { onClick: () => onSelect(element.id), onTap: () => onSelect(element.id), draggable: !element.locked };
  const { style, x, y, width: w, height: h } = element;
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2;
  const shared = { id: element.id, x, y, rotation: element.rotation ?? 0, opacity: style.opacity ?? 1, ...sel, ...handlers, ...shadowProps(style) };
  const fill   = gradientFillProps(style, w, h);
  const stroke = { stroke: style.stroke, strokeWidth: style.strokeWidth ?? 0, dash: style.strokeDash };

  switch (element.type as ShapeType) {
    case 'rectangle': return <Rect  {...shared} width={w} height={h} cornerRadius={style.borderRadius ?? 0} {...fill} {...stroke} />;
    case 'circle':    return <Circle {...shared} x={x + cx} y={y + cy} radius={r} {...fill} {...stroke} />;
    case 'line':      return <Line  {...shared} points={element.points ?? [0, 0, w, 0]} stroke={style.stroke || style.fill || '#7c3aed'} strokeWidth={style.strokeWidth ?? 3} dash={style.strokeDash} />;
    case 'arrow':     return <Arrow {...shared} points={element.points ?? [0, h / 2, w, h / 2]} stroke={style.stroke || style.fill || '#7c3aed'} strokeWidth={style.strokeWidth ?? 3} fill={style.fill || '#7c3aed'} pointerLength={14} pointerWidth={12} />;
    case 'triangle':  return <Line  {...shared} points={polygonPoints(cx, cy, r, 3)}          closed {...fill} {...stroke} />;
    case 'pentagon':  return <Line  {...shared} points={polygonPoints(cx, cy, r, 5)}          closed {...fill} {...stroke} />;
    case 'hexagon':   return <Line  {...shared} points={polygonPoints(cx, cy, r, 6, Math.PI / 6)} closed {...fill} {...stroke} />;
    case 'star':      return <Line  {...shared} points={starPoints(cx, cy, r, r * 0.45, element.numPoints ?? 5)} closed {...fill} {...stroke} />;
    case 'diamond':   return <Line  {...shared} points={diamondPoints(w, h)}                  closed {...fill} {...stroke} />;
    case 'cross':     return <Line  {...shared} points={crossPoints(w, h)}                    closed {...fill} {...stroke} />;
    default:          return null;
  }
}

// ─── Main renderer ────────────────────────────────────────────────────────────
export default function RenderElement({ element, onSelect }: {
  element: CanvasElement; onSelect: (id: string) => void;
}) {
  const { selectedId, editingTextId, startEditingText } = useCanvas();
  const isSelected = selectedId === element.id;

  switch (element.type) {
    case 'text': {
      if (editingTextId === element.id) return null;
      const txt = element as TextElement;

      // Masque image → priorité max
      if (txt.maskImageSrc) {
        return <MaskedTextElement element={txt} onSelect={onSelect} isSelected={isSelected} />;
      }
      // Gradient texte
      if (txt.textGradient?.enabled) {
        return <GradientTextElement element={txt} onSelect={onSelect} isSelected={isSelected} />;
      }
      // Texte normal
      return (
        <Text
          id={txt.id}
          {...(isSelected ? SELECTION : {})}
          x={txt.x} y={txt.y}
          width={txt.width} height={txt.height}
          rotation={txt.rotation ?? 0}
          opacity={txt.style.opacity ?? 1}
          text={txt.text}
          fontSize={txt.fontSize}
          fontFamily={txt.fontFamily || 'Sora, sans-serif'}
          fontStyle={txt.fontStyle || 'normal'}
          textDecoration={txt.textDecoration === 'underline' ? 'underline' : ''}
          fill={txt.style.fill || 'transparent'}  // ← 'transparent' par défaut si pas de fill
          stroke={txt.stroke}                      // ← nouveau
          strokeWidth={txt.strokeWidth ?? 0}       // ← nouveau
          fillAfterStrokeEnabled={true} 
          align={txt.align || 'left'}
          verticalAlign={txt.verticalAlign || 'top'}
          lineHeight={txt.lineHeight ?? 1.3}
          letterSpacing={txt.letterSpacing ?? 0}
          draggable={!txt.locked}
          {...shadowProps(txt.style)}
          onClick={() => onSelect(txt.id)}
          onTap={() => onSelect(txt.id)}
          onDblClick={() => startEditingText(txt.id)}
          onDblTap={() => startEditingText(txt.id)}
        />
      );
    }

    case 'image':
      return <FilteredImageElement element={element as ImageElement} onSelect={onSelect} />;

    case 'container':
    case 'group': {
      const grp = element as ContainerElement | GroupElement;
      return (
        <Group id={grp.id} x={grp.x} y={grp.y} rotation={grp.rotation ?? 0}
          opacity={grp.style.opacity ?? 1} draggable={!grp.locked}>
          {grp.children.map((child) => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );
    }

    default:
      return <ShapeRenderer element={element as ShapeElement} onSelect={onSelect} isSelected={isSelected} />;
  }
}