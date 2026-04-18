'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { FileText, ArrowLeft, Loader2, Globe, Lock, Layout } from 'lucide-react'
import Link from 'next/link'

export default function NewFormPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const { data, error } = await supabase.from('forms').insert([{
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      visibility: formData.get('visibility'),
      fields_json: [], // Vide par défaut, on le fera dans l'onglet Design
      is_published: false
    }]).select().single()

    if (!error) router.push(`/dashboard/forms/${data.id}`)
    else { alert(error.message); setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Link href="/dashboard/forms" className="flex items-center gap-2 text-gray-400 font-bold mb-8 no-underline">
        <ArrowLeft size={18} /> Retour
      </Link>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">Nouveau Formulaire</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="title" required placeholder="Nom du sondage (ex: Satisfaction Client)" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
          
          <textarea name="description" placeholder="Description (optionnelle)" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium dark:text-white" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="category" className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white appearance-none">
              <option value="satisfaction">😊 Satisfaction</option>
              <option value="survey">📊 Sondage</option>
              <option value="lead">👤 Contact / Lead</option>
            </select>

            <select name="visibility" className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-indigo-600 appearance-none">
              <option value="public">🌍 Public (Listé)</option>
              <option value="private">🔒 Privé (Lien direct)</option>
            </select>
          </div>

          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Layout size={20} />} Créer et passer au Design
          </button>
        </form>
      </div>
    </div>
  )
}