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
useEffect(() => {
  if (!transformerRef.current) return;
  const stage = transformerRef.current.getStage();
  if (!stage) return;
  const selectedNode = stage.findOne(`#${selectedId}`);
  if (!selectedNode) return;

  const onDragEnd = () => {
    if (!selectedElement) return;
    // ← x/y depuis le nœud directement (Group = coin sup gauche ✓)
    updateElement(selectedElement.id, {
      x: Math.round(selectedNode.x()),
      y: Math.round(selectedNode.y()),
    });
  };

  selectedNode.on('dragend', onDragEnd);
  return () => { selectedNode.off('dragend', onDragEnd); };
}, [selectedId, selectedElement, updateElement]);

// ── handleTransformEnd consolidé ──────────────────────────────────────────────
const handleTransformEnd = () => {
  if (!selectedElement || !transformerRef.current) return;
  const node = transformerRef.current.nodes()[0];
  if (!node) return;

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  // Pour tous les nœuds wrappés dans Group (circle, lineShapes, bezier...)
  // node.getAttr('width/height') est fiable car on le set explicitement
  // Pour Rect et autres shapes directes, node.width()/height() suffit
 
  const rawW = node.getAttr('width')
  ?? node.width()
  ?? selectedElement.width;

const rawH = node.getAttr('height')
  ?? node.height()
  ?? selectedElement.height;

  const newWidth  = Math.max(5, rawW * scaleX);
  const newHeight = Math.max(5, rawH * scaleY);

  // Reset scale AVANT updateElement
  node.scaleX(1);
  node.scaleY(1);

  if (selectedElement.type === 'text') {
  const oldFontSize = (selectedElement as any).fontSize || 32;
  const oldWidth    = selectedElement.width;
  const oldHeight   = selectedElement.height;

  // Scale réel appliqué
  const actualScaleX = scaleX;
  const actualScaleY = scaleY;

  const newWidth  = Math.max(20, rawW * actualScaleX);
  const newHeight = Math.max(20, rawH * actualScaleY);

  // ← Ne scale la police QUE si resize vertical pur
  // Si resize horizontal : juste la largeur change (wrap du texte)
  // Si resize vertical   : la police suit pour que le texte remplisse
  const isVerticalResize  = Math.abs(actualScaleY - 1) > 0.01;
  const isHorizontalResize = Math.abs(actualScaleX - 1) > 0.01;

  let newFontSize = oldFontSize;

  if (isVerticalResize && !isHorizontalResize) {
    // Resize vertical pur → scale la police
    newFontSize = Math.max(8, Math.round(oldFontSize * actualScaleY));
  } else if (isVerticalResize && isHorizontalResize) {
    // Resize coin (diagonal) → scale proportionnel
    const avgScale = (actualScaleX + actualScaleY) / 2;
    newFontSize = Math.max(8, Math.round(oldFontSize * avgScale));
  }
  // Resize horizontal pur → police inchangée, juste la largeur change

  node.scaleX(1);
  node.scaleY(1);

  updateElement(selectedElement.id, {
    x:        Math.round(node.x()),
    y:        Math.round(node.y()),
    width:    Math.round(newWidth),
    height:   Math.round(newHeight),
    fontSize: newFontSize,
    rotation: Math.round(node.rotation()),
  } as any);} else {
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
       enabledAnchors={
    isTextSelected
      ? ['top-left','top-right','bottom-left','bottom-right',
         'middle-left','middle-right'] // ← pas de top-center/bottom-center
      : undefined // tous les anchors pour les shapes
  }
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