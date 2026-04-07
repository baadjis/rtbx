/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { 
  Calendar, MapPin, Users, ArrowLeft, 
  Loader2, CheckCircle2, Save, Globe, 
  Lock, Tag, Ticket, Settings2 
} from 'lucide-react'
import Link from 'next/link'
import { Data } from '../../data'

export default function EditEventForm({ lang, event }: { lang: 'fr' | 'en', event: any }) {
  const t = Data[lang]
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const formatForInput = (isoString: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toISOString().slice(0, 16)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    const updatedData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      visibility: formData.get('visibility'),
      requires_registration: formData.get('requires_registration') === 'true',
      location: formData.get('location'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      max_capacity: formData.get('max_capacity') ? parseInt(formData.get('max_capacity') as string) : null,
    }

    const { error } = await supabase
      .from('events')
      .update(updatedData)
      .eq('id', event.id)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        router.push('/dashboard/events')
      }, 1500)
    } else {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 transition-colors duration-300 pb-24">
      
      {/* BOUTON RETOUR */}
      <Link href="/dashboard/events" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold mb-10 no-underline border-none">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
          <ArrowLeft size={18} />
        </div>
        {t.back_to_events}
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
        
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {t.edit_title}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium mt-2 uppercase tracking-widest text-xs">ID: #{event.id}</p>
        </div>

        {success ? (
          <div className="py-20 text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Mise à jour réussie</h2>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-10">
            
            {/* --- SECTION 1 : TYPE & VISIBILITÉ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Tag size={14} /> {t.label_category}
                  </label>
                  <select name="category" defaultValue={event.category} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none transition-colors">
                    <option value="sales">{t.cat_sales}</option>
                    <option value="training">{t.cat_training}</option>
                    <option value="networking">{t.cat_networking}</option>
                    <option value="other">{t.cat_other}</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Globe size={14} /> {t.label_visibility}
                  </label>
                  <select name="visibility" defaultValue={event.visibility} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none text-indigo-600 dark:text-indigo-400 transition-colors">
                    <option value="public">{t.opt_public}</option>
                    <option value="private">{t.opt_private}</option>
                  </select>
                </div>
            </div>

            {/* --- SECTION 2 : CONTENU --- */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_title}</label>
                <input name="title" defaultValue={event.title} required className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white text-lg transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_desc}</label>
                <textarea name="description" defaultValue={event.description} rows={6} className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white leading-relaxed transition-colors" />
              </div>
            </div>

            {/* --- SECTION 3 : LIEU & RÉSERVATIONS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <MapPin size={14} /> {t.label_location}
                </label>
                <input name="location" defaultValue={event.location} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Ticket size={14} /> {t.label_registration}
                </label>
                <select name="requires_registration" defaultValue={String(event.requires_registration)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none transition-colors">
                    <option value="true">{t.opt_reg_yes}</option>
                    <option value="false">{t.opt_reg_no}</option>
                </select>
              </div>
            </div>

            {/* --- SECTION 4 : DATELINE --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-2">{t.label_start}</label>
                <input name="start_date" type="datetime-local" defaultValue={formatForInput(event.start_date)} required className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_end}</label>
                <input name="end_date" type="datetime-local" defaultValue={formatForInput(event.end_date)} className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors" />
              </div>
            </div>

            {/* Capacité */}
            <div className="space-y-2 max-w-xs">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Users size={14} /> {t.label_capacity}
              </label>
              <input name="max_capacity" type="number" defaultValue={event.max_capacity} placeholder="Illimité" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white transition-colors" />
            </div>

            {/* BOUTON SAUVEGARDER */}
            <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
                <button 
                  type="submit"
                  disabled={loading} 
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/20 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border-none cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                  {loading ? (lang === 'fr' ? 'Enregistrement...' : 'Saving...') : t.btn_update}
                </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}