// components/builders/_shared/GridLayer.tsx
'use client';

import { Line } from 'react-konva';

type Props = {
  width:    number;
  height:   number;
  gridSize: number;
};

export default function GridLayer({ width, height, gridSize }: Props) {
  const lines: React.ReactNode[] = [];

  // Lignes verticales
  for (let x = gridSize; x < width; x += gridSize) {
    const isMajor = x % (gridSize * 5) === 0;
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke={isMajor ? '#c4b5fd' : '#e5e7eb'}
        strokeWidth={isMajor ? 0.8 : 0.5}
        listening={false}
        opacity={isMajor ? 0.6 : 0.4}
      />
    );
  }

  // Lignes horizontales
  for (let y = gridSize; y < height; y += gridSize) {
    const isMajor = y % (gridSize * 5) === 0;
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke={isMajor ? '#c4b5fd' : '#e5e7eb'}
        strokeWidth={isMajor ? 0.8 : 0.5}
        listening={false}
        opacity={isMajor ? 0.6 : 0.4}
      />
    );
  }

  return <>{lines}</>;
}