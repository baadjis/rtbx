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

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(node.props?.text || '')

  useEffect(() => {
    if (nodeRef && ref.current) {
      nodeRef(node.id, ref.current)
    }
  }, [node.id, nodeRef])

  const commonProps = {
    x: node.props.x,
    y: node.props.y,
    draggable: !isRoot && !!onDrag,
    ref,

    // ✅ SELECTION FIX
    onTap: () => onSelect?.(node.id),

    onDragEnd: (e: any) => {
      if (onDrag && !isRoot) {
        onDrag(node.id, e.target.x(), e.target.y())
      }
    }
  }

  // 📦 CONTAINER
  if (node.type === "container") {
    return (
      <Group {...commonProps}>
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
            actions={actions} // ✅ IMPORTANT
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
  x={node.props.x}
  y={node.props.y}
  text={node.props.text}
  fontSize={20}
  fill="black"
  onClick={() => console.log("CLICK OK")}
  onTap={() => console.log("TAP OK")}
  onDblClick={() => console.log("DBLCLICK OK")}
  onDblTap={() => console.log("DBLTAP OK")}
/>

        {/* ✅ INPUT SIMPLE QUI MARCHE */}
        {isEditing && (
          <div
            style={{
              position: 'fixed',
              top: 120,
              left: 40,
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