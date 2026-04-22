/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/RenderElement.tsx
'use client';

import { Rect, Text, Circle, Line, Group, Image as KonvaImage } from 'react-konva';
import { useCanvas } from './CanvasContext';
import {
  CanvasElement, TextElement, ImageElement,
  ShapeElement, ContainerElement, GroupElement,
  StyleProps,
} from './types';
import useImage from 'use-image';
import Konva from 'konva';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Props d'ombre communes à toutes les shapes */
function shadowProps(style: StyleProps) {
  return {
    shadowColor:   style.shadowColor   ?? 'transparent',
    shadowBlur:    style.shadowBlur    ?? 0,
    shadowOffsetX: style.shadowOffsetX ?? 0,
    shadowOffsetY: style.shadowOffsetY ?? 0,
    shadowEnabled: (style.shadowBlur ?? 0) > 0,
  };
}

/** Construit un fillLinearGradientXXX pour Konva si gradient activé */
function gradientFillProps(
  style: StyleProps,
  width: number,
  height: number,
): Record<string, any>{
  if (!style.gradientEnabled) return { fill: style.fill ?? '#7c3aed' };

  const deg = style.gradientDirection ?? 90;
  const rad = (deg * Math.PI) / 180;

  // Calcul du vecteur start→end dans le repère de la shape
  const cx = width  / 2;
  const cy = height / 2;
  const dx = Math.cos(rad) * cx;
  const dy = Math.sin(rad) * cy;

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

// ─── Selection border ─────────────────────────────────────────────────────────
const SELECTION = { stroke: '#7c3aed', strokeWidth: 2, dash: [5, 4] as number[] };

// ─── Image element ────────────────────────────────────────────────────────────
function KonvaImageElement({
  element, onSelect,
}: {
  element: ImageElement; onSelect: (id: string) => void;
}) {
  const [image] = useImage(element.src, 'anonymous');
  const { selectedId } = useCanvas();
  const isSelected = selectedId === element.id;

  return (
    <KonvaImage
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      image={image ?? undefined}
      draggable={!element.locked}
      {...(isSelected ? SELECTION : {})}
      {...shadowProps(element.style)}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
    />
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────
export default function RenderElement({
  element,
  onSelect,
}: {
  element: CanvasElement;
  onSelect: (id: string) => void;
}) {
  const { selectedId, editingTextId, startEditingText } = useCanvas();
  const isSelected = selectedId === element.id;
  const isEditing  = editingTextId === element.id;
  const sel        = isSelected ? SELECTION : {};
  const draggable  = !element.locked;

  // ── Shared event handlers ─────────────────────────────────────────────────
  const selectHandlers = {
    onClick:  () => onSelect(element.id),
    onTap:    () => onSelect(element.id),
    draggable,
  };

  switch (element.type) {

    // ── Text ────────────────────────────────────────────────────────────────
    case 'text': {
      if (isEditing) return null;
      const txt = element as TextElement;
      return (
        <Text
          id={txt.id}
          {...sel}
          {...selectHandlers}
          x={txt.x}
          y={txt.y}
          width={txt.width}
          height={txt.height}
          rotation={txt.rotation ?? 0}
          opacity={txt.style.opacity ?? 1}
          text={txt.text}
          fontSize={txt.fontSize}
          fontFamily={txt.fontFamily || 'Sora, sans-serif'}
          fontStyle={txt.fontStyle || 'normal'}
          fontVariant="normal"
          textDecoration={txt.textDecoration === 'underline' ? 'underline' : ''}
          fill={txt.style.fill || '#000000'}
          align={txt.align || 'left'}
          verticalAlign={txt.verticalAlign || 'top'}
          lineHeight={txt.lineHeight ?? 1.3}
          letterSpacing={txt.letterSpacing ?? 0}
          {...shadowProps(txt.style)}
          onDblClick={() => startEditingText(txt.id)}
          onDblTap={() => startEditingText(txt.id)}
        />
      );
    }

    // ── Image ───────────────────────────────────────────────────────────────
    case 'image':
      return (
        <KonvaImageElement
          element={element as ImageElement}
          onSelect={onSelect}
        />
      );

    // ── Rectangle ───────────────────────────────────────────────────────────
    case 'rectangle': {
      const s = element as ShapeElement;
      return (
        <Rect
          id={s.id}
          {...sel}
          {...selectHandlers}
          x={s.x}
          y={s.y}
          width={s.width}
          height={s.height}
          rotation={s.rotation ?? 0}
          opacity={s.style.opacity ?? 1}
          cornerRadius={s.style.borderRadius ?? 0}
          stroke={s.style.stroke}
          strokeWidth={s.style.strokeWidth ?? 0}
          dash={s.style.strokeDash}
          {...shadowProps(s.style)}
          {...gradientFillProps(s.style, s.width, s.height)}
        />
      );
    }

    // ── Circle ──────────────────────────────────────────────────────────────
    case 'circle': {
      const s = element as ShapeElement;
      const r = Math.min(s.width, s.height) / 2;
      return (
        <Circle
          id={s.id}
          {...sel}
          {...selectHandlers}
          x={s.x + s.width  / 2}
          y={s.y + s.height / 2}
          radius={r}
          opacity={s.style.opacity ?? 1}
          stroke={s.style.stroke}
          strokeWidth={s.style.strokeWidth ?? 0}
          dash={s.style.strokeDash}
          {...shadowProps(s.style)}
          {...gradientFillProps(s.style, s.width, s.height)}
        />
      );
    }

    // ── Line ────────────────────────────────────────────────────────────────
    case 'line': {
      const s = element as ShapeElement;
      return (
        <Line
          id={s.id}
          {...sel}
          {...selectHandlers}
          x={s.x}
          y={s.y}
          points={s.points ?? [0, 0, s.width, 0]}
          stroke={s.style.stroke || s.style.fill || '#7c3aed'}
          strokeWidth={s.style.strokeWidth ?? 3}
          dash={s.style.strokeDash}
          opacity={s.style.opacity ?? 1}
          {...shadowProps(s.style)}
        />
      );
    }

    // ── Triangle (prêt pour la suite) ────────────────────────────────────────
    case 'triangle': {
      const s = element as ShapeElement;
      const pts = s.points ?? [
        s.width / 2, 0,
        s.width,     s.height,
        0,           s.height,
      ];
      return (
        <Line
          id={s.id}
          {...sel}
          {...selectHandlers}
          x={s.x}
          y={s.y}
          points={pts}
          closed
          opacity={s.style.opacity ?? 1}
          stroke={s.style.stroke}
          strokeWidth={s.style.strokeWidth ?? 0}
          {...shadowProps(s.style)}
          {...gradientFillProps(s.style, s.width, s.height)}
        />
      );
    }

    // ── Group / Container ────────────────────────────────────────────────────
    case 'container':
    case 'group': {
      const grp = element as ContainerElement | GroupElement;
      return (
        <Group
          id={grp.id}
          x={grp.x}
          y={grp.y}
          rotation={grp.rotation ?? 0}
          opacity={grp.style.opacity ?? 1}
          draggable={draggable}
        >
          {grp.children.map((child) => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );
    }

    default:
      return null;
  }
}