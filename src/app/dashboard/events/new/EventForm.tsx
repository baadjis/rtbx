'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, ArrowLeft, Loader2, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Data } from '../data'

export default function EventForm({ lang, userId }: { lang: 'fr' | 'en', userId: string }) {
  const t = Data[lang]
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const eventData = {
      organizer_id: userId,
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      max_capacity: formData.get('max_capacity') ? parseInt(formData.get('max_capacity') as string) : null,
      is_published: true // On publie directement
    }

    const { error } = await supabase.from('events').insert([eventData])

    if (!error) {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/events'), 1500)
    } else {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <Link href="/dashboard/events" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-indigo-600 transition-colors no-underline">
        <ArrowLeft size={18} /> {lang === 'fr' ? 'Annuler' : 'Cancel'}
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
        <div className="mb-10 text-center">
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Titre */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_title}</label>
              <input name="title" required placeholder="Ex: Masterclass E-commerce" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_desc}</label>
              <textarea name="description" rows={4} placeholder="Détaillez le programme..." className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" />
            </div>

            {/* Lieu */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_location}</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input name="location" required placeholder="Adresse ou lien visio" className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_start}</label>
                <input name="start_date" type="datetime-local" required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_end}</label>
                <input name="end_date" type="datetime-local" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
            </div>

            {/* Capacité */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_capacity}</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input name="max_capacity" type="number" placeholder="Illimité" className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
              </div>
            </div>

            <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : t.btn_create}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}