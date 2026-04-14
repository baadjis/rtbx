/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors 
} from '@dnd-kit/core'
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Plus, Trash2, GripVertical, Type, Hash, 
  Mail, List, Sliders, Settings2, Eye, 
  Smartphone, Save, CheckCircle2, ChevronRight 
} from 'lucide-react'
import { Data } from './data'

// --- TYPES ---
type FieldType = 'text' | 'email' | 'number' | 'range' | 'select';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
  min?: number;
  max?: number;
}

// --- SOUS-COMPOSANT SORTABLE ITEM ---
function SortableField({ field, index, onUpdate, onRemove, t }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:border-indigo-200 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
            <GripVertical size={18} />
          </div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Q{index + 1} — {field.type}</span>
        </div>
        <button onClick={() => onRemove(field.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <input 
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          placeholder={t.placeholder_label}
          className="w-full text-lg font-bold bg-transparent border-none focus:ring-0 p-0 dark:text-white"
        />
        
        <div className="flex flex-wrap items-center gap-4">
          <input 
            value={field.placeholder}
            onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
            placeholder={t.placeholder_help}
            className="text-xs bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 flex-1 dark:text-slate-300"
          />
          
          {field.type === 'range' && (
             <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <span className="text-[10px] font-bold text-indigo-600">Max:</span>
                <input type="number" value={field.max} onChange={(e) => onUpdate(field.id, { max: parseInt(e.target.value) })} className="w-12 bg-transparent border-none p-0 text-xs font-black text-indigo-600" />
             </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer group/label">
            <div className={`w-8 h-4 rounded-full relative transition-colors ${field.required ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
                <input type="checkbox" checked={field.required} onChange={(e) => onUpdate(field.id, { required: e.target.checked })} className="hidden" />
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${field.required ? 'right-0.5' : 'left-0.5'}`} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.label_required}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function FormBuilderClient({ lang }: { lang: 'fr' | 'en' }) {
  const t = Data[lang];
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeTab, setActiveTab] = useState<'design' | 'preview'>('design');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      label: '', type, required: false, placeholder: '',
      min: type === 'range' ? 0 : undefined,
      max: type === 'range' ? 100 : undefined
    };
    setFields([...fields, newField]);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateField = (id: string, updates: any) => setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  const removeField = (id: string) => setFields(fields.filter(f => f.id !== id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      
      {/* NAVIGATION TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">{t.title}</h1>
          <p className="text-gray-500 font-medium">{t.sub}</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
           <button onClick={() => setActiveTab('design')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}><Settings2 size={16}/> {t.tab_design}</button>
           <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-none cursor-pointer ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}><Eye size={16}/> {t.tab_preview}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* --- COLONNE DESIGN --- */}
        <div className={`space-y-8 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">{t.add_field}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { type: 'text', icon: Type }, { type: 'number', icon: Hash }, 
                { type: 'email', icon: Mail }, { type: 'range', icon: Sliders }, 
                { type: 'select', icon: List }
              ].map((tool) => (
                <button key={tool.type} onClick={() => addField(tool.type as any)} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all border-none cursor-pointer group">
                  <tool.icon className="text-gray-400 group-hover:text-indigo-600" size={20} />
                  <span className="text-[10px] font-black uppercase">
                {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  /* @ts-ignore */
                   t.types[tool.type]
                   
                }</span>
                </button>
              ))}
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <SortableField key={field.id} field={field} index={index} onUpdate={updateField} onRemove={removeField} t={t} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all border-none cursor-pointer">
            <Save className="inline mr-2" /> {t.btn_save}
          </button>
        </div>

        {/* --- COLONNE PREVIEW (SMARTPHONE) --- */}
        <div className={`lg:sticky lg:top-24 flex flex-col items-center ${activeTab === 'design' ? 'hidden lg:block' : ''}`}>
           <div className="relative w-full max-w-[360px] h-[720px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20" />
              <div className="h-full bg-white dark:bg-slate-950 overflow-y-auto p-8 pt-16 space-y-10 no-scrollbar">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black dark:text-white tracking-tight">{t.preview_title}</h2>
                  <p className="text-xs text-gray-400 font-medium">{t.preview_sub}</p>
                </div>

                <div className="space-y-8">
                  {fields.length > 0 ? fields.map(f => (
                    <div key={f.id} className="space-y-3">
                      <label className="text-sm font-bold dark:text-slate-200">
                        {f.label || "Untitled Question"} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {f.type === 'range' ? (
                        <div className="space-y-2">
                            <input type="range" className="w-full accent-indigo-600" />
                            <div className="flex justify-between text-[10px] font-black text-gray-400"><span>0%</span><span>{f.max}%</span></div>
                        </div>
                      ) : (
                        <div className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs text-gray-300">
                            {f.placeholder || "..."}
                        </div>
                      )}
                    </div>
                  )) : <p className="text-center text-gray-300 italic py-20 text-sm">{t.empty_state}</p>}
                </div>
                {fields.length > 0 && <button disabled className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm opacity-50">{t.btn_send}</button>}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}