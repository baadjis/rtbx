/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Builder from '../Builder'
import EditorCanvas from '../EditorCanvas'
import PreviewCanvas from '../PreviewCanvas'
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
        <EditorCanvas ctx={ctx} />
      )}

      renderPreview={(ctx: BuilderContext) => (
        <PreviewCanvas tree={ctx.tree} />
      )}
    />
  )
}

