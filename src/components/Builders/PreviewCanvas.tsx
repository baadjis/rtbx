
'use client'

import { Stage, Layer } from 'react-konva'
import { DesignNode } from '@/lib/design/types'
import RenderNode from './RenderNode'

type Props = {
  tree: DesignNode[]
}
export default function PreviewCanvas({ tree }: Props) {
  return (
    <div className="flex justify-center">
      <Stage width={320} height={520}>
        <Layer listening={false}> {/* ✅ IMPORTANT */}
          {tree.map((node) => (
            <RenderNode
              key={node.id}
              node={node}
              selectedId={null}
              onSelect={undefined}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

