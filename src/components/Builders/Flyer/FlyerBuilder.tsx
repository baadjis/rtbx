/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Builder from '../Builder'
import EditorCanvas from '../EditorCanvas'
import { flyerTree } from './templates'
import { Data } from './data'
import { BuilderContext } from '../Builder'

export default function FlyerBuilder(props: any) {
  return (
    <Builder
      initialData={flyerTree}
      data={Data}
      {...props}

      renderEditor={(ctx: BuilderContext) => (
        <EditorCanvas
          tree={ctx.tree}
          selectedId={ctx.selectedId}
          setSelectedId={ctx.setSelectedId}
        />
      )}

      renderPreview={(ctx: BuilderContext) => (
        <EditorCanvas
          tree={ctx.tree}
          selectedId={null} // no selection in preview
          setSelectedId={() => {}}
        />
      )}
    />
  )
}

