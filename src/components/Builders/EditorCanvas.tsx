
'use client'

import { Stage, Layer } from 'react-konva'
import { DesignNode } from '@/lib/design/types'
import RenderNode from './RenderNode'

export default function EditorCanvas({
  tree,
  selectedId,
  setSelectedId
}: {
  tree: DesignNode[]
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}) {
  return (
    <div className="flex justify-center">
      <Stage width={320} height={520}>
        <Layer>
          {tree.map(node => (
            <RenderNode
              key={node.id}
              node={node}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

