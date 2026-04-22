// components/builders/_shared/types.ts


// ─── Shape type dédié ─────────────────────────────────────────────────────────
export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'triangle'
  | 'arrow'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'diamond'
  | 'cross';

export type ElementType =
  | 'container'
  | 'group'
  | 'text'
  | 'image'
  | ShapeType; // ← plus besoin de lister chaque shape ici




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

// ShapeElement utilise ShapeType
export interface ShapeElement extends BaseElement {
  type: ShapeType;
  points?: number[]; // pour line, arrow, polygon custom
  numPoints?: number; // pour star
  innerRadius?: number; // pour star
  outerRadius?: number; // pour star
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface ImageFilters {
  brightness?: number;   // -1 à 1
  contrast?:   number;   // -1 à 1
  saturation?: number;   // -1 à 1
  hue?:        number;   // 0 à 360
  blur?:       number;   // 0 à 20
  grayscale?:  boolean;
  sepia?:      boolean;
  invert?:     boolean;
}

export interface TextFilters {
  blur?:        number;
  brightness?:  number;
}

// ─── TextElement — ajoute gradient + mask + filters ──────────────────────────
export interface TextElement extends BaseElement {
  type:            'text';
  text:            string;
  fontSize:        number;
  fontFamily?:     string;
  fontStyle?:      'normal' | 'bold' | 'italic';
  fontWeight?:     number;
  textDecoration?: 'none' | 'underline' | 'line-through';
  align?:          'left' | 'center' | 'right';
  verticalAlign?:  'top' | 'middle' | 'bottom';
  lineHeight?:     number;
  letterSpacing?:  number;
  // ── Nouveau ──
  textGradient?: {
    enabled:    boolean;
    color1:     string;
    color2:     string;
    direction:  number; // degrés
  };
  maskImageSrc?: string;   // URL image utilisée comme masque sur le texte
  filters?:      TextFilters;
}

// ─── ImageElement — ajoute filters + removeBackground ────────────────────────
export interface ImageElement extends BaseElement {
  type:              'image';
  src:               string;
  originalSrc?:      string;  // src avant remove bg
  removedBgSrc?:     string;  // src après remove bg (PNG transparent)
  bgRemoved?:        boolean;
  imageFit?:         'fill' | 'contain' | 'cover';
  alt?:              string;
  filters?:          ImageFilters;
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