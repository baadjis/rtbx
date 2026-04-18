/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { Palette, Info, CheckCircle2 } from 'lucide-react'
import FormBuilder from '@/components/FormBuilder/FormBuilder'

const DICT = {
  fr: {
    design_title: "Design & Questions",
    design_sub: "Configurez l'ordre et le type de vos questions pour vos clients.",
    save_success: "Structure du formulaire mise à jour !",
    info_preview: "L'aperçu à droite simule l'affichage exact sur le smartphone de vos clients."
  },
  en: {
    design_title: "Design & Questions",
    design_sub: "Configure the order and type of your questions for your customers.",
    save_success: "Form structure updated successfully!",
    info_preview: "The preview on the right simulates the exact display on your customers' smartphones."
  }
}

export default function DesignTab({ form, lang, supabase, router }: any) {
  const t = DICT[lang as keyof typeof DICT] || DICT.fr
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Logique de sauvegarde des champs dans Supabase
  const handleSaveFields = async (updatedFields: any[]) => {
    setLoading(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('forms')
        .update({ 
          fields_json: updatedFields,
          updated_at: new Date().toISOString() 
        })
        .eq('id', form.id)

      if (!error) {
        setSuccess(true)
        router.refresh() // Met à jour les données serveur
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw error
      }
    } catch (err: any) {
      alert("Erreur lors de la sauvegarde : " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* HEADER DE L'ONGLET */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Palette className="text-indigo-600" /> {t.design_title}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mt-1">{t.design_sub}</p>
        </div>

        {success && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold text-xs border border-green-100 dark:border-green-800 animate-in zoom-in">
            <CheckCircle2 size={16} /> {t.save_success}
          </div>
        )}
      </div>

      {/* RAPPEL PÉDAGOGIQUE */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3 items-start">
        <Info className="text-blue-600 dark:text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed italic">
          {t.info_preview}
        </p>
      </div>

      {/* L'ÉDITEUR (Ton composant réutilisable) */}
      <div className="pt-4">
        <FormBuilder 
          initialFields={form.fields_json || []} 
          onSave={handleSaveFields} 
          lang={lang} 
          loading={loading}
        />
      </div>

      {/* FOOTER DE L'ONGLET (Optionnel : rappel de sécurité) */}
      <div className="pt-10 text-center opacity-30">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">RetailBox Form Engine v2.0</p>
      </div>

    </div>
  )
}