/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { CheckCircle2, Loader2, Send, ArrowRight } from 'lucide-react'

export default function FormRenderer({ form, lang, t }: any) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const fields = form.fields_json || []

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          metadata: {
            userAgent: navigator.userAgent,
            language: lang
          }
        })
      })

      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
     console.log(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto shadow-xl border border-green-100 dark:border-green-800">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t.success_title}</h1>
        <p className="text-gray-500 dark:text-slate-400 font-medium">{t.success_msg}</p>
        <div className="pt-8">
            <a href="https://rtbx.space" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all no-underline">
                {t.back_to_site} <ArrowRight size={14} />
            </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        {fields.map((f: any) => (
          <div key={f.id} className="space-y-3">
            <label className="block text-lg font-bold text-gray-900 dark:text-white">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            
            {f.type === 'range' ? (
              <div className="space-y-4 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                <input 
                  type="range" 
                  min={f.range_settings.min} 
                  max={f.range_settings.max}
                  onChange={(e) => setAnswers({...answers, [f.label]: parseInt(e.target.value)})}
                  className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>{f.range_settings.min_label}</span>
                  <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                    {answers[f.label] || f.range_settings.min}
                  </span>
                  <span>{f.range_settings.max_label}</span>
                </div>
              </div>
            ) : f.type === 'select' ? (
              <select 
                required={f.required}
                onChange={(e) => setAnswers({...answers, [f.label]: e.target.value})}
                className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
              >
                <option value="">-- {lang === 'fr' ? 'Choisir' : 'Choose'} --</option>
                {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input 
                type={f.type}
                required={f.required}
                placeholder={f.placeholder}
                onChange={(e) => setAnswers({...answers, [f.label]: e.target.value})}
                className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border-none cursor-pointer"
        >
          {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          {status === 'loading' ? t.submitting : t.submit_btn}
        </button>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
            {t.required_info}
        </p>
      </div>
    </form>
  )
}