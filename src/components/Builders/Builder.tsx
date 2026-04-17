
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Eye, Save, Loader2, Settings2 } from 'lucide-react'

type BuilderProps = {
  initialData?: any[]
  onSave: (data: any[]) => void
  data: any // translation object
  lang?: string
  loading?: boolean

  // injected UI
  renderEditor: (ctx: BuilderContext) => React.ReactNode
  renderPreview: (ctx: BuilderContext) => React.ReactNode
  renderToolbar?: (ctx: BuilderContext) => React.ReactNode
}

export type BuilderContext = {
  elements: any[]
  setElements: (el: any[]) => void

  view: 'design' | 'preview'
  setView: (v: 'design' | 'preview') => void

  t: any

  actions: {
    addElement: (el: any) => void
    updateElement: (id: string, updates: any) => void
    removeElement: (id: string) => void
    reset: () => void
  }
}

export default function Builder({
  initialData = [],
  onSave,
  data,
  lang = 'fr',
  loading = false,
  renderEditor,
  renderPreview,
  renderToolbar
}: BuilderProps) {

  // 🌍 Traduction
  const t = data?.[lang] || data?.fr || {}

  // 🧠 State central
  const [elements, setElements] = useState<any[]>(initialData)
  const [view, setView] = useState<'design' | 'preview'>('design')

  // ⚙️ Actions génériques
  const addElement = (el: any) => {
    setElements(prev => [...prev, { id: crypto.randomUUID(), ...el }])
  }

  const updateElement = (id: string, updates: any) => {
    setElements(prev =>
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
  }

  const reset = () => {
    setElements(initialData)
  }

  const ctx: BuilderContext = {
    elements,
    setElements,
    view,
    setView,
    t,
    actions: {
      addElement,
      updateElement,
      removeElement,
      reset
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">

      {/* 🔄 SWITCH DESIGN / PREVIEW */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner">
        <button
          onClick={() => setView('design')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${
            view === 'design'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md'
              : 'text-gray-400'
          }`}
        >
          <Settings2 size={14} className="inline mr-2" />
          {t?.tab_design || 'Design'}
        </button>

        <button
          onClick={() => setView('preview')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${
            view === 'preview'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md'
              : 'text-gray-400'
          }`}
        >
          <Eye size={14} className="inline mr-2" />
          {t?.tab_preview || 'Preview'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* 🧩 EDITOR SIDE */}
        <div className={`space-y-6 ${view === 'preview' ? 'hidden lg:block' : ''}`}>

          {/* optional toolbar */}
          {renderToolbar && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              {renderToolbar(ctx)}
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            {renderEditor(ctx)}
          </div>

          {/* 💾 SAVE */}
          <button
            onClick={() => onSave(elements)}
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer"
          >
            {loading
              ? <Loader2 className="animate-spin mx-auto" />
              : <><Save className="inline mr-2" /> {t?.btn_save || 'Save'}</>
            }
          </button>
        </div>

        {/* 📱 PREVIEW SIDE */}
        <div className={`lg:sticky lg:top-24 flex justify-center ${view === 'design' ? 'hidden lg:block' : ''}`}>
          <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden">
            
            {/* notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20" />

            <div className="h-full bg-white dark:bg-slate-950 overflow-y-auto p-6 pt-16">
              {renderPreview(ctx)}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

