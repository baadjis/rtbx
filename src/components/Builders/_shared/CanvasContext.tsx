/* eslint-disable @typescript-eslint/no-explicit-any */
// components/builders/_shared/CanvasContext.tsx
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import { BezierElement, CanvasElement, CanvasTemplate, DrawTool, GroupElement } from './types';

type CanvasContextType = {
  stageRef: React.RefObject<Konva.Stage|null>;
  elements: CanvasElement[];
  selectedId: string | null;
  editingTextId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  canvasWidth:  number;
  canvasHeight: number;

  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  startEditingText: (id: string) => void;
  finishEditingText: (newText: string) => void;
  toggleLock: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;        // ← maintenant implémenté
  undo: () => void;
  redo: () => void;
  loadTemplate: (template: CanvasTemplate) => void;
  exportToPNG: () => Promise<string>;
  
zoomIn: () => void;
zoomOut: () => void;
resetZoom: () => void;

bezierDrawing:     boolean;
bezierPoints:      { x: number; y: number }[];
startBezierDraw:   () => void;
addBezierPoint:    (x: number, y: number) => void;
finishBezierDraw:  () => void;
cancelBezierDraw:  () => void;
// Mode édition points
editingBezierPath: boolean;  // ← double-clic sur bezier = édition points
startEditingBezier:(id: string) => void;
finishEditingBezier:() => void;

drawTool:        DrawTool | null;
drawColor:       string;
drawSize:        number;
setDrawTool:     (tool: DrawTool | null) => void;
setDrawColor:    (color: string) => void;
setDrawSize:     (size: number) => void;
groupElements:   (ids: string[]) => void;
ungroupElements: (groupId: string) => void;
};

const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({ children, width, height }: { children: ReactNode; width: number; height: number }) {
  const stageRef = useRef<Konva.Stage| null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [drawTool,  setDrawTool]  = useState<DrawTool | null>(null);
  const [drawColor, setDrawColor] = useState('#7c3aed');
  const [drawSize,  setDrawSize]  = useState(4);

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [bezierDrawing,      setBezierDrawing]      = useState(false);
  const [bezierPoints,       setBezierPoints]        = useState<{ x: number; y: number }[]>([]);
  const [editingBezierPath,  setEditingBezierPath]   = useState(false);
  const zoomIn    = () => setZoom((z) => Math.min(z + 0.1, 3));
  const zoomOut   = () => setZoom((z) => Math.max(z - 0.1, 0.2));
  const resetZoom = () => setZoom(1);

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
  // ← Si on édite un texte, sauvegarde avant de changer de sélection
  if (editingTextId) {
    setEditingTextId(null);
  }
  setSelectedId(id);
};

  const groupElements = (ids: string[]) => {
  if (ids.length < 2) return;
  const toGroup = elements.filter((el) => ids.includes(el.id));
  if (toGroup.length < 2) return;

  // Calcule le bounding box du groupe
  const minX = Math.min(...toGroup.map((el) => el.x));
  const minY = Math.min(...toGroup.map((el) => el.y));
  const maxX = Math.max(...toGroup.map((el) => el.x + el.width));
  const maxY = Math.max(...toGroup.map((el) => el.y + el.height));

  const newGroup: GroupElement = {
    id:       uuidv4(),
    type:     'group',
    x:        minX,
    y:        minY,
    width:    maxX - minX,
    height:   maxY - minY,
    rotation: 0,
    // Positions des enfants relatives au groupe
    children: toGroup.map((el) => ({
      ...el,
      x: el.x - minX,
      y: el.y - minY,
    })),
    style: {},
  };

  // Remplace les éléments groupés par le groupe
  const newElements = [
    ...elements.filter((el) => !ids.includes(el.id)),
    newGroup,
  ];
  setElements(newElements);
  saveToHistory(newElements);
  setSelectedId(newGroup.id);
};

const ungroupElements = (groupId: string) => {
  const group = elements.find((el) => el.id === groupId);
  if (!group || group.type !== 'group') return;
  const grp = group as GroupElement;

  // Remet les enfants à leurs positions absolues
  const children = grp.children.map((child) => ({
    ...child,
    id: uuidv4(), // nouvel id pour éviter conflits
    x:  child.x + grp.x,
    y:  child.y + grp.y,
  }));

  const newElements = [
    ...elements.filter((el) => el.id !== groupId),
    ...children,
  ];
  setElements(newElements);
  saveToHistory(newElements);
  setSelectedId(null);
};

  const startEditingText = (id: string) => {
    setSelectedId(id);
    setEditingTextId(id);
  };

const finishEditingText = (newText: string) => {
  if (!editingTextId) { setEditingTextId(null); return; }
  // ← updateElement avec SEULEMENT text et height
  // pas de width/fontSize qui pourraient être écrasés par le transformer
  const el = elements.find((e) => e.id === editingTextId) as any;
  if (!el) { setEditingTextId(null); return; }

  const lines     = newText.split('\n').length;
  const newHeight = Math.max(
    el.height,
    Math.round(lines * (el.fontSize ?? 32) * (el.lineHeight ?? 1.3) + 16),
  );

  updateElement(editingTextId, {
    text:   newText,
    height: newHeight,
  } as any);

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

  const startBezierDraw = () => {
  setBezierDrawing(true);
  setBezierPoints([]);
  setSelectedId(null);
};

const addBezierPoint = (x: number, y: number) => {
  setBezierPoints((prev) => [...prev, { x, y }]);
};

const finishBezierDraw = () => {
  if (bezierPoints.length < 2) {
    cancelBezierDraw();
    return;
  }
  // Calcule le bounding box pour x/y/width/height
  const xs = bezierPoints.map((p) => p.x);
  const ys = bezierPoints.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const newEl: BezierElement = {
    id:      uuidv4(),
    type:    'bezier',
    x:       minX,
    y:       minY,
    width:   Math.max(maxX - minX, 10),
    height:  Math.max(maxY - minY, 10),
    // Points relatifs au bounding box
    points:  bezierPoints.map((p) => ({ x: p.x - minX, y: p.y - minY })),
    closed:  false,
    tension: 0.4,
    style:   { stroke: '#7c3aed', strokeWidth: 3, fill: 'transparent' },
  };

  addElement(newEl as any);
  setBezierDrawing(false);
  setBezierPoints([]);
};

const cancelBezierDraw = () => {
  setBezierDrawing(false);
  setBezierPoints([]);
};

const startEditingBezier = (id: string) => {
  setSelectedId(id);
  setEditingBezierPath(true);
};

const finishEditingBezier = () => {
  setEditingBezierPath(false);
};

const toggleLock = (id: string) => {
  const el = elements.find((e) => e.id === id);
  if (!el) return;
  const newElements = elements.map((e) =>
    e.id === id ? { ...e, locked: !e.locked } : e
  );
  setElements(newElements);
  saveToHistory(newElements);
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
      sendToBack,    
      toggleLock,       
      undo,
      redo,
      loadTemplate,
      exportToPNG,
      zoom, 
      zoomIn,
      zoomOut,
      resetZoom,
      startBezierDraw,
      startEditingBezier,
      finishBezierDraw,
      finishEditingBezier,
      bezierDrawing,
      bezierPoints,

      editingBezierPath,
      addBezierPoint,
      cancelBezierDraw,
      drawTool, drawColor, drawSize,
     setDrawTool, setDrawColor, setDrawSize,
     groupElements,
     ungroupElements,
     canvasWidth:  width,
     canvasHeight: height,


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