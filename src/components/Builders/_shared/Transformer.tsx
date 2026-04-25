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

  // ← Pour les Group, width()/height() = 0, on utilise les valeurs du store
  const baseWidth  = node.width()  || selectedElement.width;
  const baseHeight = node.height() || selectedElement.height;

  const newWidth  = Math.max(5, baseWidth  * scaleX);
  const newHeight = Math.max(5, baseHeight * scaleY);

  node.scaleX(1);
  node.scaleY(1);

  updateElement(selectedElement.id, {
    x:        Math.round(node.x()),
    y:        Math.round(node.y()),
    width:    Math.round(newWidth),
    height:   Math.round(newHeight),
    rotation: Math.round(node.rotation()),
  });

  node.getLayer()?.batchDraw();
};

  // ── Drag (déplacement libre) ──────────────────────────────────────────────
  // Sans ce handler, déplacer un élément ne met pas à jour x/y dans le store
  useEffect(() => {
  if (!transformerRef.current) return;
  const stage = transformerRef.current.getStage();
  if (!stage) return;

  const selectedNode = stage.findOne(`#${selectedId}`);
  if (!selectedNode) return;

  // ← Le drag est géré par le nœud lui-même, pas le Transformer
  const onDragEnd = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      x: Math.round(selectedNode.x()),
      y: Math.round(selectedNode.y()),
    });
  };

  selectedNode.on('dragend', onDragEnd);

  // Cleanup : retire le listener quand l'élément change
  return () => {
    selectedNode.off('dragend', onDragEnd);
  };
}, [selectedId, selectedElement, updateElement]);

  if (!selectedId) return null;

  return (
    <KonvaTransformer
      ref={transformerRef}
      // ── Fonctionnalités ──
      rotateEnabled={true}
      resizeEnabled={true}
      keepRatio={false}
      flipEnabled={false}
  boundBoxFunc={(oldBox, newBox) => {
    // Empêche la taille de passer en négatif
    if (newBox.width < 5 || newBox.height < 5) return oldBox;
    return newBox;
  }}
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
      
      onMouseDown={(e) => e.evt.stopImmediatePropagation()}
      onTouchStart={(e) => e.evt.stopImmediatePropagation()}
    />
  );
}