// components/builders/_shared/RulerLayer.tsx
'use client';

import { useEffect, useRef } from 'react';

const RULER_SIZE = 20; // px — épaisseur des règles

type Props = {
  width:       number;
  height:      number;
  scale:       number;
  offsetX?:    number;
  offsetY?:    number;
  mouseX?:     number;
  mouseY?:     number;
};

export default function RulerLayer({
  width, height, scale,
  offsetX = 0, offsetY = 0,
  mouseX, mouseY,
}: Props) {
  const hRef = useRef<HTMLCanvasElement>(null); // horizontal
  const vRef = useRef<HTMLCanvasElement>(null); // vertical

  const drawRuler = (
    ctx:         CanvasRenderingContext2D,
    length:      number,
    isHorizontal: boolean,
  ) => {
    ctx.clearRect(0, 0, isHorizontal ? length : RULER_SIZE, isHorizontal ? RULER_SIZE : length);

    // Fond
    ctx.fillStyle = '#f8f7ff';
    ctx.fillRect(0, 0, isHorizontal ? length : RULER_SIZE, isHorizontal ? RULER_SIZE : length);

    // Bordure
    ctx.fillStyle = '#e5e7eb';
    if (isHorizontal) {
      ctx.fillRect(0, RULER_SIZE - 1, length, 1);
    } else {
      ctx.fillRect(RULER_SIZE - 1, 0, 1, length);
    }

    // Graduations
    ctx.fillStyle    = '#6b7280';
    ctx.font         = '9px Sora, system-ui';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';

    const step      = 10; // px dans le design
    const minPx     = 4;  // px min sur l'écran pour afficher

    for (let i = 0; i <= (isHorizontal ? width : height) / scale; i += step) {
      const screenPos = i * scale;
      if (screenPos < 0 || screenPos > (isHorizontal ? length : length)) continue;

      const isMajor  = i % 50  === 0;
      const isMedium = i % 25  === 0;
      const tickH    = isMajor ? 12 : isMedium ? 8 : 4;

      ctx.fillStyle = isMajor ? '#4b5563' : '#9ca3af';

      if (isHorizontal) {
        ctx.fillRect(screenPos, RULER_SIZE - tickH, 1, tickH);
        if (isMajor && screenPos > 20) {
          ctx.fillStyle = '#4b5563';
          ctx.fillText(String(i), screenPos, 2);
        }
      } else {
        ctx.fillRect(RULER_SIZE - tickH, screenPos, tickH, 1);
        if (isMajor && screenPos > 20) {
          ctx.save();
          ctx.translate(2, screenPos);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.fillStyle = '#4b5563';
          ctx.fillText(String(i), 0, 0);
          ctx.restore();
        }
      }
    }

    // Indicateur de position souris
    if (mouseX !== undefined || mouseY !== undefined) {
      const pos = isHorizontal ? (mouseX ?? 0) * scale : (mouseY ?? 0) * scale;
      ctx.fillStyle = '#7c3aed';
      if (isHorizontal) {
        ctx.fillRect(pos - 0.5, 0, 1, RULER_SIZE);
      } else {
        ctx.fillRect(0, pos - 0.5, RULER_SIZE, 1);
      }
    }
  };

  useEffect(() => {
    const hCtx = hRef.current?.getContext('2d');
    const vCtx = vRef.current?.getContext('2d');
    if (hCtx) drawRuler(hCtx, width  * scale, true);
    if (vCtx) drawRuler(vCtx, height * scale, false);
  }, [width, height, scale, mouseX, mouseY]);

  return (
    <>
      {/* Coin supérieur gauche */}
      <div
        className="absolute top-0 left-0 z-20 bg-[#f8f7ff] border-r border-b border-gray-200"
        style={{ width: RULER_SIZE, height: RULER_SIZE }}
      />
      {/* Règle horizontale (haut) */}
      <canvas
        ref={hRef}
        width={width * scale}
        height={RULER_SIZE}
        className="absolute top-0 z-20 pointer-events-none"
        style={{ left: RULER_SIZE }}
      />
      {/* Règle verticale (gauche) */}
      <canvas
        ref={vRef}
        width={RULER_SIZE}
        height={height * scale}
        className="absolute left-0 z-20 pointer-events-none"
        style={{ top: RULER_SIZE }}
      />
    </>
  );
}