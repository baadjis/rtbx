
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Eye, Save, Loader2, Settings2 } from 'lucide-react'
import { DesignNode } from '@/lib/design/types'

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
  data: any
  lang?: string
  loading?: boolean

  renderEditor: (ctx: BuilderContext) => React.ReactNode
  renderPreview: (ctx: BuilderContext) => React.ReactNode
}

/* ================= COMPONENT ================= */

export default function Builder({
  initialData,
  onSave,
  data,
  lang = 'en',
  loading = false,
  renderEditor,
  renderPreview
}: BuilderProps) {

  // 🌍 traduction
  const t = data?.[lang] || data?.fr || {}

  // 🧠 state global
  const [tree, setTree] = useState<DesignNode[]>(initialData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'design' | 'preview'>('design')

  // 🔁 update récursif stable
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
    <div className="w-full space-y-8">

      {/* 🔄 SWITCH DESIGN / PREVIEW */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setView('design')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${
            view === 'design'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          <Settings2 size={14} className="inline mr-1" />
          {t.tab_design || 'Design'}
        </button>

        <button
          onClick={() => setView('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${
            view === 'preview'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          <Eye size={14} className="inline mr-1" />
          {t.tab_preview || 'Preview'}
        </button>
      </div>

      {/* 🧩 LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* EDITOR */}
        <div className={view === 'preview' ? 'hidden lg:block' : ''}>
          {renderEditor(ctx)}

          {/* SAVE */}
          <button
            onClick={() => onSave(tree)}
            disabled={loading}
            className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold"
          >
            {loading
              ? <Loader2 className="animate-spin mx-auto" />
              : <><Save className="inline mr-2" /> {t.btn_save || 'Save'}</>
            }
          </button>
        </div>

        {/* PREVIEW */}
        <div className={view === 'design' ? 'hidden lg:block' : ''}>
          {renderPreview(ctx)}
        </div>

      </div>
    </div>
  )
}

