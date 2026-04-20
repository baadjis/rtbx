// components/builders/_shared/Transformer.tsx
'use client';

import { Transformer as KonvaTransformer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import { useRef, useEffect } from 'react';
import Konva from 'konva';

export default function Transformer() {
  const { selectedId, elements, updateElement } = useCanvas();
  const transformerRef = useRef<Konva.Transformer>(null);

  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = transformerRef.current.getStage();
    if (!stage) return;

    const selectedNode = stage.findOne(`#${selectedId}`);

    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  const handleTransformEnd = () => {
    if (!selectedElement || !transformerRef.current) return;

    const node = transformerRef.current.nodes()[0];
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    updateElement(selectedElement.id, {
      x: node.x(),
      y: node.y(),
      width: node.width() * scaleX,
      height: node.height() * scaleY,
      rotation: node.rotation(),
    });

    // Reset scale to 1 after transform
    node.scaleX(1);
    node.scaleY(1);
  };

  if (!selectedId) return null;

  return (
    <KonvaTransformer
      ref={transformerRef}
      rotateEnabled={true}
      resizeEnabled={true}
      borderDash={[4, 4]}
      borderStroke="#3b82f6"
      borderStrokeWidth={2}
      anchorSize={8}
      anchorFill="#3b82f6"
      anchorStroke="#ffffff"
      anchorCornerRadius={4}
      onTransformEnd={handleTransformEnd}
      onMouseDown={(e) => e.evt.stopImmediatePropagation()}
      onTouchStart={(e) => e.evt.stopImmediatePropagation()}
    />
  );
}