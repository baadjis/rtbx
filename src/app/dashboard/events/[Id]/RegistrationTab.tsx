/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { 
  Plus, Trash2, Building2, UserSquare2, 
  Settings2, Check, Smartphone, 
  Mail, User, Asterisk, Save, Loader2, 
  Hash,
  Type
} from 'lucide-react'

export default function RegistrationTab({ 
  lang, t, 
  askCompany, setAskCompany, 
  askProRole, setAskProRole,
  customFields, setCustomFields,
  handleSave, // Fonction de sauvegarde passée par le parent
  loading 
}: any) {

  const addField = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false
    }
    setCustomFields([...customFields, newField])
  }

  const removeField = (id: string) => {
    setCustomFields(customFields.filter((f: any) => f.id !== id))
  }

  const updateField = (id: string, updates: any) => {
    setCustomFields(customFields.map((f: any) => f.id === id ? { ...f, ...updates } : f))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-right-8 duration-500">
      
      {/* --- COLONNE GAUCHE : CONFIGURATION --- */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-10">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
              <Settings2 className="text-indigo-600" /> {t.form_builder_title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{t.form_builder_desc}</p>
          </div>

          {/* CHAMPS STANDARDS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Champs prédéfinis</label>
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
          </div>

          <div className="h-px bg-gray-50 dark:bg-slate-800" />

          {/* CHAMPS PERSONNALISÉS */}
          <div className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Questions personnalisées (JSON)</label>
            <div className="space-y-4">
                {customFields.map((field: any) => (
                <div key={field.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-4">
                        <input 
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            placeholder={t.field_label_ph}
                            className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <select 
                                    value={field.type}
                                    onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                    className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-indigo-600 appearance-none shadow-sm cursor-pointer"
                                >
                                    <option value="text">Texte</option>
                                    <option value="number">Nombre</option>
                                </select>
                                <button 
                                    type="button"
                                    onClick={() => updateField(field.id, { required: !field.required })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-400'}`}
                                >
                                    {t.label_required}
                                </button>
                            </div>
                            <button onClick={() => removeField(field.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                    </div>
                </div>
                ))}

                <button 
                    type="button"
                    onClick={addField}
                    className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent"
                >
                    <Plus size={18} /> {t.add_custom_field}
                </button>
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
             {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} {t.btn_save_branding}
          </button>
        </div>
      </div>

      {/* --- COLONNE DROITE : LIVE PREVIEW (Smartphone) --- */}
      <div className="hidden lg:flex sticky top-24 justify-center">
        <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
            
            {/* Screen Content */}
            <div className="h-full bg-white overflow-y-auto p-6 pt-10 space-y-6">
                <div className="space-y-1">
                    <h4 className="text-lg font-black text-gray-900 leading-tight">Inscription</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{t.public_register_sub}</p>
                </div>

                <div className="space-y-4">
                    <PreviewInput label="Nom complet" icon={User} required />
                    <PreviewInput label="Email" icon={Mail} required />
                    
                    {askCompany && <PreviewInput label="Entreprise" icon={Building2} required />}
                    {askProRole && <PreviewInput label="Poste / Fonction" icon={UserSquare2} required />}
                    
                    {customFields.map((f:any) => (
                        <PreviewInput key={f.id} label={f.label || "Nouvelle question"} icon={f.type === 'number' ? Hash : Type} required={f.required} />
                    ))}
                </div>

                <div className="pt-4">
                    <div className="w-full py-3 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">
                        S&apos;inscrire
                    </div>
                </div>
                
                <p className="text-[8px] text-center text-gray-300 font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                    RetailBox Security
                </p>
            </div>
        </div>
      </div>

    </div>
  )
}

// --- SOUS-COMPOSANTS ---
function ToggleButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all bg-transparent cursor-pointer ${active ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-gray-50 dark:border-slate-800'}`}>
        <div className="flex items-center gap-3">
            <Icon size={18} className={active ? "text-indigo-600" : "text-gray-400"} />
            <span className={`text-xs font-bold ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>{label}</span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
        </div>
    </button>
  )
}

function PreviewInput({ label, icon: Icon, required }: any) {
    return (
        <div className="space-y-1.5 opacity-80">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Icon size={10} /> {label}
                </span>
                {required && <Asterisk size={8} className="text-red-400" />}
            </div>
            <div className="w-full h-9 bg-gray-50 rounded-lg border border-gray-100"></div>
        </div>
    )
}