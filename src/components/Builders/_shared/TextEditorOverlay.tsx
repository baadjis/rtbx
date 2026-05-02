/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/TextEditorOverlay.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { useState, useRef, useEffect } from 'react';

type Props = { scale?: number };

export default function TextEditorOverlay({ scale = 1 }: { scale?: number }) {
  const { editingTextId, elements, finishEditingText } = useCanvas();
  const [value, setValue] = useState('');
  const valueRef = useRef('');  // ← ref pour valeur toujours à jour
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const editingElement = elements.find((el) => el.id === editingTextId) as any;

  useEffect(() => {
    if (editingTextId && editingElement) {
      const timeout = setTimeout(() => {
        setValue(editingElement.text || '');
        valueRef.current = editingElement.text || ''; // ← sync le ref aussi
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [editingTextId]);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    valueRef.current = e.target.value; // ← met à jour le ref à chaque frappe
  };

  const handleBlur = () => {
    finishEditingText(valueRef.current); // ← utilise le ref, pas le state
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditingText(valueRef.current); // ← ref ici aussi
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
      onChange={handleChange}   // ← handleChange au lieu de setValue inline
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="absolute focus:outline-none resize-none z-50"
      style={{
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
        background:   'rgba(255,255,255,0.97)',
        border:       '2px solid #7c3aed',
        borderRadius: '8px',
        padding:      `${6 * scale}px ${8 * scale}px`,
        boxShadow:    '0 0 0 4px rgba(124,58,237,0.15)',
      }}
    />
  );
}