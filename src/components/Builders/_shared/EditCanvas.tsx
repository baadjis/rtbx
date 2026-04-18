// components/builders/_shared/EditCanvas.tsx
'use client';

import { Stage, Layer } from 'react-konva';
import { useCanvas } from './CanvasContext';
import RenderElement from './RenderElement';
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

  // Fonction de calcul du scale (mémorisée)
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;

    const padding = 40;
    const availableWidth = containerRef.current.clientWidth - padding;
    const availableHeight = containerRef.current.clientHeight - padding;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const scaleX = availableWidth / designWidth;
    const scaleY = availableHeight / designHeight;

    let newScale = Math.min(scaleX, scaleY, 2.5);

    // Sur mobile on évite un scale trop petit
    if (window.innerWidth < 768) {
      newScale = Math.max(newScale, 0.75);
    }

    setScale(newScale);
    setContainerSize({
      width: Math.round(designWidth * newScale),
      height: Math.round(designHeight * newScale),
    });
  }, [designWidth, designHeight]);

  // Effet pour le calcul initial + redimensionnement
  useEffect(() => {
    // Calcul initial après le premier rendu
    const timeout = setTimeout(calculateScale, 0);

    const resizeObserver = new ResizeObserver(() => {
      // Petit délai pour regrouper les appels
      const timeoutId = setTimeout(calculateScale, 16);
      return () => clearTimeout(timeoutId);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('orientationchange', calculateScale);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, [calculateScale]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center w-full h-full min-h-0 p-4"
    >
      <div
        className="relative shadow-2xl border border-gray-300 dark:border-gray-700 rounded-3xl overflow-hidden bg-white"
        style={{
          width: containerSize.width || designWidth,
          height: containerSize.height || designHeight,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {/* Grille de fond légère */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(#e5e7eb 1px, transparent 1px),
              linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <Stage
          ref={stageRef}
          width={designWidth}
          height={designHeight}
          scaleX={scale}
          scaleY={scale}
          style={{ display: 'block' }}
          onClick={(e) => {
            if (e.target === e.target.getStage()) selectElement(null);
          }}
          onTap={(e) => {
            if (e.target === e.target.getStage()) selectElement(null);
          }}
        >
          <Layer>
            {elements.map((element) => (
              <RenderElement
                key={element.id}
                element={element}
                onSelect={selectElement}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}