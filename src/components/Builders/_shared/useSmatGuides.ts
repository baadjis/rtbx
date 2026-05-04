// components/builders/_shared/useSmartGuides.ts
import { CanvasElement, Guide } from './types';

const SNAP_THRESHOLD = 6; // pixels — distance de déclenchement du snap

interface Snap {
  guides: Guide[];
  x:      number;
  y:      number;
}

// Retourne les edges et centres d'un élément
function getElementEdges(el: CanvasElement) {
  return {
    left:   el.x,
    right:  el.x + el.width,
    top:    el.y,
    bottom: el.y + el.height,
    centerX: el.x + el.width  / 2,
    centerY: el.y + el.height / 2,
  };
}

export function computeSmartGuides(
  dragging:    CanvasElement,
  others:      CanvasElement[],
  canvasW:     number,
  canvasH:     number,
): Snap {
  const guides: Guide[] = [];
  let   snapX = dragging.x;
  let   snapY = dragging.y;
  let   minDX = SNAP_THRESHOLD + 1;
  let   minDY = SNAP_THRESHOLD + 1;

  const drag = getElementEdges(dragging);

  // ── Lignes de référence : autres éléments + canvas ───────────────────────
  const refLines = {
    vertical:   [] as { pos: number; snap: 'center' | 'edge' }[],
    horizontal: [] as { pos: number; snap: 'center' | 'edge' }[],
  };

  // Canvas edges + center
  refLines.vertical.push(
    { pos: 0,           snap: 'edge'   },
    { pos: canvasW,     snap: 'edge'   },
    { pos: canvasW / 2, snap: 'center' },
  );
  refLines.horizontal.push(
    { pos: 0,           snap: 'edge'   },
    { pos: canvasH,     snap: 'edge'   },
    { pos: canvasH / 2, snap: 'center' },
  );

  // Autres éléments
  others.forEach((el) => {
    const e = getElementEdges(el);
    refLines.vertical.push(
      { pos: e.left,    snap: 'edge'   },
      { pos: e.right,   snap: 'edge'   },
      { pos: e.centerX, snap: 'center' },
    );
    refLines.horizontal.push(
      { pos: e.top,     snap: 'edge'   },
      { pos: e.bottom,  snap: 'edge'   },
      { pos: e.centerY, snap: 'center' },
    );
  });

  // ── Snap vertical (X) ─────────────────────────────────────────────────────
  const dragXPoints = [
    { val: drag.left,    offset: 0              },
    { val: drag.right,   offset: -dragging.width },
    { val: drag.centerX, offset: -dragging.width / 2 },
  ];

  refLines.vertical.forEach(({ pos, snap }) => {
    dragXPoints.forEach(({ val, offset }) => {
      const d = Math.abs(val - pos);
      if (d < SNAP_THRESHOLD && d < minDX) {
        minDX  = d;
        snapX  = pos + offset;
        guides.push({ orientation: 'vertical', position: pos, snap });
      }
    });
  });

  // ── Snap horizontal (Y) ───────────────────────────────────────────────────
  const dragYPoints = [
    { val: drag.top,     offset: 0               },
    { val: drag.bottom,  offset: -dragging.height },
    { val: drag.centerY, offset: -dragging.height / 2 },
  ];

  refLines.horizontal.forEach(({ pos, snap }) => {
    dragYPoints.forEach(({ val, offset }) => {
      const d = Math.abs(val - pos);
      if (d < SNAP_THRESHOLD && d < minDY) {
        minDY  = d;
        snapY  = pos + offset;
        guides.push({ orientation: 'horizontal', position: pos, snap });
      }
    });
  });

  return { guides, x: snapX, y: snapY };
}