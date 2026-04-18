/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Builder from '../Builder'
import EditorCanvas from '../EditorCanvas'
import PreviewCanvas from '../PreviewCanvas'
import { flyerTree } from './templates'
import { Data } from './data'
import { BuilderContext } from '../Builder'
import { useRef } from 'react'



export default function FlyerBuilder(props: any) {

  // 🎯 ref du Stage Konva
  const stageRef = useRef<any>(null)

  // 📸 EXPORT PNG (👉 c’est ICI qu’il est)
  const exportPNG = () => {
    if (!stageRef.current) return

    const uri = stageRef.current.toDataURL({
      pixelRatio: 2
    })

    const link = document.createElement('a')
    link.download = 'flyer.png'
    link.href = uri
    link.click()
  }


  const exportPDF = () => {
  if (!stageRef.current) return

  const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 })

  const pdf = new (window as any).jspdf.jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [320, 520]
  })

  pdf.addImage(dataURL, 'PNG', 0, 0, 320, 520)
  pdf.save('flyer.pdf')
}

  return (
    <Builder
      initialData={flyerTree}
      data={Data}
      onExportPNG={exportPNG} // ✅ IMPORTANT : branché ici
      onExportPDF={exportPDF}
      {...props}

      renderEditor={(ctx: BuilderContext) => (
        <EditorCanvas
          ctx={ctx}
          stageRef={stageRef} // ✅ nécessaire pour export
        />
      )}

      renderPreview={(ctx: BuilderContext) => (
        <PreviewCanvas tree={ctx.tree} />
      )}
    />
  )
}

