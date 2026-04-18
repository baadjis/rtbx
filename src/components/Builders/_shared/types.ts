// components/builders/_shared/types.ts

export type ElementType = 
  | 'container' 
  | 'group' 
  | 'text' 
  | 'image' 
  | 'rectangle' 
  | 'circle' 
  | 'line';

export interface StyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  padding?: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  visible?: boolean;
  zIndex?: number;
  style: StyleProps;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'bold' | 'italic';
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  imageFit?: 'fill' | 'contain' | 'cover';
}

export interface ContainerElement extends BaseElement {
  type: 'container';
  children: CanvasElement[];
  clip?: boolean;
}

export interface GroupElement extends BaseElement {
  type: 'group';
  children: CanvasElement[];
}

export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'circle' | 'line';
}

export type CanvasElement = 
  | TextElement 
  | ImageElement 
  | ContainerElement 
  | GroupElement 
  | ShapeElement;

// ← AJOUT IMPORTANT
export interface SelectedElement {
  id: string;
  element: CanvasElement;
  parentId?: string;
}

export interface CanvasTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor?: string;
  elements: CanvasElement[];
}