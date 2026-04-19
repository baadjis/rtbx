// components/builders/_shared/CanvasContext.tsx
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Konva from 'konva';
import { CanvasElement, CanvasTemplate } from './types';

type CanvasContextType = {
  stageRef: React.RefObject<Konva.Stage|null>;
  elements: CanvasElement[];
  selectedId: string | null;
  editingTextId: string | null;        // ← nouveau
  canvasWidth: number;
  canvasHeight: number;

  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  startEditingText: (id: string) => void;     // ← nouveau
  finishEditingText: (newText: string) => void; // ← nouveau
  loadTemplate: (template: CanvasTemplate) => void;
  exportToPNG: () => Promise<string>;
};

const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({ 
  children, 
  width, 
  height 
}: { 
  children: ReactNode; 
  width: number; 
  height: number;
}) {
  const stageRef = useRef<Konva.Stage>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const addElement = (element: CanvasElement) => {
    setElements(prev => [...prev, element]);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } as CanvasElement : el)
    );
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingTextId === id) setEditingTextId(null);
  };

  const selectElement = (id: string | null) => {
    setSelectedId(id);
    setEditingTextId(null); // Arrête l'édition si on change de sélection
  };

  const startEditingText = (id: string) => {
    setSelectedId(id);
    setEditingTextId(id);
  };

  const finishEditingText = (newText: string) => {
    if (editingTextId && newText.trim() !== '') {
      updateElement(editingTextId, { text: newText.trim() });
    }
    setEditingTextId(null);
  };

  const loadTemplate = (template: CanvasTemplate) => {
    setElements(template.elements);
    setSelectedId(null);
    setEditingTextId(null);
  };

  const exportToPNG = async (): Promise<string> => {
    if (!stageRef.current) return '';
    return stageRef.current.toDataURL({ pixelRatio: 2 });
  };

  return (
    <CanvasContext.Provider value={{
      stageRef,
      elements,
      selectedId,
      editingTextId,
      canvasWidth: width,
      canvasHeight: height,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      startEditingText,
      finishEditingText,
      loadTemplate,
      exportToPNG,
    }}>
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error('useCanvas must be used within CanvasProvider');
  return context;
};