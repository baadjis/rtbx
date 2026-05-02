/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCanvas } from './CanvasContext';
import { useState, useRef, useEffect } from 'react';

type Props = { scale?: number };

export default function TextEditorOverlay({ scale = 1 }: Props) {
  const { editingTextId, elements, finishEditingText } = useCanvas();
  const [value, setValue]   = useState('');
  const valueRef            = useRef('');
  const inputRef            = useRef<HTMLTextAreaElement>(null);
  const editingElement      = elements.find((el) => el.id === editingTextId) as any;

  // Init valeur
  useEffect(() => {
    if (!editingTextId || !editingElement) return;
    const t = setTimeout(() => {
      setValue(editingElement.text || '');
      valueRef.current = editingElement.text || '';
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 30);
    return () => clearTimeout(t);
  }, [editingTextId]);

  // ← Écoute clics extérieurs sur le document entier
  useEffect(() => {
    if (!editingTextId) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (inputRef.current && inputRef.current.contains(e.target as Node)) return;
      // Clic en dehors de la textarea → sauvegarde
      finishEditingText(valueRef.current);
    };

    // Délai pour éviter que le clic d'ouverture ferme immédiatement
    const t = setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown);
    }, 100);

    return () => {
      clearTimeout(t);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [editingTextId, finishEditingText]);

  if (!editingTextId || !editingElement) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    valueRef.current = e.target.value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditingText(valueRef.current);
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
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      // ← Plus de onBlur — géré par pointerdown sur document
      className="absolute focus:outline-none resize-none z-50"
      style={{
        left:         `${editingElement.x * scale}px`,
        top:          `${editingElement.y * scale}px`,
        width:        `${editingElement.width * scale}px`,
        minHeight:    `${Math.max(editingElement.height, 80) * scale}px`,
        fontSize:     `${(editingElement.fontSize || 32) * scale}px`,
        fontFamily:   editingElement.fontFamily || 'Sora, sans-serif',
        fontWeight:   editingElement.fontStyle === 'bold'   ? 700 : 400,
        fontStyle:    editingElement.fontStyle === 'italic' ? 'italic' : 'normal',
        textAlign:    editingElement.align || 'left',
        color:        editingElement.style?.fill || '#000000',
        lineHeight:   editingElement.lineHeight  ?? 1.3,
        letterSpacing: editingElement.letterSpacing
          ? `${editingElement.letterSpacing * scale}px`
          : 'normal',
        background:   'rgba(255,255,255,0.97)',
        border:       '2px solid #7c3aed',
        borderRadius: '8px',
        padding:      `${6 * scale}px ${8 * scale}px`,
        boxShadow:    '0 0 0 4px rgba(124,58,237,0.15)',
      }}
    />
  );
}