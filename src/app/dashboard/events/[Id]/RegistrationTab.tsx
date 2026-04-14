/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { 
  Plus, Trash2, Building2, UserSquare2, 
  Settings2, Check, Mail, User, 
  Asterisk, Save, Loader2, Hash, Type,
  ShieldCheck, Globe, Lock
} from 'lucide-react'

export default function RegistrationTab({ 
  lang, t, 
  event, // On récupère l'objet event pour la visibilité et le nom de l'org
  askCompany, setAskCompany, 
  askProRole, setAskProRole,
  customFields, setCustomFields,
  handleSave,
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
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-10 transition-colors">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
              <Settings2 className="text-indigo-600" /> {t.form_builder_title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{t.form_builder_desc}</p>
          </div>

          {/* INDICATEUR DE VISIBILITÉ (Information) */}
          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            {event.visibility === 'public' ? <Globe size={18} className="text-indigo-600"/> : <Lock size={18} className="text-indigo-600"/>}
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                {event.visibility === 'public' 
                    ? (lang === 'fr' ? "Événement Public : Inscriptions Discovery activées" : "Public Event: Discovery opt-in enabled")
                    : (lang === 'fr' ? "Événement Privé : Inscriptions restreintes" : "Private Event: Restricted registration")}
            </p>
          </div>

          {/* CHAMPS STANDARDS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Champs prédéfinis</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleButton active={askCompany} onClick={() => setAskCompany(!askCompany)} label={t.label_ask_company} icon={Building2} />
                <ToggleButton active={askProRole} onClick={() => setAskProRole(!askProRole)} label={t.label_ask_pro} icon={UserSquare2} />
            </div>
          </div>

          <div className="h-px bg-gray-50 dark:bg-slate-800" />

          {/* CHAMPS PERSONNALISÉS */}
          <div className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Questions personnalisées</label>
            <div className="space-y-4">
                {customFields.map((field: any) => (
                <div key={field.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-4">
                        <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} placeholder={t.field_label_ph} className="w-full p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white focus:ring-2 focus:ring-indigo-500" />
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as any })} className="p-2 bg-white dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-indigo-600 appearance-none shadow-sm cursor-pointer">
                                    <option value="text">Texte</option>
                                    <option value="number">Nombre</option>
                                </select>
                                <button type="button" onClick={() => updateField(field.id, { required: !field.required })} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-400'}`}>
                                    {t.label_required}
                                </button>
                            </div>
                            <button onClick={() => removeField(field.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border-none bg-transparent cursor-pointer transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                </div>
                ))}
                <button type="button" onClick={addField} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] text-gray-400 dark:text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                    <Plus size={18} /> {t.add_custom_field}
                </button>
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 border-none cursor-pointer">
             {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} {t.btn_save_branding}
          </button>
        </div>
      </div>

      {/* --- COLONNE DROITE : LIVE PREVIEW (Smartphone) --- */}
      <div className="hidden lg:flex sticky top-24 justify-center">
        <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20"></div>
            
            {/* Screen Content */}
            <div className="h-full bg-white overflow-y-auto p-6 pt-12 space-y-6 no-scrollbar">
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-gray-900 leading-tight">Inscription</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{event.title}</p>
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

                {/* --- SECTION LÉGALE DANS LE SMARTPHONE --- */}
                <div className="pt-4 space-y-3 border-t border-gray-100">
                    <PreviewCheckbox label={lang === 'fr' ? "J'accepte les conditions RetailBox" : "I agree to RetailBox terms"} required />
                    
                    {/* Consentement Marchand (Toujours présent) */}
                    <PreviewCheckbox label={lang === 'fr' ? `Offres de ${event.org_name || 'l\'organisateur'}` : `Offers from ${event.org_name || 'organizer'}`} />

                    {/* Consentement Discovery Pool (Uniquement si Public) */}
                    {event.visibility === 'public' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <PreviewCheckbox label={lang === 'fr' ? "Suggestions d'événements similaires" : "Similar events suggestions"} />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <div className="w-full py-3.5 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">
                        S&apos;inscrire
                    </div>
                </div>
                
                <p className="text-[8px] text-center text-gray-300 font-bold uppercase tracking-widest pt-4">
                    RetailBox Protected
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
            <div className="w-full h-10 bg-gray-50 rounded-xl border border-gray-100"></div>
        </div>
    )
}

function PreviewCheckbox({ label, required }: { label: string, required?: boolean }) {
    return (
        <div className="flex items-start gap-2 opacity-70">
            <div className={`w-3.5 h-3.5 rounded border mt-0.5 flex-shrink-0 ${required ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}>
                {required && <Check size={10} className="text-indigo-600" />}
            </div>
            <span className="text-[9px] font-medium text-gray-500 leading-tight">
                {label} {required && <span className="text-red-500">*</span>}
            </span>
        </div>
    )
}