/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Stage, Layer, Transformer } from 'react-konva'
import { useRef, useEffect } from 'react'
import { DesignNode } from '@/lib/design/types'
import RenderNode from './RenderNode'
import { BuilderContext } from './Builder'
import Toolbar from './Toolbar'

type Props = {
  ctx: BuilderContext
}

export default function EditorCanvas({ ctx }: Props) {
  const { tree, selectedId, setSelectedId, actions } = ctx

  const transformerRef = useRef<any>(null)
  const selectedNodeRef = useRef<any>(null)

  useEffect(() => {
    if (selectedNodeRef.current && transformerRef.current) {
      transformerRef.current.nodes([selectedNodeRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [selectedId])

  return (
    <div className="space-y-4">

      {/* 🧰 TOOLBAR */}
      <Toolbar ctx={ctx} />

      {/* 🎨 CANVAS */}
      <div className="flex justify-center">
        <Stage width={320} height={520}>
          <Layer>

            {tree.map((node) => (
              <RenderNode
                key={node.id}
                node={node}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDrag={(id: string, x: any, y: any) => {
                  actions.updateNode(id, { x, y })
                }}
                nodeRef={(id: string | null, ref: any) => {
                  if (id === selectedId) {
                    selectedNodeRef.current = ref
                  }
                }}
              />
            ))}

            {/* 🔲 TRANSFORMER */}
            <Transformer ref={transformerRef} />

          </Layer>
        </Stage>
      </div>
    </div>
  )
}

