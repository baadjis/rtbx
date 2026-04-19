// components/builders/_shared/RenderElement.tsx
'use client';

import { Rect, Text, Circle, Group, Image as KonvaImage } from 'react-konva';
import { useCanvas } from './CanvasContext';
import { 
  CanvasElement, 
  TextElement, 
  ImageElement, 
  ContainerElement, 
  GroupElement 
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

  return (
    <KonvaImage
      {...commonProps}
      image={image ?? undefined}
    />
  );
}
export default function RenderElement({ element, onSelect }: { 
  element: CanvasElement; 
  onSelect: (id: string) => void;
}) {
  const { selectedId, editingTextId, startEditingText } = useCanvas();
  const isSelected = selectedId === element.id;
  const isEditing = editingTextId === element.id;

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

  const selectionProps = isSelected ? {
    stroke: '#3b82f6',
    strokeWidth: 3,
    dash: [6, 4],
  } : {};

  switch (element.type) {
    case 'text': {
      const txt = element as TextElement;

      // Si on est en mode édition → on cache le Text Konva
      if (isEditing) return null;

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
          onDblClick={() => startEditingText(txt.id)}     // ← Double clic pour éditer
          onDblTap={() => startEditingText(txt.id)}       // Support mobile
        />
      );
    }

    case 'image':
      return <KonvaImageElement element={element as ImageElement} onSelect={onSelect} />;

    case 'rectangle':
      return <Rect {...commonProps} {...selectionProps} fill={element.style.fill} stroke={element.style.stroke} strokeWidth={element.style.strokeWidth} cornerRadius={element.style.borderRadius} />;

    case 'circle':
      return (
        <Circle
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          radius={Math.min(element.width, element.height) / 2}
          fill={element.style.fill}
          stroke={element.style.stroke}
          strokeWidth={element.style.strokeWidth || 0}
          {...selectionProps}
        />
      );

    case 'container':
      const container = element as ContainerElement;
      return (
        <Group {...commonProps} clipX={container.clip ? 0 : undefined} clipY={container.clip ? 0 : undefined} clipWidth={container.clip ? container.width : undefined} clipHeight={container.clip ? container.height : undefined}>
          {container.children.map(child => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );

    case 'group':
      const group = element as GroupElement;
      return (
        <Group {...commonProps}>
          {group.children.map(child => (
            <RenderElement key={child.id} element={child} onSelect={onSelect} />
          ))}
        </Group>
      );

    default:
      return null;
  }
}