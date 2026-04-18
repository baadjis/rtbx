// components/builders/_shared/CanvasContext.tsx
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Konva from 'konva';
import { CanvasElement, CanvasTemplate, SelectedElement } from './types';

type CanvasContextType = {
  stageRef: React.RefObject<Konva.Stage|null>;
  elements: CanvasElement[];
  selectedId: string | null;
  canvasWidth: number;
  canvasHeight: number;

  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
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
  };

  const selectElement = (id: string | null) => {
    setSelectedId(id);
  };

  const loadTemplate = (template: CanvasTemplate) => {
    setElements(template.elements);
    setSelectedId(null);
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
      canvasWidth: width,
      canvasHeight: height,
      setElements,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      loadTemplate,
      exportToPNG,
    }}>
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};