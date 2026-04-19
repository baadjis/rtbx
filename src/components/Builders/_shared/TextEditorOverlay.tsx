/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/TextEditorOverlay.tsx
'use client';

import { useCanvas } from './CanvasContext';
import { useState, useRef, useEffect } from 'react';

export default function TextEditorOverlay() {
  const { editingTextId, elements, finishEditingText } = useCanvas();

  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const editingElement = elements.find((el) => el.id === editingTextId) as any;

  // 1. Initialisation de la valeur avec setTimeout (comme dans ton exemple)
  useEffect(() => {
    if (editingTextId && editingElement) {
      const timeout = setTimeout(() => {
        setValue(editingElement.text || '');
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [editingTextId]);

  // 2. Focus automatique
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

  const handleBlur = () => {
    finishEditingText(value);
  };

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
      className="absolute bg-white dark:bg-gray-900 border-2 border-blue-600 rounded-2xl px-5 py-4 shadow-2xl focus:outline-none resize-none z-50"
      style={{
        left: `${editingElement.x}px`,
        top: `${editingElement.y}px`,
        width: `${editingElement.width}px`,
        minHeight: `${Math.max(editingElement.height, 80)}px`,
        fontSize: `${editingElement.fontSize}px`,
        color: editingElement.style.fill || '#000000',
        fontFamily: editingElement.fontFamily || 'Arial',
        textAlign: editingElement.align || 'left',
        lineHeight: 1.3,
      }}
    />
  );
}