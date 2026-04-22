/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/RenderElement.tsx
'use client';

import { Rect, Text, Circle, Line, Group, Image as KonvaImage, Arrow } from 'react-konva';
import { useCanvas } from './CanvasContext';
import {
  CanvasElement, TextElement, ImageElement,
  ShapeElement, ContainerElement, GroupElement,
  StyleProps, ShapeType,
} from './types';
import useImage from 'use-image';
//import Konva from 'konva';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    fillLinearGradientColorStops: [0, style.gradientColor1 ?? '#7c3aed', 1, style.gradientColor2 ?? '#06b6d4'],
    fill: undefined,
  };
}

/** Points d'un polygone régulier centré sur (cx,cy) avec n côtés */
function polygonPoints(cx: number, cy: number, r: number, sides: number, offsetAngle = 0): number[] {
  const pts: number[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2 + offsetAngle;
    pts.push(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  return pts;
}

/** Points d'une étoile à n branches */
function starPoints(cx: number, cy: number, outerR: number, innerR: number, branches: number): number[] {
  const pts: number[] = [];
  for (let i = 0; i < branches * 2; i++) {
    const angle = (i * Math.PI) / branches - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  return pts;
}

/** Points d'une croix */
function crossPoints(w: number, h: number, thickness = 0.3): number[] {
  const tx = w * thickness, ty = h * thickness;
  return [
    tx, 0,       w - tx, 0,
    w - tx, ty,  w, ty,
    w, h - ty,   w - tx, h - ty,
    w - tx, h,   tx, h,
    tx, h - ty,  0, h - ty,
    0, ty,       tx, ty,
  ];
}

/** Points d'un diamant */
function diamondPoints(w: number, h: number): number[] {
  return [w / 2, 0, w, h / 2, w / 2, h, 0, h / 2];
}

const SELECTION = { stroke: '#7c3aed', strokeWidth: 2, dash: [5, 4] as number[] };

// ─── Image element ────────────────────────────────────────────────────────────
function KonvaImageElement({ element, onSelect }: { element: ImageElement; onSelect: (id: string) => void }) {
  const [image] = useImage(element.src, 'anonymous');
  const { selectedId } = useCanvas();
  return (
    <KonvaImage
      id={element.id}
      x={element.x} y={element.y}
      width={element.width} height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      image={image ?? undefined}
      draggable={!element.locked}
      {...(selectedId === element.id ? SELECTION : {})}
      {...shadowProps(element.style)}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
    />
  );
}

// ─── Shape renderer ───────────────────────────────────────────────────────────
function ShapeRenderer({ element, onSelect, isSelected }: {
  element: ShapeElement; onSelect: (id: string) => void; isSelected: boolean;
}) {
  const sel = isSelected ? SELECTION : {};
  const handlers = { onClick: () => onSelect(element.id), onTap: () => onSelect(element.id), draggable: !element.locked };
  const { style, x, y, width: w, height: h } = element;
  const cx = w / 2, cy = h / 2;
  const r  = Math.min(w, h) / 2;
  const shared = { id: element.id, x, y, rotation: element.rotation ?? 0, opacity: style.opacity ?? 1, ...sel, ...handlers, ...shadowProps(style) };
  const fill   = gradientFillProps(style, w, h);
  const stroke = { stroke: style.stroke, strokeWidth: style.strokeWidth ?? 0, dash: style.strokeDash };

  switch (element.type as ShapeType) {

    case 'rectangle':
      return <Rect {...shared} width={w} height={h} cornerRadius={style.borderRadius ?? 0} {...fill} {...stroke} />;

    case 'circle':
      return <Circle {...shared} x={x + cx} y={y + cy} radius={r} {...fill} {...stroke} />;

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
          pointerAtBeginning={false}
        />
      );

    case 'triangle':
      return (
        <Line {...shared}
          points={polygonPoints(cx, cy, r, 3)}
          closed
          {...fill} {...stroke}
        />
      );

    case 'pentagon':
      return (
        <Line {...shared}
          points={polygonPoints(cx, cy, r, 5)}
          closed
          {...fill} {...stroke}
        />
      );

    case 'hexagon':
      return (
        <Line {...shared}
          points={polygonPoints(cx, cy, r, 6, Math.PI / 6)}
          closed
          {...fill} {...stroke}
        />
      );

    case 'star':
      return (
        <Line {...shared}
          points={starPoints(cx, cy, r, r * 0.45, element.numPoints ?? 5)}
          closed
          {...fill} {...stroke}
        />
      );

    case 'diamond':
      return (
        <Line {...shared}
          points={diamondPoints(w, h)}
          closed
          {...fill} {...stroke}
        />
      );

    case 'cross':
      return (
        <Line {...shared}
          points={crossPoints(w, h)}
          closed
          {...fill} {...stroke}
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
  const { selectedId, editingTextId, startEditingText } = useCanvas();
  const isSelected = selectedId === element.id;

  switch (element.type) {
    case 'text': {
      if (editingTextId === element.id) return null;
      const txt = element as TextElement;
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
          fill={txt.style.fill || '#000000'}
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
      return <KonvaImageElement element={element as ImageElement} onSelect={onSelect} />;

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
      // Toutes les ShapeType tombent ici
      return (
        <ShapeRenderer
          element={element as ShapeElement}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      );
  }
}