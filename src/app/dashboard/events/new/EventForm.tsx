/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, MapPin, Users, ArrowLeft, 
  Loader2, CheckCircle2, Globe, Lock, 
  Tag, Ticket, ArrowRight 
} from 'lucide-react'
import Link from 'next/link'
import { Data } from '../data'

export default function EventForm({ lang, userId }: { lang: 'fr' | 'en', userId: string }) {
  const t = Data[lang]
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      visibility: formData.get('visibility'),
      requires_registration: formData.get('requires_registration') === 'true',
      location: formData.get('location'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      max_capacity: formData.get('max_capacity'),
    }

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true)
        // REDIRECTION DIRECTE VERS LA PAGE ADMIN DE L'ÉVÉNEMENT
        setTimeout(() => router.push(`/dashboard/events/${result.id}`), 1500)
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert(lang === 'fr' ? "Erreur : " + err.message : "Error: " + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <Link href="/dashboard/events" className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors no-underline">
        <ArrowLeft size={18} /> {lang === 'fr' ? 'Annuler' : 'Cancel'}
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 transition-colors">
        <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {t.new_title}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">{t.new_sub}</p>
        </div>

        {success ? (
          <div className="py-20 text-center space-y-4 animate-in zoom-in">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.success_create}</h2>
            <p className="text-gray-400 font-medium animate-pulse">Redirection</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Tag size={14} /> {t.label_category}
                  </label>
                  <select name="category" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none">
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
                  <select name="visibility" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none text-indigo-600 dark:text-indigo-400">
                    <option value="public">{t.opt_public}</option>
                    <option value="private">{t.opt_private}</option>
                  </select>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_title}</label>
                  <input name="title" required placeholder="Ex: Masterclass E-commerce" className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-lg dark:text-white" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_desc}</label>
                  <textarea name="description" rows={5} placeholder="Détaillez le programme..." className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white leading-relaxed" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <MapPin size={14} /> {t.label_location}
                  </label>
                  <input name="location" required placeholder="Adresse ou lien visio" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Ticket size={14} /> {t.label_registration}
                  </label>
                  <select name="requires_registration" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none">
                    <option value="true">{t.opt_reg_yes}</option>
                    <option value="false">{t.opt_reg_no}</option>
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-gray-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-2">{t.label_start}</label>
                <input name="start_date" type="datetime-local" required className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_end}</label>
                <input name="end_date" type="datetime-local" className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Users size={14} /> {t.label_capacity}
              </label>
              <input name="max_capacity" type="number" placeholder="Illimité" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                <button disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 border-none cursor-pointer">
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                {t.btn_create}
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}