/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Layout, FileText, Building2, Tag, Eye, Sparkles } from 'lucide-react'
import { Data } from '../data'

const CATEGORIES = [
  { value: 'survey',       emoji: '📊' },
  { value: 'satisfaction', emoji: '😊' },
  { value: 'feedback',     emoji: '💬' },
  { value: 'registration', emoji: '📝' },
  { value: 'event',        emoji: '🎉' },
  { value: 'application',  emoji: '📋' },
  { value: 'order',        emoji: '🛒' },
  { value: 'other',        emoji: '✨' },
]

export default function NewFormClient({ lang, suggestions }: any) {
  const t = Data[lang as 'fr' | 'en']
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orgType, setOrgType] = useState('suggestion')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const finalOrgName = orgType === 'suggestion'
      ? formData.get('org_suggest')
      : formData.get('org_custom');

    const payload = {
      title: formData.get('title'),
      description: formData.get('description') || null,
      category: formData.get('category'),
      visibility: formData.get('visibility'),
      org_name: finalOrgName,
    };

    try {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/dashboard/forms/${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert(lang === 'fr' ? "Erreur : " + err.message : "Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">

      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto">
          <Sparkles size={24} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black dark:text-white tracking-tight">
          {t.new_form}
        </h1>
        <p className="text-gray-400 dark:text-slate-500 text-sm font-medium max-w-md mx-auto">
          {lang === 'fr'
            ? 'Configurez les informations de base, vous pourrez ajouter vos questions ensuite.'
            : 'Set up the basic info, you can add your questions next.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
              <FileText size={12} /> {lang === 'fr' ? 'Titre' : 'Title'}
            </label>
            <input
              name="title"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={lang === 'fr' ? 'Ex: Sondage de satisfaction client' : 'Ex: Customer satisfaction survey'}
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              {lang === 'fr' ? 'Description' : 'Description'}
              <span className="text-gray-300 dark:text-slate-600 normal-case font-medium ml-1">
                ({lang === 'fr' ? 'optionnel' : 'optional'})
              </span>
            </label>
            <textarea
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder={lang === 'fr'
                ? 'Quelques mots pour présenter votre formulaire à vos répondants...'
                : 'A few words to introduce your form to respondents...'}
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Organisateur */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
              <Building2 size={12} /> {t.organism_social_reason}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                onChange={(e) => setOrgType(e.target.value)}
                className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="suggestion">✨ {t.use_suggestion}</option>
                <option value="custom">✍️ {t.type_another_name}</option>
              </select>
              {orgType === 'suggestion' ? (
                <select name="org_suggest" className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border-none rounded-2xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
                  {suggestions.map((s: string) => <option key={s} value={s}>{s}</option>)}
                  {suggestions.length === 0 && <option value="RetailBox User">{t.my_account}</option>}
                </select>
              ) : (
                <input
                  name="org_custom"
                  required
                  placeholder={t.entity_name}
                  className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>

          {/* Catégorie + Visibilité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                <Tag size={12} /> {lang === 'fr' ? 'Catégorie' : 'Category'}
              </label>
              <select
                name="category"
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {(t as any)[`category_${cat.value}`] || cat.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                <Eye size={12} /> {lang === 'fr' ? 'Visibilité' : 'Visibility'}
              </label>
              <select
                name="visibility"
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="public">🌍 Public</option>
                <option value="private">🔒 {t.private}</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading || !title}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-none cursor-pointer mt-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Layout size={20} />}
            {t.btn_new}
          </button>

          <p className="text-center text-[10px] text-gray-400 dark:text-slate-600 font-medium">
            {lang === 'fr'
              ? 'Vous pourrez ajouter vos questions juste après'
              : "You'll be able to add your questions right after"}
          </p>
        </form>
      </div>
    </div>
  )
}