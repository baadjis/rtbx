// components/builders/_shared/CanvasContext.tsx
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Konva from 'konva';
import { CanvasElement, CanvasTemplate } from './types';

type CanvasContextType = {
  stageRef: React.RefObject<Konva.Stage|null>;
  elements: CanvasElement[];
  selectedId: string | null;
  editingTextId: string | null;
  canUndo: boolean;
  canRedo: boolean;

  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  startEditingText: (id: string) => void;
  finishEditingText: (newText: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;        // ← maintenant implémenté
  undo: () => void;
  redo: () => void;
  loadTemplate: (template: CanvasTemplate) => void;
  exportToPNG: () => Promise<string>;
};

const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({ children, width, height }: { children: ReactNode; width: number; height: number }) {
  const stageRef = useRef<Konva.Stage| null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const saveToHistory = (newElements: CanvasElement[]) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyStep + 1);
      sliced.push([...newElements]);
      return sliced;
    });
    setHistoryStep(prev => prev + 1);
  };

  const addElement = (element: CanvasElement) => {
    const newElements = [...elements, { ...element, zIndex: elements.length }];
    setElements(newElements);
    saveToHistory(newElements);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } as CanvasElement : el);
    setElements(newElements);
    saveToHistory(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    saveToHistory(newElements);
    if (selectedId === id) setSelectedId(null);
  };

  const selectElement = (id: string | null) => {
    setSelectedId(id);
    setEditingTextId(null);
  };

  const startEditingText = (id: string) => {
    setSelectedId(id);
    setEditingTextId(id);
  };

  const finishEditingText = (newText: string) => {
    if (editingTextId) updateElement(editingTextId, { text: newText });
    setEditingTextId(null);
  };

  const bringToFront = (id: string) => {
    const newElements = [...elements];
    const index = newElements.findIndex(el => el.id === id);
    if (index > -1) {
      const [item] = newElements.splice(index, 1);
      newElements.push(item);
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  const sendToBack = (id: string) => {
    const newElements = [...elements];
    const index = newElements.findIndex(el => el.id === id);
    if (index > -1) {
      const [item] = newElements.splice(index, 1);
      newElements.unshift(item);
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const prev = historyStep - 1;
    setElements(history[prev]);
    setHistoryStep(prev);
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const next = historyStep + 1;
    setElements(history[next]);
    setHistoryStep(next);
  };

  const loadTemplate = (template: CanvasTemplate) => {
    setElements(template.elements);
    setHistory([template.elements]);
    setHistoryStep(0);
    setSelectedId(null);
    setEditingTextId(null);
  };

  const exportToPNG = async () => {
    if (!stageRef.current) return '';
    return stageRef.current.toDataURL({ pixelRatio: 2 });
  };

  return (
    <CanvasContext.Provider value={{
      stageRef,
      elements,
      selectedId,
      editingTextId,
      canUndo: historyStep > 0,
      canRedo: historyStep < history.length - 1,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      startEditingText,
      finishEditingText,
      bringToFront,
      sendToBack,           // ← maintenant présent
      undo,
      redo,
      loadTemplate,
      exportToPNG,
    }}>
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error('useCanvas must be used within CanvasProvider');
  return ctx;
};