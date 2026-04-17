
'use client'

import { Rect, Text, Group } from 'react-konva'
import { DesignNode } from '@/lib/design/types'

export default function RenderNode({
  node,
  selectedId,
  onSelect
}: {
  node: DesignNode
  selectedId?: string | null
  onSelect?: (id: string) => void
}) {

  const isSelected = selectedId === node.id

  if (node.type === "container") {
    return (
      <Group
        x={node.props.x}
        y={node.props.y}
        onClick={() => onSelect?.(node.id)}
      >
        <Rect
          width={node.props.width}
          height={node.props.height}
          fill={node.props.backgroundColor || "#eee"}
          stroke={isSelected ? "blue" : undefined}
        />

        {node.children.map(child => (
          <RenderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </Group>
    )
  }

  if (node.type === "text") {
    return (
      <Text
        x={node.props.x}
        y={node.props.y}
        text={node.props.text}
        fontSize={node.props.fontSize}
        fill={node.props.color}
        fontStyle={node.props.fontWeight}
        onClick={() => onSelect?.(node.id)}
        stroke={isSelected ? "blue" : undefined}
      />
    )
  }

  if (node.type === "image") {
    return null // step 1 on ignore
  }

  return null
}

