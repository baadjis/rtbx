
'use client'

import { Rect, Text, Group } from 'react-konva'
import { DesignNode } from '@/lib/design/types'
import { useRef, useEffect } from 'react'

export default function RenderNode({
  node,
  selectedId,
  onSelect,
  onDrag,
  nodeRef
}: any) {

  const ref = useRef<any>(null)

  useEffect(() => {
    if (nodeRef && ref.current) {
      nodeRef(node.id, ref.current)
    }
  }, [node.id, nodeRef])

  const commonProps = {
    x: node.props.x,
    y: node.props.y,
    draggable: true,
    ref,
    onClick: () => onSelect(node.id),
    onDragEnd: (e: any) => {
      onDrag(node.id, e.target.x(), e.target.y())
    }
  }

  if (node.type === "container") {
    return (
      <Group {...commonProps}>
        <Rect
          width={node.props.width}
          height={node.props.height}
          fill={node.props.backgroundColor || "#eee"}
        />

        {node.children.map((child: any) => (
          <RenderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrag={onDrag}
            nodeRef={nodeRef}
          />
        ))}
      </Group>
    )
  }

  if (node.type === "text") {
    return (
      <Text
        {...commonProps}
        text={node.props.text}
        fontSize={node.props.fontSize}
        fill={node.props.color}
        fontStyle={node.props.fontWeight}
      />
    )
  }

  return null
}

