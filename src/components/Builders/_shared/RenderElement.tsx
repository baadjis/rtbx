// components/builders/_shared/RenderElement.tsx
'use client';

import { Rect, Text, Circle, Line, Group, Image as KonvaImage } from 'react-konva';
import { useCanvas } from './CanvasContext';
import { CanvasElement, TextElement, ImageElement, ContainerElement, GroupElement } from './types';
import useImage from 'use-image';

function KonvaImageElement({ element, onSelect }: { element: ImageElement; onSelect: (id: string) => void }) {
  const [image] = useImage(element.src, 'anonymous');
  return (
    <KonvaImage
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation ?? 0}
      opacity={element.style.opacity ?? 1}
      draggable
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      image={image ?? undefined}
    />
  );
}

export default function RenderElement({ element, onSelect }: { element: CanvasElement; onSelect: (id: string) => void }) {
  const { selectedId, editingTextId, startEditingText } = useCanvas();
  const isSelected = selectedId === element.id;
  const isEditing = editingTextId === element.id;

  const selectionProps = isSelected ? { stroke: '#3b82f6', strokeWidth: 3, dash: [6, 4] } : {};

  switch (element.type) {
    case 'text': {
      const txt = element as TextElement;
      if (isEditing) return null;
      return (
        <Text
          id={txt.id}
          {...selectionProps}
          x={txt.x}
          y={txt.y}
          width={txt.width}
          height={txt.height}
          rotation={txt.rotation ?? 0}
          text={txt.text}
          fontSize={txt.fontSize}
          fontFamily={txt.fontFamily || 'Arial'}
          fill={txt.style.fill || '#000000'}
          align={txt.align || 'left'}
          draggable
          onClick={() => onSelect(txt.id)}
          onTap={() => onSelect(txt.id)}
          onDblClick={() => startEditingText(txt.id)}
          onDblTap={() => startEditingText(txt.id)}
        />
      );
    }

    case 'image':
      return <KonvaImageElement element={element as ImageElement} onSelect={onSelect} />;

    case 'rectangle':
      return (
        <Rect
          id={element.id}
          {...selectionProps}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation ?? 0}
          fill={element.style.fill || '#3b82f6'}
          stroke={element.style.stroke}
          strokeWidth={element.style.strokeWidth || 4}
          shadowColor={element.style.shadowColor || '#3b82f6'}
          shadowBlur={element.style.shadowBlur?? 0}

          opacity={element.style.opacity??1}
          cornerRadius={element.style.borderRadius || 0}
          draggable
          onClick={() => onSelect(element.id)}
          onTap={() => onSelect(element.id)}
        />
      );

    case 'circle':
      return (
        <Circle
          id={element.id}
          {...selectionProps}
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          radius={Math.min(element.width, element.height) / 2}
          fill={element.style.fill || '#3b82f6'}
          opacity={element.style.opacity??1}
          shadowColor={element.style.shadowColor || '#3b82f6'}
          shadowBlur={element.style.shadowBlur?? 0}

          stroke={element.style.stroke}
          strokeWidth={element.style.strokeWidth || 4}
          draggable
          onClick={() => onSelect(element.id)}
          onTap={() => onSelect(element.id)}
        />
      );

    case 'line':
      return (
        <Line
          id={element.id}
          {...selectionProps}
          x={element.x}
          y={element.y}
          points={[0, 0, element.width, 0]}
          stroke={element.style.stroke || '#1e40af'}
          strokeWidth={element.style.strokeWidth || 8}
          draggable
          onClick={() => onSelect(element.id)}
          onTap={() => onSelect(element.id)}
        />
      );

    case 'container':
    case 'group':
      const group = element as ContainerElement | GroupElement;
      return (
        <Group id={element.id} x={element.x} y={element.y} rotation={element.rotation ?? 0} draggable>
          {group.children.map((child) => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );

    default:
      return null;
  }
}