/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Builder from '../Builder'
import EditorCanvas from '../EditorCanvas'
import { flyerTree } from './templates'
import { Data } from './data'

export default function FlyerBuilder(props: any) {
  return (
    <Builder
      initialData={flyerTree}
      data={Data}
      {...props}

      renderEditor={(ctx) => (
        <EditorCanvas
          tree={ctx.tree}
          selectedId={ctx.selectedId}
          setSelectedId={ctx.setSelectedId}
        />
      )}

      renderPreview={(ctx) => (
        <EditorCanvas
          tree={ctx.tree}
        />
      )}
    />
  )
}

