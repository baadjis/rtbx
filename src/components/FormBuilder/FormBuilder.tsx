/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { 
  Type, Hash, Mail, List, Sliders, 
  Settings2, Eye, Save, Loader2 
} from 'lucide-react'
import { Data } from './data'
import { SortableField } from './SortableField'

export default function FormBuilder({ initialFields = [], onSave, lang = 'fr', loading = false }: any) {
  const t = Data[lang as keyof typeof Data] || Data.fr;
  const [fields, setFields] = useState(initialFields)
  const [view, setView] = useState<'design' | 'preview'>('design')

  const sensors = useSensors(useSensor(PointerSensor))

  const addField = (type: string) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'select' ? ['Option 1'] : undefined,
      range_settings: type === 'range' ? { min: 0, max: 10, min_label: 'Mauvais', max_label: 'Excellent' } : undefined
    }
    setFields([...fields, newField])
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setFields((items: any) => {
        const oldIdx = items.findIndex((i: any) => i.id === active.id)
        const newIdx = items.findIndex((i: any) => i.id === over.id)
        return arrayMove(items, oldIdx, newIdx)
      })
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      {/* SWITCHER DESIGN/PREVIEW */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner">
        <button onClick={() => setView('design')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${view === 'design' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
          <Settings2 size={14} className="inline mr-2" /> {t.tab_design}
        </button>
        <button onClick={() => setView('preview')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${view === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
          <Eye size={14} className="inline mr-2" /> {t.tab_preview}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* DESIGN PANEL */}
        <div className={`space-y-8 ${view === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-6">{t.add_field}</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { id: 'text', icon: Type }, { id: 'number', icon: Hash }, 
                { id: 'range', icon: Sliders }, { id: 'select', icon: List }, 
                { id: 'email', icon: Mail }
              ].map(tool => (
                <button key={tool.id} onClick={() => addField(tool.id)} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all border-none cursor-pointer">
                  <tool.icon size={22} />
                  <span className="text-[9px] font-black uppercase mt-2">{t.types[tool.id as keyof typeof t.types]}</span>
                </button>
              ))}
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f:any) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((f: any, i: number) => (
                <SortableField key={f.id} field={f} index={i} t={t} 
                  onRemove={(id:string) => setFields(fields.filter((x:any)=>x.id!==id))}
                  onUpdate={(id:string, upd:any) => setFields(fields.map((x:any)=>x.id===id?{...x,...upd}:x))} 
                />
              ))}
            </SortableContext>
          </DndContext>

          <button onClick={() => onSave(fields)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : <><Save className="inline mr-2" /> {t.btn_save}</>}
          </button>
        </div>

        {/* PREVIEW PANEL (PHONE) */}
        <div className={`lg:sticky lg:top-24 flex justify-center ${view === 'design' ? 'hidden lg:block' : ''}`}>
           <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20" />
              <div className="h-full bg-white dark:bg-slate-950 overflow-y-auto p-8 pt-16 space-y-8 no-scrollbar">
                {fields.map((f: any) => (
                  <div key={f.id} className="space-y-3">
                    <p className="text-sm font-bold dark:text-white">{f.label || "Question..."} {f.required && "*"}</p>
                    {f.type === 'range' ? (
                      <div className="space-y-2">
                        <input type="range" className="w-full accent-indigo-600" min={f.range_settings.min} max={f.range_settings.max} />
                        <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                          <span>{f.range_settings.min_label}</span>
                          <span>{f.range_settings.max_label}</span>
                        </div>
                      </div>
                    ) : f.type === 'select' ? (
                      <select className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 text-xs font-bold appearance-none">
                        {f.options.map((o:string) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <div className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 text-xs text-gray-400 italic">
                        {f.placeholder || "..."}
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}