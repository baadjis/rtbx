// components/builders/_shared/RenderElement.tsx
'use client';

import { Rect, Text, Circle, Line, Group, Image as KonvaImage } from 'react-konva';
import { useCanvas } from './CanvasContext';
import {
  CanvasElement,
  TextElement,
  ImageElement,
  ContainerElement,
  GroupElement,
} from './types';
import useImage from 'use-image';

function KonvaImageElement({ element, onSelect }: {
  element: ImageElement;
  onSelect: (id: string) => void;
}) {
  const [image] = useImage(element.src, 'anonymous');

  const commonProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation ?? 0,
    opacity: element.style.opacity ?? 1,
    draggable: true,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
  };

  return <KonvaImage {...commonProps} image={image ?? undefined} />;
}

export default function RenderElement({ element, onSelect }: {
  element: CanvasElement;
  onSelect: (id: string) => void;
}) {
  const { selectedId, editingTextId, startEditingText } = useCanvas();

  const isSelected = selectedId === element.id;
  const isEditing = editingTextId === element.id;

  // Props communes à tous les éléments
  const commonProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation ?? 0,
    opacity: element.style.opacity ?? 1,
    draggable: true,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
  };

  // Bordure de sélection
  const selectionProps = isSelected ? {
    stroke: '#3b82f6',
    strokeWidth: 3,
    dash: [6, 4],
  } : {};

  switch (element.type) {
    case 'text': {
      const txt = element as TextElement;
      if (isEditing) return null; // caché pendant l'édition

      return (
        <Text
          {...commonProps}
          {...selectionProps}
          text={txt.text}
          fontSize={txt.fontSize}
          fontFamily={txt.fontFamily || 'Arial'}
          fontStyle={txt.fontStyle || 'normal'}
          align={txt.align || 'left'}
          verticalAlign={txt.verticalAlign || 'middle'}
          fill={txt.style.fill || '#000000'}
          lineHeight={txt.lineHeight || 1.2}
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
          {...commonProps}
          {...selectionProps}
          fill={element.style.fill || '#3b82f6'}
          stroke={element.style.stroke}
          strokeWidth={element.style.strokeWidth || 0}
          cornerRadius={element.style.borderRadius || 0}
        />
      );

    case 'circle':
      return (
        <Circle
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          radius={Math.min(element.width, element.height) / 2}
          fill={element.style.fill || '#3b82f6'}
          stroke={element.style.stroke}
          strokeWidth={element.style.strokeWidth || 0}
          {...selectionProps}
          draggable
          onClick={() => onSelect(element.id)}
          onTap={() => onSelect(element.id)}
        />
      );

    case 'line':
      return (
        <Line
          x={element.x}
          y={element.y}
          points={[0, 0, element.width, 0]}   // ligne horizontale (tu pourras l'améliorer plus tard)
          stroke={element.style.stroke || '#1e40af'}
          strokeWidth={element.style.strokeWidth || 8}
          {...selectionProps}
          draggable
          onClick={() => onSelect(element.id)}
          onTap={() => onSelect(element.id)}
        />
      );

    case 'container':
      const container = element as ContainerElement;
      return (
        <Group
          {...commonProps}
          clipX={container.clip ? 0 : undefined}
          clipY={container.clip ? 0 : undefined}
          clipWidth={container.clip ? container.width : undefined}
          clipHeight={container.clip ? container.height : undefined}
        >
          {container.children.map((child) => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );

    case 'group':
      const group = element as GroupElement;
      return (
        <Group {...commonProps}>
          {group.children.map((child) => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );

    default:
      return null;
  }
}