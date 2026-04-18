/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Stage, Layer, Transformer } from 'react-konva'
import { useRef, useEffect } from 'react'
import { DesignNode } from '@/lib/design/types'
import RenderNode from './RenderNode'
import { BuilderContext } from './Builder'
import Toolbar from './Toolbar'

type Props = {
  ctx: BuilderContext,
  stageRef: any
}

export default function EditorCanvas({ ctx,stageRef }: Props) {
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

      {/* 🎨 WORKSPACE */}
      <div className="
        w-full
        min-h-[60vh] md:min-h-[70vh]
        bg-gray-100 dark:bg-neutral-800
        flex items-center justify-center
        rounded-xl
        overflow-hidden
      ">

        {/* 📄 CANVAS */}
        <div className="
          bg-white
          shadow-xl
          border border-gray-200 dark:border-neutral-700
        ">
          <Stage ref={stageRef} width={320} height={520}   draggable={false}
          onTouchMove={(e) => e.evt.preventDefault()}
          >
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
                  onDragStart={(e:any) => {
                     e.cancelBubble = true
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
    </div>
  )
}