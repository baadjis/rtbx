/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/EditCanvas.tsx
'use client';

import { Stage, Layer, Line } from 'react-konva';
import { useCanvas } from './CanvasContext';
import RenderElement from './RenderElement';
import TransformerComponent from './Transformer';
import TextEditorOverlay from './TextEditorOverlay';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DrawElement } from './types';

// ── Preview en cours de dessin Bézier ────────────────────────────────────────
import { Circle } from 'react-konva';

function BezierPreview({ points }: { points: { x: number; y: number }[] }) {
  const flat = points.flatMap((p) => [p.x, p.y]);
  return (
    <>
      {points.length >= 2 && (
        <Line points={flat} stroke="#7c3aed" strokeWidth={2}
          dash={[6, 4]} tension={0.4} opacity={0.7} listening={false} />
      )}
      {points.map((p, i) => (
        <Circle key={i} x={p.x} y={p.y} radius={5}
          fill={i === 0 ? '#7c3aed' : '#ffffff'}
          stroke="#7c3aed" strokeWidth={2} listening={false} />
      ))}
    </>
  );
}

type Props = { designWidth: number; designHeight: number };

export default function EditCanvas({ designWidth, designHeight }: Props) {
  const {
    stageRef, elements, selectElement,
    bezierDrawing, bezierPoints, addBezierPoint,
    finishBezierDraw, cancelBezierDraw,
    editingBezierPath,
    drawTool, drawColor, drawSize,
    addElement, updateElement,
    zoom,
  } = useCanvas();

  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale]       = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // ── Draw state (local — pas dans le store pendant le dessin) ──────────────
  const isDrawing     = useRef(false);
  const currentLineId = useRef<string | null>(null);
  const [livePoints, setLivePoints] = useState<number[]>([]);

  const scale = baseScale * zoom;

  // ── Scale calculation ─────────────────────────────────────────────────────
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const padding  = 48;
    const w = containerRef.current.clientWidth  - padding;
    const h = containerRef.current.clientHeight - padding;
    let newScale = Math.min(w / designWidth, h / designHeight, 2.5);
    if (window.innerWidth < 768) newScale = Math.max(newScale, 0.35);
    setBaseScale(newScale);
    setContainerSize({
      width:  Math.round(designWidth  * newScale),
      height: Math.round(designHeight * newScale),
    });
  }, [designWidth, designHeight]);

  useEffect(() => {
    const timeout  = setTimeout(calculateScale, 0);
    const observer = new ResizeObserver(() => setTimeout(calculateScale, 16));
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('orientationchange', calculateScale);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, [calculateScale]);

  // ── Cursor selon le mode actif ────────────────────────────────────────────
  const getCursor = () => {
    if (bezierDrawing)        return 'crosshair';
    if (drawTool === 'eraser') return 'cell';
    if (drawTool)              return 'crosshair';
    return 'default';
  };

  // ── Helpers coords ────────────────────────────────────────────────────────
  const getPos = (e: any) => {
    const stage = e.target.getStage();
    const pos   = stage?.getPointerPosition();
    if (!pos) return null;
    return { x: pos.x / scale, y: pos.y / scale };
  };

  // ── Draw handlers ─────────────────────────────────────────────────────────
  const handleDrawStart = (e: any) => {
    if (!drawTool) return;
    const pos = getPos(e);
    if (!pos) return;

    isDrawing.current  = true;
    currentLineId.current = uuidv4();
    setLivePoints([pos.x, pos.y]);
  };

  const handleDrawMove = (e: any) => {
    if (!drawTool || !isDrawing.current) return;
    const pos = getPos(e);
    if (!pos) return;

    if (drawTool === 'eraser') {
      // Efface les éléments draw sous le curseur
      const stage = e.target.getStage();
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;
      const target = stage?.getIntersection(pointer);
      if (target && target.id()) {
        const el = elements.find((el) => el.id === target.id());
        if (el?.type === 'draw') {
          // Soft erase — réduit l'opacité
          updateElement(el.id, {
            style: { ...el.style, opacity: Math.max(0, (el.style.opacity ?? 1) - 0.1) }
          });
        }
      }
      return;
    }

    setLivePoints((prev) => [...prev, pos.x, pos.y]);
  };

  const handleDrawEnd = () => {
    if (!drawTool || !isDrawing.current) return;
    isDrawing.current = false;

    if (drawTool === 'eraser') return;
    if (livePoints.length < 4)  return; // besoin d'au moins 2 points

    const newEl: DrawElement = {
      id:        currentLineId.current ?? uuidv4(),
      type:      'draw',
      x:         0,
      y:         0,
      width:     designWidth,
      height:    designHeight,
      points:    livePoints,
      tool:      drawTool,
      lineWidth: drawSize,
      lineCap:   'round',
      style: {
        stroke:      drawTool === 'brush' ? drawColor + 'bb' : drawColor, // brush = semi-transparent
        strokeWidth: drawTool === 'brush' ? drawSize * 2.5 : drawSize,
        opacity:     drawTool === 'brush' ? 0.7 : 1,
      },
    };

    addElement(newEl as any);
    setLivePoints([]);
    currentLineId.current = null;
  };

  const wrapW = containerSize.width  || designWidth;
  const wrapH = containerSize.height || designHeight;

  return (
    <div ref={containerRef}
      className="flex items-center justify-center w-full h-full min-h-0 p-4 relative">

      <div ref={canvasWrapRef} className="relative bg-white"
        style={{
          width: wrapW, height: wrapH,
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          outline: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Stage
          ref={stageRef}
          width={designWidth}
          height={designHeight}
          scaleX={scale}
          scaleY={scale}
          style={{ cursor: getCursor() }}
          // ── Mouse ──
          onMouseDown={(e) => {
            if (drawTool) { handleDrawStart(e); return; }
            if (bezierDrawing) {
              const pos = getPos(e);
              if (pos) addBezierPoint(pos.x, pos.y);
              return;
            }
            if (e.target === e.target.getStage()) selectElement(null);
          }}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          // ── Touch ──
          onTouchStart={(e) => {
            if (drawTool) { handleDrawStart(e); return; }
          }}
          onTouchMove={handleDrawMove}
          onTouchEnd={handleDrawEnd}
          // ── Bezier ──
          onDblClick={() => { if (bezierDrawing) finishBezierDraw(); }}
          onContextMenu={(e) => {
            e.evt.preventDefault();
            if (bezierDrawing) cancelBezierDraw();
          }}
          onClick={(e) => {
            if (drawTool) return;
            if (bezierDrawing) return;
            if (e.target === e.target.getStage()) selectElement(null);
          }}
        >
          <Layer>
            {elements.map((el) => (
              <RenderElement key={el.id} element={el} onSelect={selectElement} />
            ))}

            {/* Preview Bézier */}
            {bezierDrawing && bezierPoints.length > 0 && (
              <BezierPreview points={bezierPoints} />
            )}

            {/* Trait en cours de dessin (live) */}
            {drawTool && drawTool !== 'eraser' && livePoints.length >= 4 && (
              <Line
                points={livePoints}
                stroke={drawTool === 'brush' ? drawColor + 'bb' : drawColor}
                strokeWidth={drawTool === 'brush' ? drawSize * 2.5 : drawSize}
                tension={drawTool === 'brush' ? 0.4 : 0.2}
                lineCap="round"
                lineJoin="round"
                opacity={drawTool === 'brush' ? 0.7 : 1}
                globalCompositeOperation="source-over"
                listening={false}
              />
            )}

            <TransformerComponent />
          </Layer>
        </Stage>

        <TextEditorOverlay scale={scale} />
      </div>
    </div>
  );
}