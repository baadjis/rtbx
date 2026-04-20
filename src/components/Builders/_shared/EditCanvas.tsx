// components/builders/_shared/EditCanvas.tsx
'use client';

import { Stage, Layer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import RenderElement from './RenderElement';
import Transformer from './Transformer';
import { useState, useEffect, useRef, useCallback } from 'react';

type Props = {
  designWidth: number;
  designHeight: number;
};

export default function EditCanvas({ designWidth, designHeight }: Props) {
  const { stageRef, elements, selectElement } = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 40;
    const w = containerRef.current.clientWidth - padding;
    const h = containerRef.current.clientHeight - padding;

    let newScale = Math.min(w / designWidth, h / designHeight, 2.5);
    if (window.innerWidth < 768) newScale = Math.max(newScale, 0.75);

    setScale(newScale);
    setContainerSize({
      width: Math.round(designWidth * newScale),
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

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full min-h-0 p-4 relative">
      <div
        className="relative shadow-2xl border border-gray-300 dark:border-gray-700 rounded-3xl overflow-hidden bg-white"
        style={{
          width: containerSize.width || designWidth,
          height: containerSize.height || designHeight,
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
      </div>
    </div>
  );
}