/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Settings, Plus, X } from 'lucide-react';

export function SortableField({ field, index, onRemove, onUpdate, t }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400">
            <GripVertical size={18} />
          </div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Question {index + 1}</span>
        </div>
        <button onClick={() => onRemove(field.id)} className="p-2 text-gray-300 hover:text-red-500 bg-transparent border-none cursor-pointer"><Trash2 size={18} /></button>
      </div>

      <div className="space-y-4">
        <input 
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          placeholder={t.placeholder_q}
          className="w-full text-lg font-bold bg-transparent border-none focus:ring-0 p-0 dark:text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              value={field.placeholder}
              onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
              placeholder={t.placeholder_help}
              className="text-xs bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 dark:text-slate-300"
            />
            <button 
                type="button"
                onClick={() => onUpdate(field.id, { required: !field.required })}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${field.required ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}
            >
                {t.label_required}
            </button>
        </div>

        {/* --- CONFIGURATION SPÉCIFIQUE : RANGE --- */}
        {field.type === 'range' && (
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-3">
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t.label_range_config}</p>
            <div className="grid grid-cols-2 gap-3">
               <input placeholder={t.min_label} value={field.range_settings.min_label} onChange={e => onUpdate(field.id, { range_settings: {...field.range_settings, min_label: e.target.value}})} className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
               <input placeholder={t.max_label} value={field.range_settings.max_label} onChange={e => onUpdate(field.id, { range_settings: {...field.range_settings, max_label: e.target.value}})} className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold" />
            </div>
          </div>
        )}

        {/* --- CONFIGURATION SPÉCIFIQUE : SELECT --- */}
        {field.type === 'select' && (
          <div className="space-y-2">
            {field.options.map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input 
                  value={opt} 
                  onChange={e => {
                    const newOpts = [...field.options]; newOpts[i] = e.target.value;
                    onUpdate(field.id, { options: newOpts })
                  }}
                  className="flex-1 p-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-xs"
                />
                <button onClick={() => onUpdate(field.id, { options: field.options.filter((_:any, idx:number) => idx !== i)})} className="p-2 text-red-400"><X size={14}/></button>
              </div>
            ))}
            <button onClick={() => onUpdate(field.id, { options: [...field.options, 'New Option']})} className="text-[10px] font-bold text-indigo-600 uppercase">{t.btn_add_option}</button>
          </div>
        )}
      </div>
    </div>
  );
}