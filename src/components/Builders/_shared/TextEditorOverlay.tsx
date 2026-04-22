/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/TextEditorOverlay.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { useState, useRef, useEffect } from 'react';

type Props = { scale?: number };

export default function TextEditorOverlay({ scale = 1 }: Props) {
  const { editingTextId, elements, finishEditingText } = useCanvas();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editingElement = elements.find((el) => el.id === editingTextId) as any;

  // Initialise la valeur
  useEffect(() => {
    if (editingTextId && editingElement) {
      const timeout = setTimeout(() => setValue(editingElement.text || ''), 0);
      return () => clearTimeout(timeout);
    }
  }, [editingTextId]);

  // Focus automatique
  useEffect(() => {
    if (editingTextId && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [editingTextId]);

  if (!editingTextId || !editingElement) return null;

  const handleBlur = () => finishEditingText(value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditingText(value);
    }
    if (e.key === 'Escape') {
      finishEditingText(editingElement.text || '');
    }
  };

  return (
    <textarea
      key={editingTextId}
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="absolute focus:outline-none resize-none z-50"
      style={{
        // Position scalée pour coller exactement sur l'élément Konva
        left:      `${editingElement.x * scale}px`,
        top:       `${editingElement.y * scale}px`,
        width:     `${editingElement.width * scale}px`,
        minHeight: `${Math.max(editingElement.height, 80) * scale}px`,

        fontSize:   `${(editingElement.fontSize || 32) * scale}px`,
        fontFamily: editingElement.fontFamily || 'Sora, sans-serif',
        fontWeight: editingElement.fontStyle === 'bold' ? 700 : 400,
        fontStyle:  editingElement.fontStyle === 'italic' ? 'italic' : 'normal',
        textAlign:  editingElement.align || 'left',
        color:      editingElement.style?.fill || '#000000',
        lineHeight: editingElement.lineHeight ?? 1.3,
        letterSpacing: editingElement.letterSpacing
          ? `${editingElement.letterSpacing * scale}px`
          : 'normal',

        // Style cohérent avec le nouveau design
        background:   'rgba(255,255,255,0.97)',
        border:       '2px solid #7c3aed',
        borderRadius: '8px',
        padding:      `${6 * scale}px ${8 * scale}px`,
        boxShadow:    '0 0 0 4px rgba(124,58,237,0.15)',
      }}
    />
  );
}