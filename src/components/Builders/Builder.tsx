/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Eye, Save, Loader2, Settings2 } from 'lucide-react'
import { DesignNode } from '@/lib/design/types'
import BuilderHeader from './BuilderHeader'

/* ================= TYPES ================= */

export type BuilderContext = {
  tree: DesignNode[]
  setTree: (t: DesignNode[]) => void

  selectedId: string | null
  setSelectedId: (id: string | null) => void

  view: "design" | "preview"
  setView: (v: "design" | "preview") => void

  t: any

  actions: {
    updateNode: (id: string, updates: Partial<any>) => void
  }
}

type BuilderProps = {
  initialData: DesignNode[]
  onSave: (data: DesignNode[]) => void
   onExportPNG?: () => void
   onExportPDF?: () => void
  data: any
  lang?: string
  loading?: boolean

  title?: string

  renderEditor: (ctx: BuilderContext) => React.ReactNode
  renderPreview: (ctx: BuilderContext) => React.ReactNode
}

/* ================= COMPONENT ================= */

export default function Builder({
  initialData,
  onSave,
  onExportPNG,
  onExportPDF,
  data,
  lang = 'en',
  loading = false,
  title = 'Builder',
  renderEditor,
  renderPreview
}: BuilderProps) {

  // 🌍 traduction
  const t = data?.[lang] || data?.fr || {}

  // 🧠 state global
  const [tree, setTree] = useState<DesignNode[]>(initialData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'design' | 'preview'>('design')

  // 🔁 update récursif
  const updateNode = (id: string, updates: Partial<any>) => {
    if (!id) return

    const update = (nodes: DesignNode[]): DesignNode[] => {
      return nodes.map(node => {

        if (node.id === id) {
          return {
            ...node,
            props: {
              ...node.props,
              ...updates
            }
          } as DesignNode
        }

        if (node.type === "container") {
          return {
            ...node,
            children: update(node.children)
          }
        }

        return node
      })
    }

    setTree(prev => update(prev))
  }

  const ctx: BuilderContext = {
    tree,
    setTree,
    selectedId,
    setSelectedId,
    view,
    setView,
    t,
    actions: {
      updateNode
    }
  }

  return (
    <div className="w-full space-y-4">

      {/* 🧭 HEADER */}
      <BuilderHeader
  title={title}
  onSave={() => onSave(tree)}
  onNew={() => setTree(initialData)}
  onExportPNG={onExportPNG} // ✅ ICI AUSSI
  onExportPDF={onExportPDF}
  loading={loading}
/>

      {/* 🔄 SWITCH DESIGN / PREVIEW */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setView('design')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
            view === 'design'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-neutral-700 dark:text-white'
          }`}
        >
          <Settings2 size={14} />
          {t.tab_design || 'Design'}
        </button>

        <button
          onClick={() => setView('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
            view === 'preview'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-neutral-700 dark:text-white'
          }`}
        >
          <Eye size={14} />
          {t.tab_preview || 'Preview'}
        </button>
      </div>

      {/* 🎨 CONTENT */}
      {view === 'design' && (
        <div className="space-y-4">
          {renderEditor(ctx)}

          <button
            onClick={() => onSave(tree)}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold
            bg-indigo-600 text-white
            flex items-center justify-center gap-2"
          >
            {loading
              ? <Loader2 className="animate-spin" />
              : <><Save size={16} /> {t.btn_save || 'Save'}</>
            }
          </button>
        </div>
      )}

      {view === 'preview' && (
        <div className="flex justify-center">
          {renderPreview(ctx)}
        </div>
      )}

    </div>
  )
}