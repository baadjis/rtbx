
export type NodeType = "container" | "text" | "image"

export type BaseProps = {
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
}

export type ContainerProps = BaseProps & {
  backgroundColor?: string
}

export type TextProps = BaseProps & {
  text: string
  color?: string
  fontSize?: number
  fontWeight?: "normal" | "bold"
}

export type ImageProps = BaseProps & {
  src: string
}

export type DesignNode =
  | {
      id: string
      type: "container"
      props: ContainerProps
      children: DesignNode[]
    }
  | {
      id: string
      type: "text"
      props: TextProps
    }
  | {
      id: string
      type: "image"
      props: ImageProps
    }

