/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Rect, Text, Group } from 'react-konva'
import { useRef, useEffect, useState } from 'react'

export default function RenderNode({
  node,
  selectedId,
  onSelect,
  onDrag,
  nodeRef,
  actions
}: any) {

  const ref = useRef<any>(null)
  const isRoot = node.id === 'root'

  // ✏️ EDIT STATE
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(node.props?.text || '')

  // 🔗 ref binding
  useEffect(() => {
    if (nodeRef && ref.current) {
      nodeRef(node.id, ref.current)
    }
  }, [node.id, nodeRef])

  // 🎯 common props
  const commonProps = {
    x: node.props.x,
    y: node.props.y,
    draggable: !isRoot && !!onDrag,
    ref,
    onClick: () => onSelect?.(node.id),
    onDragEnd: (e: any) => {
      if (onDrag && !isRoot) {
        onDrag(node.id, e.target.x(), e.target.y())
      }
    }
  }

  // 📦 CONTAINER
  if (node.type === "container") {
    return (
      <Group
        {...commonProps}
        onDragStart={(e) => e.cancelBubble = true}
      >
        <Rect
          width={node.props.width}
          height={node.props.height}
          fill={node.props.backgroundColor || "#eee"}
        />

        {node.children?.map((child: any) => (
          <RenderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrag={onDrag}
            nodeRef={nodeRef}
            actions={actions}
          />
        ))}
      </Group>
    )
  }

  // 🔤 TEXT
  if (node.type === "text") {
    return (
      <>
        <Text
          {...commonProps}
          text={node.props.text}
          fontSize={node.props.fontSize}
          fill={node.props.color}
          fontStyle={node.props.fontWeight}
          onClick={() => {
  setValue(node.props.text || '')
  setIsEditing(true)
}}
        />

        {isEditing && (
  <div
    style={{
      position: 'fixed',
      top: 200,
      left: 50,
      background: 'white',
      padding: 6,
      border: '1px solid #ccc',
      zIndex: 9999
    }}
  >
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        actions?.updateNode(node.id, { text: value })
        setIsEditing(false)
      }}
    />
  </div>
)}
      </>
    )
  }

  return null
}