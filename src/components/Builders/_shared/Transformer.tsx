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
  const isTextSelected = selectedElement?.type === 'text';  

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


  // ── Drag (déplacement libre) ──────────────────────────────────────────────
  // Sans ce handler, déplacer un élément ne met pas à jour x/y dans le store
 // ── useEffect dragEnd consolidé ───────────────────────────────────────────────
// ── useEffect dragEnd ─────────────────────────────────────────────────────────
useEffect(() => {
  if (!transformerRef.current) return;
  const stage = transformerRef.current.getStage();
  if (!stage) return;
  const selectedNode = stage.findOne(`#${selectedId}`);
  if (!selectedNode) return;

  const onDragEnd = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      x: Math.round(selectedNode.x()),
      y: Math.round(selectedNode.y()),
    });
  };

  selectedNode.on('dragend', onDragEnd);
  return () => { selectedNode.off('dragend', onDragEnd); };
}, [selectedId, selectedElement, updateElement]);

// ── handleTransformEnd ────────────────────────────────────────────────────────
const handleTransformEnd = () => {
  if (!selectedElement || !transformerRef.current) return;
  const node = transformerRef.current.nodes()[0];
  if (!node) return;

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  // Lecture taille brute — fiable pour Group (circle, lineShapes)
  // et pour Rect/shapes directes
  const rawW = node.getAttr('width')  ?? node.width()  ?? selectedElement.width;
  const rawH = node.getAttr('height') ?? node.height() ?? selectedElement.height;

  // Reset scale AVANT updateElement — important pour éviter double-apply
  node.scaleX(1);
  node.scaleY(1);

  if (selectedElement.type === 'text') {
    const oldFontSize = (selectedElement as any).fontSize || 32;

    const newWidth  = Math.max(20, rawW * scaleX);
    const newHeight = Math.max(20, rawH * scaleY);

    const isVerticalResize   = Math.abs(scaleY - 1) > 0.01;
    const isHorizontalResize = Math.abs(scaleX - 1) > 0.01;

    let newFontSize = oldFontSize;
    if (isVerticalResize && !isHorizontalResize) {
      // Resize vertical pur → police suit
      newFontSize = Math.max(8, Math.round(oldFontSize * scaleY));
    } else if (isVerticalResize && isHorizontalResize) {
      // Resize diagonal → scale moyen
      newFontSize = Math.max(8, Math.round(oldFontSize * (scaleX + scaleY) / 2));
    }
    // Resize horizontal pur → police inchangée, largeur change seulement

    updateElement(selectedElement.id, {
      x:        Math.round(node.x()),
      y:        Math.round(node.y()),
      width:    Math.round(newWidth),
      height:   Math.round(newHeight),
      fontSize: newFontSize,
      rotation: Math.round(node.rotation()),
    } as any);

  } else {
    const newWidth  = Math.max(5, rawW * scaleX);
    const newHeight = Math.max(5, rawH * scaleY);

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

  if (!selectedId) return null;

  return (
    <KonvaTransformer
      ref={transformerRef}
      // ── Fonctionnalités ──
      rotateEnabled={true}
      resizeEnabled={true}
      keepRatio={false}
      flipEnabled={false}
       enabledAnchors={undefined}
  boundBoxFunc={(oldBox, newBox) => {
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