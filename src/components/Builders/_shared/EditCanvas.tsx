// components/builders/_shared/EditCanvas.tsx
'use client';

import { Stage, Layer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import RenderElement from './RenderElement';
import Transformer from './Transformer';
import TextEditorOverlay from './TextEditorOverlay';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Line, Circle } from 'react-konva';

type Props = {
  designWidth: number;
  designHeight: number;
};


function BezierPreview({ points }: { points: { x: number; y: number }[] }) {
  const flatPoints = points.flatMap((p) => [p.x, p.y]);
  return (
    <>
      {/* Ligne preview */}
      {points.length >= 2 && (
        <Line
          points={flatPoints}
          stroke="#7c3aed"
          strokeWidth={2}
          dash={[6, 4]}
          tension={0.4}
          opacity={0.7}
          listening={false}
        />
      )}
      {/* Points posés */}
      {points.map((p, i) => (
        <Circle
          key={i}
          x={p.x} y={p.y}
          radius={5}
          fill={i === 0 ? '#7c3aed' : '#ffffff'}
          stroke="#7c3aed"
          strokeWidth={2}
          listening={false}
        />
      ))}
    </>
  );
}

export default function EditCanvas({ designWidth, designHeight }: Props) {

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);


  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });



// Par :
const { stageRef, elements, selectElement, zoom , bezierDrawing, bezierPoints, addBezierPoint, finishBezierDraw, cancelBezierDraw,
  editingBezierPath,} = useCanvas();
const [baseScale, setBaseScale] = useState(1);
const scale = baseScale * zoom;

  // ── Recalcule le scale dès que le conteneur change de taille ──────────────
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 48;
    const w = containerRef.current.clientWidth - padding;
    const h = containerRef.current.clientHeight - padding;
    let newScale = Math.min(w / designWidth, h / designHeight, 2.5);
    // Sur mobile on garde un minimum lisible
    if (window.innerWidth < 768) newScale = Math.max(newScale, 0.35);
    setBaseScale(newScale);
    setContainerSize({
      width:  Math.round(designWidth  * newScale),
      height: Math.round(designHeight * newScale),
    });
  }, [designWidth, designHeight]);

  useEffect(() => {
    const timeout = setTimeout(calculateScale, 0);
    const observer = new ResizeObserver(() => setTimeout(calculateScale, 16));
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('orientationchange', calculateScale);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, [calculateScale]);

  const wrapW = containerSize.width  || designWidth;
  const wrapH = containerSize.height || designHeight;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full min-h-0 p-4 relative"
    >
      {/* ── Canvas sheet ── */}
      <div
        ref={canvasWrapRef}
        className="relative bg-white"
        style={{
          width:  wrapW,
          height: wrapH,
          // Ombre et coins doux cohérents avec le nouveau design
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          // Contour subtil
          outline: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Stage
  ref={stageRef}
  width={designWidth}
  height={designHeight}
  scaleX={scale}
  scaleY={scale}
  // ← cursor change en mode dessin
  style={{ cursor: bezierDrawing ? 'crosshair' : 'default' }}
  onClick={(e) => {
    if (bezierDrawing) {
      const stage = e.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      // Convertit les coords screen → canvas
      const x = pos.x / scale;
      const y = pos.y / scale;
      // Double-clic = terminer (géré dans onDblClick)
      addBezierPoint(x, y);
      return;
    }
    if (e.target === e.target.getStage()) selectElement(null);
  }}
  onDblClick={(e) => {
    if (bezierDrawing) {
      finishBezierDraw();
      return;
    }
  }}
  onContextMenu={(e) => {
    // Clic droit = annuler le dessin
    e.evt.preventDefault();
    if (bezierDrawing) cancelBezierDraw();
  }}
>
  <Layer>
    {elements.map((el) => (
      <RenderElement key={el.id} element={el} onSelect={selectElement} />
    ))}

    {/* Preview en cours de dessin */}
    {bezierDrawing && bezierPoints.length > 0 && (
      <BezierPreview points={bezierPoints} />
    )}

    <Transformer />
  </Layer>
</Stage>

        {/* ── TextEditorOverlay : positionné DANS le wrapper pour hériter du scale ── */}
        <TextEditorOverlay scale={scale} />
      </div>
    </div>
  );
}