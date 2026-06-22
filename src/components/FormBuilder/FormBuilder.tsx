
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  Type, Hash, Mail, List, Sliders,
  Settings2, Eye, Save, Loader2,
  Star, BarChart2, CheckSquare, Calendar,
  Phone, Image as LucideImage, Zap, Layers
} from 'lucide-react'
import { Data } from './data'
import { SortableField } from './SortableField'

const FIELD_TYPES = [
  { id: 'text',         icon: Type,        color: 'text-blue-500',    bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' },
  { id: 'number',       icon: Hash,        color: 'text-purple-500',  bg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20' },
  { id: 'email',        icon: Mail,        color: 'text-emerald-500', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20' },
  { id: 'phone',        icon: Phone,       color: 'text-teal-500',    bg: 'hover:bg-teal-50 dark:hover:bg-teal-900/20' },
  { id: 'date',         icon: Calendar,    color: 'text-orange-500',  bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20' },
  { id: 'select',       icon: List,        color: 'text-indigo-500',  bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20' },
  { id: 'multiselect',  icon: CheckSquare, color: 'text-violet-500',  bg: 'hover:bg-violet-50 dark:hover:bg-violet-900/20' },
  { id: 'range',        icon: Sliders,     color: 'text-pink-500',    bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/20' },
  { id: 'stars',        icon: Star,        color: 'text-yellow-500',  bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20' },
  { id: 'nps',          icon: BarChart2,   color: 'text-red-500',     bg: 'hover:bg-red-50 dark:hover:bg-red-900/20' },
  { id: 'image_choice', icon: LucideImage,  color: 'text-cyan-500',   bg: 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20' },
]

const DEFAULT_FIELD: Record<string, Partial<any>> = {
  text:         { placeholder: '' },
  number:       { placeholder: '' },
  email:        { placeholder: '' },
  phone:        { phone_settings: { default_country: 'FR' } },
  date:         {},
  select:       { options: ['Option 1', 'Option 2'] },
  multiselect:  { options: ['Option 1', 'Option 2'] },
  range:        { range_settings: { min: 0, max: 10, min_label: 'Mauvais', max_label: 'Excellent' } },
  stars:        { star_settings: { max_stars: 5 } },
  nps:          {},
  image_choice: { options: [{ label: 'Option 1', image_url: '' }] },
}

// Preview par type dans le mock phone
function PreviewField({ field ,t}: { field: any,t:any }) {
  const label = field.label || 'Question...'

  switch (field.type) {
    case 'stars':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="flex gap-1">
            {Array.from({ length: field.star_settings?.max_stars || 5 }).map((_, i) => (
              <Star key={i} size={22} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      )

    case 'nps':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 11 }, (_, i) => (
              <button key={i}
                className={`w-7 h-7 rounded-lg text-[10px] font-black border ${
                  i <= 6 ? 'border-red-200 text-red-500' :
                  i <= 8 ? 'border-yellow-200 text-yellow-500' :
                  'border-green-200 text-green-500'
                }`}>
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-gray-400">
            <span>{t.definely_not}</span>
            <span>{t.absolutely}</span>
          </div>
        </div>
      )

    case 'range':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <input type="range" className="w-full accent-indigo-600"
            min={field.range_settings?.min ?? 0}
            max={field.range_settings?.max ?? 10} />
          <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
            <span>{field.range_settings?.min_label || 'Min'}</span>
            <span>{field.range_settings?.max_label || 'Max'}</span>
          </div>
        </div>
      )

    case 'select':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold appearance-none">
            {(field.options || []).map((o: string) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )

    case 'multiselect':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="space-y-1.5">
            {(field.options || []).map((o: string, i: number) => (
              <label key={i} className="flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" className="accent-indigo-600" /> {o}
              </label>
            ))}
          </div>
        </div>
      )

    case 'image_choice':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="grid grid-cols-2 gap-2">
            {(field.options || []).map((o: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                {o.image_url
                  ? <Image src={o.image_url} alt={o.label} className="w-full h-16 object-cover" />
                  : <div className="w-full h-16 bg-gray-100 flex items-center justify-center">
                      <LucideImage size={16} className="text-gray-300" />
                    </div>
                }
                <p className="text-[10px] font-bold text-center py-1 text-gray-600">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'date':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <input type="date" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold" />
        </div>
      )

    case 'phone':
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 italic">
            +33 6 12 34 56 78
          </div>
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-800">{label}{field.required && ' *'}</p>
          <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 italic">
            {field.placeholder || '...'}
          </div>
        </div>
      )
  }
}

export default function FormBuilder({
  initialFields = [],
  onSave,
  lang = 'fr',
  loading = false,
  formSettings,
  onSettingsChange,
}: any) {
  const t = Data[lang as keyof typeof Data] || Data.fr
  const [fields, setFields] = useState(initialFields)
  const [view, setView] = useState<'design' | 'preview'>('design')
  const [mode, setMode] = useState<'classic' | 'animated'>(formSettings?.mode || 'classic')
  const sensors = useSensors(useSensor(PointerSensor))

  const addField = (type: string) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: '',
      required: false,
      ...DEFAULT_FIELD[type],
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

  const handleModeChange = (newMode: 'classic' | 'animated') => {
    setMode(newMode)
    onSettingsChange?.({ ...formSettings, mode: newMode })
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">

      {/* HEADER — Switcher design/preview + mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Design / Preview */}
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
          <button onClick={() => setView('design')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${view === 'design' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            <Settings2 size={13} className="inline mr-1.5" /> {t.tab_design}
          </button>
          <button onClick={() => setView('preview')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${view === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            <Eye size={13} className="inline mr-1.5" /> {t.tab_preview}
          </button>
        </div>

        {/* Mode classic / animated */}
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
          <button onClick={() => handleModeChange('classic')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${mode === 'classic' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            <Layers size={13} /> {t.classic_mode}
          </button>
          <button onClick={() => handleModeChange('animated')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${mode === 'animated' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-gray-400'}`}>
            <Zap size={13} /> {t.animated_mode}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* DESIGN PANEL */}
        <div className={`space-y-6 ${view === 'preview' ? 'hidden lg:block' : ''}`}>

          {/* Palette de types */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">{t.add_field}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {FIELD_TYPES.map(ft => {
                const Icon = ft.icon
                return (
                  <button key={ft.id} onClick={() => addField(ft.id)}
                    className={`flex flex-col items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl ${ft.bg} transition-all border-none cursor-pointer group`}>
                    <Icon size={20} className={`${ft.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-[8px] font-black uppercase mt-1.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {(t.types as any)?.[ft.id] || ft.id}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Champs drag & drop */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <p className="text-gray-400 text-sm font-medium">
                    {t.add_first_fields}
                  </p>
                </div>
              )}
              {fields.map((f: any, i: number) => (
                <SortableField key={f.id} field={f} index={i} t={t} lang={lang}
                  onRemove={(id: string) => setFields(fields.filter((x: any) => x.id !== id))}
                  onUpdate={(id: string, upd: any) => setFields(fields.map((x: any) => x.id === id ? { ...x, ...upd } : x))}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button onClick={() => onSave(fields, { ...formSettings, mode })}
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-base shadow-xl hover:bg-indigo-700 transition-all border-none cursor-pointer disabled:opacity-50">
            {loading
              ? <Loader2 className="animate-spin mx-auto" />
              : <><Save size={18} className="inline mr-2" /> {t.btn_save}</>
            }
          </button>
        </div>

        {/* PREVIEW PANEL (mock phone) */}
        <div className={`lg:sticky lg:top-24 flex justify-center ${view === 'design' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative w-[320px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden"
            style={{ height: '640px' }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-3xl z-20" />

            {/* Screen */}
            <div className="h-full bg-white dark:bg-slate-950 overflow-y-auto pt-10 no-scrollbar">

              {/* Mode badge */}
              <div className="flex justify-center pt-2 pb-1">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  mode === 'animated'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {mode === 'animated' ? '⚡ Animated' : '☰ Classic'}
                </span>
              </div>

              {fields.length === 0 ? (
                <div className="flex items-center justify-center h-3/4">
                  <p className="text-gray-300 text-xs text-center px-8">
                    {t.add_field}
                  </p>
                </div>
              ) : mode === 'animated' ? (
                // Animated preview — une seule question à la fois
                <div className="px-6 py-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 font-bold">1 / {fields.length}</span>
                    <div className="flex-1 mx-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${100 / fields.length}%` }} />
                    </div>
                  </div>
                  <PreviewField field={fields[0]}  t={t}/>
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black">
                    {t.btn_next}
                  </button>
                </div>
              ) : (
                // Classic preview — toutes les questions
                <div className="px-6 py-4 space-y-6">
                  {fields.map((f: any) => (
                    <PreviewField key={f.id} field={f} t={t}/>
                  ))}
                  {fields.length > 0 && (
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black mt-4">
                      {t.btn_submit}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

