/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Save, Loader2, CheckCircle2, ArrowLeft, Settings2, Plus, Link2, Trash2 } from 'lucide-react'
import { Data } from '../../tools/digital-id/data' // On peut réutiliser les traductions settings
import { get_social_config } from '@/utils/social-config'
import { LangType } from '@/lib/lang/types'

export default function EditSpaceClient({ space, lang, token }: any) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [links, setLinks] = useState<any[]>([{ id: crypto.randomUUID(), network: 'Instagram', handle: '' }])
  
  const router = useRouter()
  const t= Data[lang as LangType]
  // On initialise l'état avec les données existantes du Space
  const [formData, setFormData] = useState({
    organization_name: space.organization_name || '',
    social_data: space.social_data || [],
    theme_color: space.theme_color || '#4f46e5',
    bg_color: space.bg_color || '#ffffff'
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

    const SOCIAL_CONFIG = get_social_config(lang)
  

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    let cleanValue = value
    if (field === 'handle' && value.startsWith('@')) {
        cleanValue = value.substring(1)
    }
    newLinks[index] = { ...newLinks[index], [field]: cleanValue }
    setLinks(newLinks)
  }

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('spaces')
      .update({
        organization_name: formData.organization_name,
        social_data: formData.social_data,
        theme_color: formData.theme_color,
        bg_color: formData.bg_color,
        updated_at: new Date().toISOString()
      })
      .eq('edit_token', token) // Sécurité par le token

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
          setSuccess(false)
          router.refresh()
      }, 3000)
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {lang === 'fr' ? 'Modifier mon Espace' : 'Edit my Space'}
        </h1>
        <p className="text-gray-500 mt-2">ID: {space.id}</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-8">
        
        {/* Nom de l'organisation (si applicable) */}
        {space.account_type === 'organization' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_name}</label>
            <input 
              value={formData.organization_name}
              onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white"
            />
          </div>
        )}

        {/* Note : Tu peux ici ajouter la gestion des liens sociaux (social_data) 
            en réutilisant la logique de mapping qu'on a fait pour le DigitalIDForm */}
        

        <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Link2 size={14}/> {t.label_socials || "Réseaux Sociaux"}</label>
                        {links.map((link, i) => {
                          const networkConfig = SOCIAL_CONFIG[link.network as keyof typeof SOCIAL_CONFIG];
                          return(
                            <div key={link.id} className="flex flex-col p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-gray-100 dark:border-slate-700 gap-3 animate-in fade-in">
                                <div className="flex gap-2">
                                    <select value={link.network} onChange={e => updateLink(i, 'network', e.target.value)} className="flex-1 p-3 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white">
                                        {Object.keys(SOCIAL_CONFIG).map(net => <option key={net} value={net}>{net}</option>)}
                                    </select>
                                    <button onClick={() => setLinks(links.filter((_, idx) => idx !== i))} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border-none cursor-pointer hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={18}/></button>
                                </div>
                                <input value={link.handle} onChange={
                                  (e) => updateLink(i, 'handle', e.target.value)} placeholder={networkConfig.ph || t.ph_handle } className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl font-bold text-sm dark:text-white focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        )})}
                        <button onClick={() => setLinks([...links, { id: crypto.randomUUID(), network: 'Instagram', handle: '' }])} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold hover:border-indigo-400 transition-all bg-transparent cursor-pointer">
                            <Plus size={18} /> {t.btn_add_net}
                        </button>
                      </div>
        <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {success ? (lang === 'fr' ? 'Modifications enregistrées !' : 'Changes saved!') : (lang === 'fr' ? 'Mettre à jour' : 'Update now')}
            </button>
        </div>
      </form>

      {/* Bouton pour voir le résultat */}
      <div className="text-center">
        <a href={`/@/${space.slug || space.id}`} className="text-indigo-600 font-bold hover:underline">
            {lang === 'fr' ? 'Voir mon Space public' : 'View my public Space'} →
        </a>
      </div>
    </div>
  )
}