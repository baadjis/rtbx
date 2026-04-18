'use client'

import { Stage, Layer } from 'react-konva'
import { DesignNode } from '@/lib/design/types'
import RenderNode from './RenderNode'

type Props = {
  tree: DesignNode[]
}

export default function PreviewCanvas({ tree }: Props) {
  return (
    <div className="
      w-full
      min-h-[60vh] md:min-h-[70vh]
      bg-gray-100 dark:bg-neutral-800
      flex items-center justify-center
      rounded-xl
    ">

      {/* 📄 CANVAS */}
      <div className="
        bg-white
        shadow-xl
        border border-gray-200 dark:border-neutral-700
      ">
        <Stage width={320} height={520}>
          <Layer listening={false}>
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

    </div>
  )
}