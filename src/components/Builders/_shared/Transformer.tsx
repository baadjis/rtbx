/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // ── Lecture de la taille brute selon le type de nœud ──────────────────────
  // Circle stocke radius, Group/Rect stockent width/height
  const rawW = (() => {
    const attrW  = node.getAttr('width');
    const radius = node.getAttr('radius');
    if (attrW)  return attrW;
    if (radius) return radius * 2;
    const nw = node.width();
    return nw || selectedElement.width;
  })();

  const rawH = (() => {
    const attrH  = node.getAttr('height');
    const radius = node.getAttr('radius');
    if (attrH)  return attrH;
    if (radius) return radius * 2;
    const nh = node.height();
    return nh || selectedElement.height;
  })();

  const newWidth  = Math.max(5, rawW * scaleX);
  const newHeight = Math.max(5, rawH * scaleY);

  // Reset scale AVANT updateElement
  node.scaleX(1);
  node.scaleY(1);

  // ── Cas texte : fontSize suit le scale ───────────────────────────────────
  if (selectedElement.type === 'text') {
    const oldFontSize = (selectedElement as any).fontSize || 32;
    // Priorité au scale vertical, fallback horizontal
    const fontScale   = scaleY !== 1 ? scaleY : scaleX !== 1 ? scaleX : 1;
    const newFontSize = Math.max(8, Math.round(oldFontSize * fontScale));

    updateElement(selectedElement.id, {
      x:        Math.round(node.x()),
      y:        Math.round(node.y()),
      width:    Math.round(newWidth),
      height:   Math.round(newHeight),
      fontSize: newFontSize,
      rotation: Math.round(node.rotation()),
    } as any);

  // ── Tous les autres éléments ──────────────────────────────────────────────
  } else {
    updateElement(selectedElement.id, {
      x:        Math.round(node.x()),
      y:        Math.round(node.y()),
      width:    Math.round(newWidth),
      height:   Math.round(newHeight),
      rotation: Math.round(node.rotation()),
    });
  }

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