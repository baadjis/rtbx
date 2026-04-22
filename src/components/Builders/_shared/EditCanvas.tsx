// components/builders/_shared/EditCanvas.tsx
'use client';

import { Stage, Layer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import RenderElement from './RenderElement';
import Transformer from './Transformer';
import TextEditorOverlay from './TextEditorOverlay';
import { useState, useEffect, useRef, useCallback } from 'react';

type Props = {
  designWidth: number;
  designHeight: number;
};

export default function EditCanvas({ designWidth, designHeight }: Props) {

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);


  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });



// Par :
const { stageRef, elements, selectElement, zoom } = useCanvas();
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
          onClick={(e) => {
            if (e.target === e.target.getStage()) selectElement(null);
          }}
          onTap={(e) => {
            if (e.target === e.target.getStage()) selectElement(null);
          }}
        >
          <Layer>
            {elements.map((el) => (
              <RenderElement key={el.id} element={el} onSelect={selectElement} />
            ))}
            <Transformer />
          </Layer>
        </Stage>

        {/* ── TextEditorOverlay : positionné DANS le wrapper pour hériter du scale ── */}
        <TextEditorOverlay scale={scale} />
      </div>
    </div>
  );
}