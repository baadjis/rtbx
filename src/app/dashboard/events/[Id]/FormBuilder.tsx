/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Plus, Trash2, Type, Hash, List, Building2, UserSquare2, Settings2, Check } from 'lucide-react'

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number';
  required: boolean;
}

export default function FormBuilder({ 
  lang, t, 
  askCompany, setAskCompany, 
  askProRole, setAskProRole,
  customFields, setCustomFields 
}: any) {

  const addField = () => {
    const newField: CustomField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false
    }
    setCustomFields([...customFields, newField])
  }

  const removeField = (id: string) => {
    setCustomFields(customFields.filter((f: CustomField) => f.id !== id))
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map((f: CustomField) => f.id === id ? { ...f, ...updates } : f))
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
      <div>
        <h3 className="text-xl font-black mb-2 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
          <Settings2 className="text-indigo-600" /> {t.form_builder_title}
        </h3>
        <p className="text-xs text-gray-400 font-medium">{t.form_builder_desc}</p>
      </div>

      {/* --- PARTIE 1 : CHAMPS STANDARDS (TOGGLES) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleButton 
          active={askCompany} 
          onClick={() => setAskCompany(!askCompany)} 
          label={t.label_ask_company} 
          icon={Building2} 
        />
        <ToggleButton 
          active={askProRole} 
          onClick={() => setAskProRole(!askProRole)} 
          label={t.label_ask_pro} 
          icon={UserSquare2} 
        />
      </div>

      <div className="h-px bg-gray-50 dark:bg-slate-800" />

      {/* --- PARTIE 2 : CHAMPS PERSONNALISÉS (DYNAMIQUE) --- */}
      <div className="space-y-4">
        {customFields.map((field: CustomField) => (
          <div key={field.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Label du champ */}
              <div className="flex-1 w-full space-y-2">
                <input 
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder={t.field_label_ph}
                  className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Type et Options */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                  className="p-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-indigo-600 appearance-none shadow-sm cursor-pointer"
                >
                  <option value="text">abc {t.field_type_text}</option>
                  <option value="number">123 {t.field_type_number}</option>
                </select>

                <button 
                  type="button"
                  onClick={() => updateField(field.id, { required: !field.required })}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-400'}`}
                >
                  {field.required && <Check size={12} />} {t.label_required}
                </button>

                <button 
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          type="button"
          onClick={addField}
          className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer"
        >
          <Plus size={18} /> {t.add_custom_field}
        </button>
      </div>
    </div>
  )
}

// --- SOUS-COMPOSANT BOUTON TOGGLE ---
function ToggleButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all bg-transparent cursor-pointer ${active ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-gray-50 dark:border-slate-800'}`}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} className={active ? "text-indigo-600" : "text-gray-400"} />
            <span className={`text-sm font-bold ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>{label}</span>
        </div>
        <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
        </div>
    </button>
  )
}