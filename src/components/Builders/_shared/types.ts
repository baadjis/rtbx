// components/builders/_shared/types.ts



export type DrawTool = 'pen' | 'brush' | 'eraser'
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
  | 'cross'
  | 'bezier'
  | 'octagon'
  | 'blob'
  ;




  export interface BezierPoint {
  x: number;
  y: number;
}

export interface BezierElement extends BaseElement {
  type: 'bezier';
  points:   BezierPoint[]; // points de contrôle
  closed?:  boolean;       // courbe fermée ou ouverte
  tension?: number;        // 0 = angles droits, 1 = très courbé
}

//_____________________blendmode__________________
export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type ClipShape =
  | 'none'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'hexagon'
  | 'pentagon'
  | 'diamond'
  | 'blob'
  | 'rounded'; // rect arrondi

export interface ImageBackground {
  type:       'color' | 'gradient' | 'image';
  color?:     string;
  gradient?:  {
    type:      'linear' | 'radial';
    color1:    string;
    color2:    string;
    direction: number;
  };
  imageSrc?:  string;
}



export type ElementType =
  | 'container'
  | 'group'
  | 'text'
  | 'image'
  | 'draw'
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
  gradientType?:    'linear' | 'radial';  // ← nouveau
  gradientRadius?:  number; 
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

export interface DrawElement extends BaseElement {
  type:      'draw';
  points:    number[];     // flat array [x1,y1,x2,y2,...]
  tool:      DrawTool;
  lineWidth: number;
  lineCap?:  'round' | 'square' | 'butt';
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
  stroke?:       string;  // ← nouveau
  strokeWidth?:  number;  
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
// Dans ImageElement, ajoute :
export interface ImageElement extends BaseElement {
  type:          'image';
  src:           string;
  originalSrc?:  string;
  removedBgSrc?: string;
  bgRemoved?:    boolean;
  imageFit?:     'fill' | 'contain' | 'cover';
  alt?:          string;
  filters?:      ImageFilters;
  // ── Nouveau ──
  blendMode?:    BlendMode;
  clipShape?:    ClipShape;
  clipRadius?:   number;   // pour 'rounded'
  background?:   ImageBackground; // fond derrière l'image (après remove bg)
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
  | DrawElement
  | BezierElement  // ← nouveau
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