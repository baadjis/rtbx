/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Transformer as KonvaTransformer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import { useRef, useEffect } from 'react';
import Konva from 'konva';
import { computeSmartGuides } from './useSmatGuides';

export default function Transformer() {
  const { selectedId, elements, updateElement,canvasWidth, canvasHeight,snapEnabled ,setGuides,guides,gridEnabled,gridSize} = useCanvas();
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedElement = elements.find((el) => el.id === selectedId);


  // ── Attache le transformer ────────────────────────────────────────────────
  useEffect(() => {
    if (!transformerRef.current) return;
    const stage = transformerRef.current.getStage();
    if (!stage) return;
    const selectedNode = stage.findOne(`#${selectedId}`);
  if (selectedNode && !selectedElement?.locked) {
  transformerRef.current.nodes([selectedNode]);
  transformerRef.current.getLayer()?.batchDraw();
} else {
  transformerRef.current.nodes([]);
}
  }, [selectedId, elements]);

  // ── DragBound + DragEnd ───────────────────────────────────────────────────
  /*useEffect(() => {
    if (!transformerRef.current) return;
    const stage = transformerRef.current.getStage();
    if (!stage) return;
    const selectedNode = stage.findOne(`#${selectedId}`);
    if (!selectedNode) return;

    /*selectedNode.dragBoundFunc((pos) => {
      if (!selectedElement) return pos;

      const sw = stage.width()  / stage.scaleX();
      const sh = stage.height() / stage.scaleY();

      // ← Bounding box réelle du nœud pour tenir compte des Groups
      const clientRect = selectedNode.getClientRect({ relativeTo: stage });
      const nw = clientRect.width  / stage.scaleX();
      const nh = clientRect.height / stage.scaleY();

      // Offset entre pos (coin sup gauche du nœud) et clientRect
      const offsetX = clientRect.x / stage.scaleX() - selectedNode.x();
      const offsetY = clientRect.y / stage.scaleY() - selectedNode.y();

      return {
        x: Math.max(-offsetX, Math.min(pos.x, sw - nw - offsetX)),
        y: Math.max(-offsetY, Math.min(pos.y, sh - nh - offsetY)),
      };
    });*/

    // dragBoundFunc — simple et direct
/*selectedNode.dragBoundFunc((pos) => {
  if (!selectedElement) return pos;

  const w = selectedElement.width;
  const h = selectedElement.height;

  return {
    x: Math.max(0, Math.min(pos.x, canvasWidth  - w)),
    y: Math.max(0, Math.min(pos.y, canvasHeight - h)),
  };
});

    const onDragEnd = () => {
      if (!selectedElement) return;
      updateElement(selectedElement.id, {
        x: Math.round(selectedNode.x()),
        y: Math.round(selectedNode.y()),
      });
    };

    selectedNode.on('dragend', onDragEnd);
    return () => {
      selectedNode.off('dragend', onDragEnd);
      selectedNode.dragBoundFunc(undefined as any);
    };
  }, [selectedId, selectedElement, updateElement]);*/


  useEffect(() => {
  if (!transformerRef.current) return;
  const stage = transformerRef.current.getStage();
  if (!stage) return;
  const selectedNode = stage.findOne(`#${selectedId}`);
  if (!selectedNode) return;

  const onDragMove = () => {
    if (!selectedElement || !snapEnabled) return;

    const current = {
      ...selectedElement,
      x: selectedNode.x(),
      y: selectedNode.y(),
    };

    const others = elements.filter((el) => el.id !== selectedId);
    const snapToGrid = (val: number, size: number) => Math.round(val / size) * size;

// Dans onDragMove du Transformer :
if (gridEnabled) {
  const gx = snapToGrid(selectedNode.x(), gridSize);
  const gy = snapToGrid(selectedNode.y(), gridSize);
  selectedNode.x(gx);
  selectedNode.y(gy);
}
    const { guides: newGuides, x, y } = computeSmartGuides(
      current, others, canvasWidth, canvasHeight,
    );

    setGuides(newGuides);

    // Applique le snap directement sur le nœud
    if (newGuides.length > 0) {
      selectedNode.x(x);
      selectedNode.y(y);
    }
  };

  const onDragEnd = () => {
    if (!selectedElement) return;
    setGuides([]); // ← cache les guides
    updateElement(selectedElement.id, {
      x: Math.round(selectedNode.x()),
      y: Math.round(selectedNode.y()),
    });
  };

  selectedNode.on('dragmove', onDragMove);
  selectedNode.on('dragend',  onDragEnd);

  return () => {
    selectedNode.off('dragmove', onDragMove);
    selectedNode.off('dragend',  onDragEnd);
  };
}, [selectedId, selectedElement, elements, updateElement, setGuides, snapEnabled, canvasWidth, canvasHeight]);

  // ── handleTransformEnd ────────────────────────────────────────────────────
  const handleTransformEnd = () => {
    if (!selectedElement || !transformerRef.current) return;
    const node = transformerRef.current.nodes()[0];
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // ← Si pas de vrai transform (drag seul), on ignore
    if (Math.abs(scaleX - 1) < 0.001 && Math.abs(scaleY - 1) < 0.001) {
      node.scaleX(1);
      node.scaleY(1);
      return;
    }

    const rawW = node.getAttr('width')  ?? node.width()  ?? selectedElement.width;
    const rawH = node.getAttr('height') ?? node.height() ?? selectedElement.height;

    // Reset scale AVANT updateElement
    node.scaleX(1);
    node.scaleY(1);

   if (selectedElement.type === 'group' || selectedElement.type === 'container') {
  const newWidth  = Math.max(5, rawW * scaleX);
  const newHeight = Math.max(5, rawH * scaleY);
  const grp       = selectedElement as any;

  // Scale les enfants proportionnellement
  const scaledChildren = grp.children.map((child: any) => ({
    ...child,
    x:      child.x      * scaleX,
    y:      child.y      * scaleY,
    width:  child.width  * scaleX,
    height: child.height * scaleY,
    // Scale la police si texte
    ...(child.type === 'text' ? {
      fontSize: Math.max(8, Math.round((child.fontSize || 32) * ((scaleX + scaleY) / 2))),
    } : {}),
  }));

  node.scaleX(1);
  node.scaleY(1);

  updateElement(selectedElement.id, {
    x:        Math.round(node.x()),
    y:        Math.round(node.y()),
    width:    Math.round(newWidth),
    height:   Math.round(newHeight),
    children: scaledChildren,
    rotation: Math.round(node.rotation()),
  } as any);

} else if (selectedElement.type === 'text') {
      const oldFontSize = (selectedElement as any).fontSize || 32;
      const newWidth    = Math.max(20, rawW * scaleX);
      const newHeight   = Math.max(20, rawH * scaleY);

      const isVerticalResize   = Math.abs(scaleY - 1) > 0.01;
      const isHorizontalResize = Math.abs(scaleX - 1) > 0.01;

      let newFontSize = oldFontSize;
      if (isVerticalResize && !isHorizontalResize) {
        newFontSize = Math.max(8, Math.round(oldFontSize * scaleY));
      } else if (isVerticalResize && isHorizontalResize) {
        newFontSize = Math.max(8, Math.round(oldFontSize * (scaleX + scaleY) / 2));
      }

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
      rotateEnabled={true}
      resizeEnabled={true}
      keepRatio={false}
      flipEnabled={false}
      enabledAnchors={undefined}
      /*boundBoxFunc={(oldBox, newBox) => {
        const stage = transformerRef.current?.getStage();
        if (!stage) return newBox;

        const sw = stage.width()  / stage.scaleX();
        const sh = stage.height() / stage.scaleY();

        if (newBox.width < 5 || newBox.height < 5) return oldBox;

        const x = Math.max(0, newBox.x);
        const y = Math.max(0, newBox.y);
        const w = Math.min(newBox.width,  sw - x);
        const h = Math.min(newBox.height, sh - y);

        if (w < 5 || h < 5) return oldBox;

        return { x, y, width: w, height: h, rotation: newBox.rotation };
      }}*/
     // boundBoxFunc — simple et direct
/*boundBoxFunc={(oldBox, newBox) => {
  if (newBox.width < 5 || newBox.height < 5) return oldBox;

  const x = Math.max(0, newBox.x);
  const y = Math.max(0, newBox.y);
  const w = Math.min(newBox.width,  canvasWidth  - x);
  const h = Math.min(newBox.height, canvasHeight - y);

  if (w < 5 || h < 5) return oldBox;

  return { x, y, width: w, height: h, rotation: newBox.rotation };
}}*/
     boundBoxFunc={(oldBox, newBox) => {
  if (newBox.width < 5 || newBox.height < 5) return oldBox;
  return newBox;
}}
      borderStroke="#7c3aed"
      borderStrokeWidth={1.5}
      borderDash={[4, 4] as number[]}
      anchorSize={9}
      anchorFill="#7c3aed"
      anchorStroke="#ffffff"
      anchorStrokeWidth={2}
      anchorCornerRadius={3}
      rotateAnchorOffset={20}
      onTransformEnd={handleTransformEnd}
      onMouseDown={(e) => e.evt.stopImmediatePropagation()}
      onTouchStart={(e) => e.evt.stopImmediatePropagation()}
    />
  );
}