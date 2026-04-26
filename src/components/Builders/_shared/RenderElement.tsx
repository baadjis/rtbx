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
  BezierElement,
  DrawElement,
  ImageBackground,
  ClipShape,
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

  const c1 = style.gradientColor1 ?? '#7c3aed';
  const c2 = style.gradientColor2 ?? '#06b6d4';
  const cx = width / 2, cy = height / 2;

  if (style.gradientType === 'radial') {
    const r = Math.min(width, height) / 2 * (style.gradientRadius ?? 1);
    return {
      fillRadialGradientStartPoint:      { x: cx, y: cy },
      fillRadialGradientEndPoint:        { x: cx, y: cy },
      fillRadialGradientStartRadius:     0,
      fillRadialGradientEndRadius:       r,
      fillRadialGradientColorStops:      [0, c1, 1, c2],
      fill: undefined,
    };
  }

  // Linear (existant)
  const deg = style.gradientDirection ?? 90;
  const rad = (deg * Math.PI) / 180;
  const dx = Math.cos(rad) * cx, dy = Math.sin(rad) * cy;
  return {
    fillLinearGradientStartPoint:      { x: cx - dx, y: cy - dy },
    fillLinearGradientEndPoint:        { x: cx + dx, y: cy + dy },
    fillLinearGradientColorStops:      [0, c1, 1, c2],
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

// ─── Blob points generator ────────────────────────────────────────────────────
// Génère un blob organique aléatoire mais reproductible via seed
function blobPoints(
  cx: number,
  cy: number,
  r: number,
  sides = 8,
  irregularity = 0.4,
  seed = 42,
): number[] {
  // Petit PRNG déterministe (pas de Math.random() — reproductible)
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const pts: number[] = [];
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle  = i * angleStep - Math.PI / 2;
    // Rayon variable pour l'effet organique
    const radius = r * (1 - irregularity / 2 + rand() * irregularity);
    pts.push(
      cx + radius * Math.cos(angle),
      cy + radius * Math.sin(angle),
    );
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


// ─── Bézier en mode édition (points déplaçables) ──────────────────────────────
function BezierEditMode({ element }: { element: BezierElement }) {
  const { updateElement, finishEditingBezier } = useCanvas();

  const handlePointDrag = (index: number, e: any) => {
    const newPoints = [...element.points];
    newPoints[index] = { x: e.target.x(), y: e.target.y() };
    updateElement(element.id, { points: newPoints } as any);
    // Recalcule le bounding box
    const xs = newPoints.map((p) => p.x);
    const ys = newPoints.map((p) => p.y);
    updateElement(element.id, {
      points: newPoints,
      width:  Math.max(...xs),
      height: Math.max(...ys),
    } as any);
  };

  const flatPoints = element.points.flatMap((p) => [p.x, p.y]);

  return (
    <Group
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
    >
      {/* Courbe */}
      <Line
        points={flatPoints}
        stroke={element.style.stroke || '#7c3aed'}
        strokeWidth={element.style.strokeWidth ?? 3}
        tension={element.tension ?? 0.4}
        closed={element.closed}
        fill={element.closed ? (element.style.fill || 'transparent') : 'transparent'}
        listening={false}
      />
      {/* Points éditables */}
      {element.points.map((p, i) => (
        <Circle
          key={i}
          x={p.x} y={p.y}
          radius={6}
          fill="#ffffff"
          stroke="#7c3aed"
          strokeWidth={2}
          draggable
          onDragMove={(e) => handlePointDrag(i, e)}
          // Curseur
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'move';
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'default';
          }}
        />
      ))}
      {/* Clic en dehors = quitter le mode édition */}
      <Rect
        x={-9999} y={-9999}
        width={19998} height={19998}
        fill="transparent"
        listening={true}
        onClick={finishEditingBezier}
      />
    </Group>
  );
}

// ─── Bézier normal ────────────────────────────────────────────────────────────
function BezierShape({ element, onSelect, isSelected }: {
  element: BezierElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const { startEditingBezier } = useCanvas();
  const flatPoints = element.points.flatMap((p) => [p.x, p.y]);

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
      onDblClick={() => startEditingBezier(element.id)}
      onDblTap={() => startEditingBezier(element.id)}
    >
      {/* Hitbox */}
      <Rect
        width={element.width}
        height={element.height}
        fill="rgba(0,0,0,0.001)"
        stroke={isSelected ? '#7c3aed' : undefined}
        strokeWidth={isSelected ? 2 : 0}
        dash={isSelected ? [5, 4] as number[] : undefined}
      />
      <Line
        points={flatPoints}
        stroke={element.style.stroke || '#7c3aed'}
        strokeWidth={element.style.strokeWidth ?? 3}
        tension={element.tension ?? 0.4}
        closed={element.closed}
        fill={element.closed ? (element.style.fill || 'transparent') : 'transparent'}
        dash={element.style.strokeDash}
        listening={false}
      />
    </Group>
  );
}

// ─── Gradient Text Component ─────────────────────────────────────────────────
function GradientTextElement({ element, onSelect, isSelected }: {
  element: TextElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const { startEditingText ,} = useCanvas();
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
  const compositeDataUrl = useMemo(() => composite?.toDataURL() ?? '', [composite]);
  const [compositeImage] = useImage(compositeDataUrl);

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
    <Rect
      width={element.width}
      height={element.height}
      fill="rgba(0,0,0,0.001)"
      stroke={isSelected ? '#7c3aed' : undefined}
      strokeWidth={isSelected ? 2 : 0}
      dash={isSelected ? [5, 4] as number[] : undefined}
      // ← ces deux props sont clés
      listening={true}
      perfectDrawEnabled={false}
    />

    {compositeImage && (
      <KonvaImage
        image={compositeImage}
        width={element.width}
        height={element.height}
        // ← empêche KonvaImage de capturer les events (le Rect s'en charge)
        listening={false}
        perfectDrawEnabled={false}
      />
    )}

    {!compositeImage && (
      <Text
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily || 'Sora'}
        fontStyle={element.fontStyle || 'normal'}
        fill={element.style.fill || '#000000'}
        width={element.width}
        align={element.align || 'left'}
        listening={false}
      />
    )}
  </Group>
);
  
}

// ─── Helpers clip path ────────────────────────────────────────────────────────
function applyClipShape(
  ctx: CanvasRenderingContext2D | any,
  shape: ClipShape,
  w: number,
  h: number,
  radius = 20,
) {
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2;

  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;

    case 'rounded':
      ctx.roundRect(0, 0, w, h, radius);
      break;

    case 'triangle': {
      const pts = polygonPoints(cx, cy, r, 3);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      break;
    }

    case 'hexagon': {
      const pts = polygonPoints(cx, cy, r, 6, Math.PI / 6);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      break;
    }

    case 'pentagon': {
      const pts = polygonPoints(cx, cy, r, 5);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      break;
    }

    case 'star': {
      const pts = starPoints(cx, cy, r, r * 0.45, 5);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      break;
    }

    case 'diamond': {
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(w / 2, h);
      ctx.lineTo(0, h / 2);
      ctx.closePath();
      break;
    }

    case 'blob': {
      const pts = blobPoints(cx, cy, r);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      break;
    }

    default:
      ctx.rect(0, 0, w, h);
  }
}

// ─── Background renderer (canvas 2D) ─────────────────────────────────────────
function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: ImageBackground,
  w: number,
  h: number,
  bgImage?: HTMLImageElement,
) {
  if (bg.type === 'color' && bg.color) {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, w, h);

  } else if (bg.type === 'gradient' && bg.gradient) {
    const g = bg.gradient;
    let grad: CanvasGradient;
    if (g.type === 'radial') {
      grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.min(w,h)/2);
    } else {
      const rad = (g.direction * Math.PI) / 180;
      const cx = w/2, cy = h/2;
      const dx = Math.cos(rad) * cx, dy = Math.sin(rad) * cy;
      grad = ctx.createLinearGradient(cx-dx, cy-dy, cx+dx, cy+dy);
    }
    grad.addColorStop(0, g.color1);
    grad.addColorStop(1, g.color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

  } else if (bg.type === 'image' && bgImage) {
    ctx.drawImage(bgImage, 0, 0, w, h);
  }
}

// ─── Composite canvas : bg + image clippée par shape ─────────────────────────
function useCompositeImage(element: ImageElement): HTMLCanvasElement | null {
  const src = element.bgRemoved && element.removedBgSrc
    ? element.removedBgSrc : element.src;

  const [fgImg, setFgImg] = useState<HTMLImageElement | null>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);

  // Charge foreground
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setFgImg(img);
    img.src = src;
  }, [src]);

  // Charge background image si besoin
  useEffect(() => {
    if (element.background?.type !== 'image' || !element.background.imageSrc) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setBgImg(img);
    img.src = element.background.imageSrc;
  }, [element.background?.imageSrc]);

  return useMemo(() => {
    if (!fgImg) return null;

    const w = element.width  || 300;
    const h = element.height || 300;
    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // 1. Dessine le background si remove bg actif
    if (element.bgRemoved && element.background) {
      drawBackground(ctx, element.background, w, h, bgImg ?? undefined);
    }

    // 2. Applique le clip shape
    if (element.clipShape && element.clipShape !== 'none') {
      ctx.save();
      applyClipShape(ctx, element.clipShape, w, h, element.clipRadius ?? 20);
      ctx.clip();
    }

    // 3. Dessine l'image foreground
    ctx.drawImage(fgImg, 0, 0, w, h);

    // 4. Restore clip
    if (element.clipShape && element.clipShape !== 'none') {
      ctx.restore();
    }

    return canvas;
  }, [
    fgImg, bgImg,
    element.width, element.height,
    element.clipShape, element.clipRadius,
    element.bgRemoved, element.background,
  ]);
}

// ─── FilteredImageElement (refactorisé) ──────────────────────────────────────
function FilteredImageElement({ element, onSelect }: {
  element: ImageElement; onSelect: (id: string) => void;
}) {
  const { selectedId } = useCanvas();
  const isSelected     = selectedId === element.id;
  const filters        = element.filters ?? {};
  const composite      = useCompositeImage(element);

  // URL stable pour useImage
  const compositeUrl = useMemo(
    () => composite?.toDataURL() ?? '',
    [composite]
  );
  const [compositeImage] = useImage(compositeUrl);

  // Src fallback (sans composite)
  const plainSrc = element.bgRemoved && element.removedBgSrc
    ? element.removedBgSrc : element.src;
  const [plainImage] = useImage(plainSrc, 'anonymous');

  const imgRef = useRef<any>(null);

  // Konva filters
  const konvaFilters = buildKonvaFilters(filters);
  const hasFilters   = konvaFilters.length > 0;

  useEffect(() => {
    if (!imgRef.current) return;
    const node = imgRef.current;
    node.clearCache();
    if (hasFilters) node.cache();
    node.getLayer()?.batchDraw();
  }, [
    compositeUrl, plainSrc,
    element.width, element.height,
    hasFilters,
    filters.blur, filters.brightness, filters.contrast,
    filters.grayscale, filters.sepia, filters.invert,
    filters.hue, filters.saturation,
  ]);

  // Image à afficher : composite si clip/bg, sinon plain
  const needsComposite = !!(
    (element.clipShape && element.clipShape !== 'none') ||
    (element.bgRemoved && element.background)
  );
  const displayImage = needsComposite ? compositeImage : plainImage;

  return (
    <KonvaImage
      ref={imgRef}
      id={element.id}
      x={element.x} y={element.y}
      width={element.width} height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      image={displayImage ?? undefined}
      draggable={!element.locked}
      // Blend mode natif Konva
      globalCompositeOperation={element.blendMode ?? 'source-over'}
      // Filtres
      {...(hasFilters ? { filters: konvaFilters } : {})}
      blurRadius={filters.blur       ?? 0}
      brightness={filters.brightness ?? 0}
      contrast={filters.contrast     ?? 0}
      hue={filters.hue               ?? 0}
      saturation={filters.saturation ?? 0}
      // Sélection sans dash pour les images
      {...(isSelected ? { stroke: '#7c3aed', strokeWidth: 2 } : {})}
      {...shadowProps(element.style)}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
    />
  );
}

// ─── Helper : wraps any Line-based shape in Group + hitbox ───────────────────
function LineShape({
  element, points, closed = true, isSelected, onSelect, fill, stroke,
}: {
  element:    ShapeElement;
  points:     number[];
  closed?:    boolean;
  isSelected: boolean;
  onSelect:   (id: string) => void;
  fill:       Record<string, any>;
  stroke:     Record<string, any>;
}) {
  const { style, x, y, width: w, height: h } = element;

  return (
    <Group
      id={element.id}
      x={x} y={y}
      width={w} height={h}
      rotation={element.rotation ?? 0}
      opacity={style.opacity ?? 1}
      draggable={!element.locked}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
    >
      {/* Hitbox — listening={true} pour capturer drag/click */}
      <Rect
        width={w} height={h}
        fill="rgba(0,0,0,0.001)"
        stroke={isSelected ? '#7c3aed' : undefined}
        strokeWidth={isSelected ? 2 : 0}
        dash={isSelected ? [5, 4] as number[] : undefined}
        listening={true}   // ← était false, corrigé
      />
      {/* La Line ne capte pas les events, le Rect s'en charge */}
      <Line
        points={points}
        closed={closed}
        listening={false}  // ← reste false
        {...fill}
        {...stroke}
        {...shadowProps(style)}
      />
    </Group>
  );
}
// ─── Shape renderer (inchangé) ────────────────────────────────────────────────
function ShapeRenderer({ element, onSelect, isSelected }: {
  element: ShapeElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const handlers = {
    onClick:   () => onSelect(element.id),
    onTap:     () => onSelect(element.id),
    draggable: !element.locked,
  };
  const { style, x, y, width: w, height: h } = element;
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2;
  const sel    = isSelected ? SELECTION : {};
  const fill   = gradientFillProps(style, w, h);
  const stroke = {
    stroke:      style.stroke,
    strokeWidth: style.strokeWidth ?? 0,
    dash:        style.strokeDash,
  };
  const shared = {
    id: element.id, x, y, width: w, height: h,
    rotation: element.rotation ?? 0,
    opacity:  style.opacity ?? 1,
    ...sel, ...handlers, ...shadowProps(style),
  };

  // Shapes avec Line — juste les points changent
  const lineShapes: Partial<Record<ShapeType, number[]>> = {
    triangle: polygonPoints(cx, cy, r, 3),
    pentagon: polygonPoints(cx, cy, r, 5),
    hexagon:  polygonPoints(cx, cy, r, 6, Math.PI / 6),
    star:     starPoints(cx, cy, r, r * 0.45, element.numPoints ?? 5),
    diamond:  diamondPoints(w, h),
    cross:    crossPoints(w, h),
    octagon: polygonPoints(cx, cy, r, 8),  // ← 1 ligne suffit
    blob:    blobPoints(cx, cy, r),  
  };

  // ← Si c'est une Line shape, on délègue à LineShape
  if (element.type in lineShapes) {
    return (
      <LineShape
        element={element}
        points={lineShapes[element.type as ShapeType]!}
        closed
        isSelected={isSelected}
        onSelect={onSelect}
        fill={fill}
        stroke={stroke}
      />
    );
  }

  switch (element.type as ShapeType) {
    case 'rectangle':
      return (
        <Rect {...shared}
          cornerRadius={style.borderRadius ?? 0}
          {...fill} {...stroke}
        />
      );

    case 'circle':
      return (
        <Circle {...shared}
          x={x + cx} y={y + cy}
          radius={r}
          {...fill} {...stroke}
        />
      );

    case 'line':
      return (
        <Line {...shared}
          points={element.points ?? [0, 0, w, 0]}
          stroke={style.stroke || style.fill || '#7c3aed'}
          strokeWidth={style.strokeWidth ?? 3}
          dash={style.strokeDash}
        />
      );

    case 'arrow':
      return (
        <Arrow {...shared}
          points={element.points ?? [0, h / 2, w, h / 2]}
          stroke={style.stroke || style.fill || '#7c3aed'}
          strokeWidth={style.strokeWidth ?? 3}
          fill={style.fill || '#7c3aed'}
          pointerLength={14}
          pointerWidth={12}
        />
      );

    default:
      return null;
  }
}

// ─── Main renderer ────────────────────────────────────────────────────────────
export default function RenderElement({ element, onSelect }: {
  element: CanvasElement; onSelect: (id: string) => void;
}) {
  const { selectedId, editingTextId, startEditingText ,editingBezierPath} = useCanvas();
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

  case 'bezier': {
  const bel = element as BezierElement;
  if (editingBezierPath && selectedId === bel.id) {
    return <BezierEditMode element={bel} />;
  }
  return <BezierShape element={bel} onSelect={onSelect} isSelected={isSelected} />;
}

case 'draw': {
  const d = element as DrawElement;
  return (
    <Line
      id={d.id}
      points={d.points}
      stroke={d.style.stroke || '#7c3aed'}
      strokeWidth={d.style.strokeWidth ?? d.lineWidth}
      tension={d.tool === 'brush' ? 0.4 : 0.2}
      lineCap={d.lineCap || 'round'}
      lineJoin="round"
      opacity={d.style.opacity ?? 1}
      globalCompositeOperation="source-over"
      // Les traits ne sont pas sélectionnables/draggables individuellement
      // sauf si on clique dessus explicitement
      draggable={!d.locked}
      onClick={() => onSelect(d.id)}
      onTap={() => onSelect(d.id)}
      listening={true}
    />
  );
}

    default:
      return <ShapeRenderer element={element as ShapeElement} onSelect={onSelect} isSelected={isSelected} />;
  }
}