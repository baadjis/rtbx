// components/builders/_shared/types.ts

// ─── Element types ────────────────────────────────────────────────────────────
export type ElementType =
  | 'container'
  | 'group'
  | 'text'
  | 'image'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'triangle'   // ← prêt pour la suite
  | 'arrow';     // ← prêt pour la suite

// ─── Style ───────────────────────────────────────────────────────────────────
export interface StyleProps {
  // Fill
  fill?:              string;
  // Gradient
  gradientEnabled?:   boolean;
  gradientColor1?:    string;
  gradientColor2?:    string;
  gradientDirection?: number; // degrés : 0 | 45 | 90 | 135 | 180 …
  // Stroke
  stroke?:            string;
  strokeWidth?:       number;
  strokeDash?:        number[]; // ex: [6, 4] pour pointillés
  // Shape
  borderRadius?:      number;
  // Visibility
  opacity?:           number;
  // Shadow
  shadowColor?:       string;
  shadowBlur?:        number;
  shadowOffsetX?:     number;
  shadowOffsetY?:     number;
  // Spacing
  padding?:           number;
}

// ─── Base ─────────────────────────────────────────────────────────────────────
export interface BaseElement {
  id:        string;
  type:      ElementType;
  x:         number;
  y:         number;
  width:     number;
  height:    number;
  rotation?: number;
  visible?:  boolean;
  locked?:   boolean;   // ← nouveau : empêche drag/transform
  name?:     string;    // ← nouveau : label dans le panel Calques
  zIndex?:   number;
  style:     StyleProps;
}

// ─── Text ─────────────────────────────────────────────────────────────────────
export interface TextElement extends BaseElement {
  type:            'text';
  text:            string;
  fontSize:        number;
  fontFamily?:     string;
  fontStyle?:      'normal' | 'bold' | 'italic';
  fontWeight?:     number;          // ← nouveau : 100–900
  textDecoration?: 'none' | 'underline' | 'line-through'; // ← nouveau
  align?:          'left' | 'center' | 'right';
  verticalAlign?:  'top' | 'middle' | 'bottom';
  lineHeight?:     number;
  letterSpacing?:  number;
}

// ─── Image ───────────────────────────────────────────────────────────────────
export interface ImageElement extends BaseElement {
  type:       'image';
  src:        string;
  imageFit?:  'fill' | 'contain' | 'cover';
  alt?:       string; // ← nouveau : accessibilité / calque label
}

// ─── Shape (rectangle, circle, line, triangle, arrow…) ───────────────────────
// Une seule interface pour TOUTES les shapes — facile à étendre
export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'circle' | 'line' | 'triangle' | 'arrow';
  // Points custom pour line/arrow/polygon
  points?: number[];
}

// ─── Container / Group ───────────────────────────────────────────────────────
export interface ContainerElement extends BaseElement {
  type:      'container';
  children:  CanvasElement[];
  clip?:     boolean;
}

export interface GroupElement extends BaseElement {
  type:     'group';
  children: CanvasElement[];
}

// ─── Union ───────────────────────────────────────────────────────────────────
export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | ContainerElement
  | GroupElement;

// ─── Template ────────────────────────────────────────────────────────────────
export interface CanvasTemplate {
  id:               string;
  name:             string;
  width:            number;
  height:           number;
  backgroundColor?: string;
  thumbnail?:       string; // ← nouveau : URL preview
  category?:        string; // ← nouveau : 'social' | 'flyer' | 'ad' …
  elements:         CanvasElement[];
}

// ─── Editor state helpers ─────────────────────────────────────────────────────
export interface SelectedElement {
  id:        string;
  element:   CanvasElement;
  parentId?: string;
}

export interface TextEditingState {
  id:       string;
  text:     string;
  x:        number;
  y:        number;
  width:    number;
  height:   number;
  fontSize: number;
}