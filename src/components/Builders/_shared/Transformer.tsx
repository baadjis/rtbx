// components/builders/_shared/Transformer.tsx
'use client';

import { Transformer as KonvaTransformer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import { useRef, useEffect } from 'react';
import Konva from 'konva';

export default function Transformer() {
  const { selectedId, elements, updateElement } = useCanvas();
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedElement = elements.find((el) => el.id === selectedId);

  // ── Attache le transformer au nœud sélectionné ───────────────────────────
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

  // ── Resize / rotate ───────────────────────────────────────────────────────
  const handleTransformEnd = () => {
    if (!selectedElement || !transformerRef.current) return;
    const node = transformerRef.current.nodes()[0];
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    updateElement(selectedElement.id, {
      x:        node.x(),
      y:        node.y(),
      width:    node.width()  * scaleX,
      height:   node.height() * scaleY,
      rotation: node.rotation(),
    });

    // Reset scale après transform
    node.scaleX(1);
    node.scaleY(1);
  };

  // ── Drag (déplacement libre) ──────────────────────────────────────────────
  // Sans ce handler, déplacer un élément ne met pas à jour x/y dans le store
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  if (!selectedId) return null;

  return (
    <KonvaTransformer
      ref={transformerRef}
      // ── Fonctionnalités ──
      rotateEnabled={true}
      resizeEnabled={true}
      keepRatio={false}
      // ── Style violet cohérent avec le nouveau design ──
      borderStroke="#7c3aed"
      borderStrokeWidth={1.5}
      borderDash={[4, 4] as number[]}
      anchorSize={9}
      anchorFill="#7c3aed"
      anchorStroke="#ffffff"
      anchorStrokeWidth={2}
      anchorCornerRadius={3}
      // ── Rotate handle ──
      rotateAnchorOffset={20}
      // ── Événements ──
      onTransformEnd={handleTransformEnd}
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => e.evt.stopImmediatePropagation()}
      onTouchStart={(e) => e.evt.stopImmediatePropagation()}
    />
  );
}