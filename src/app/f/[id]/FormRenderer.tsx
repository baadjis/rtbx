/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Send, ArrowRight, ArrowLeft, Star } from 'lucide-react'
import PhoneField from '@/components/PhoneField'
import Image from 'next/image'
// =====================================================
// FIELD RENDERER — un champ unique, réutilisé classic/animated
// =====================================================
function FieldRenderer({ field, value, onChange, lang }: any) {
  const f = field

  switch (f.type) {
    case 'range':
      return (
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
          <input
            type="range"
            min={f.range_settings?.min ?? 0}
            max={f.range_settings?.max ?? 10}
            value={value ?? f.range_settings?.min ?? 0}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>{f.range_settings?.min_label}</span>
            <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
              {value ?? f.range_settings?.min ?? 0}
            </span>
            <span>{f.range_settings?.max_label}</span>
          </div>
        </div>
      )

    case 'stars': {
      const maxStars = f.star_settings?.max_stars || 5
      return (
        <div className="flex items-center justify-center gap-2 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
          {Array.from({ length: maxStars }).map((_, i) => {
            const filled = value && i < value
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i + 1)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={36}
                  className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-slate-700'}
                />
              </button>
            )
          })}
        </div>
      )
    }

    case 'nps':
      return (
        <div className="space-y-3 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
          <div className="flex gap-1.5 flex-wrap justify-center">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className={`w-9 h-9 rounded-xl text-xs font-black border-2 transition-all ${
                  value === i
                    ? 'bg-indigo-600 border-indigo-600 text-white scale-110'
                    : i <= 6 ? 'border-red-200 text-red-500 hover:bg-red-50'
                    : i <= 8 ? 'border-yellow-200 text-yellow-500 hover:bg-yellow-50'
                    : 'border-green-200 text-green-500 hover:bg-green-50'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
            <span>{lang === 'fr' ? 'Pas du tout' : 'Not at all'}</span>
            <span>{lang === 'fr' ? 'Absolument' : 'Extremely'}</span>
          </div>
        </div>
      )

    case 'select':
      return (
        <select
          required={f.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
        >
          <option value="">-- {lang === 'fr' ? 'Choisir' : 'Choose'} --</option>
          {(f.options || []).map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      )

    case 'multiselect': {
      const selected: string[] = Array.isArray(value) ? value : []
      const toggle = (opt: string) => {
        if (selected.includes(opt)) onChange(selected.filter(s => s !== opt))
        else onChange([...selected, opt])
      }
      return (
        <div className="space-y-2">
          {(f.options || []).map((opt: string) => (
            <label key={opt}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selected.includes(opt)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50'
              }`}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-5 h-5 accent-indigo-600"
              />
              <span className="font-bold text-sm text-gray-800 dark:text-white">{opt}</span>
            </label>
          ))}
        </div>
      )
    }

    case 'image_choice':
      return (
        <div className="grid grid-cols-2 gap-3">
          {(f.options || []).map((opt: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(opt.label)}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                value === opt.label
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-100 dark:border-slate-800'
              }`}
            >
              {opt.image_url ? (
                <Image src={opt.image_url} alt={opt.label} className="w-full h-28 object-cover" />
              ) : (
                <div className="w-full h-28 bg-gray-100 dark:bg-slate-800" />
              )}
              <div className={`absolute inset-0 flex items-end p-2 ${
                value === opt.label ? 'bg-indigo-600/20' : 'bg-black/0 hover:bg-black/10'
              } transition-colors`}>
                <span className="bg-white/90 dark:bg-slate-900/90 text-xs font-bold px-2 py-1 rounded-lg">
                  {opt.label}
                </span>
              </div>
              {value === opt.label && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )

    case 'date':
      return (
        <input
          type="date"
          required={f.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      )

    case 'phone':
      return (
        <div className="p-1">
          <PhoneField
            phone={value || ''}
            setPhone={onChange}
            country={f.phone_settings?.default_country || 'FR'}
            t={{ phone: '' }}
          />
        </div>
      )

    default: // text, number, email
      return (
        <input
          type={f.type}
          required={f.required}
          placeholder={f.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      )
  }
}

// =====================================================
// SUCCESS SCREEN
// =====================================================
function SuccessScreen({ t }: any) {
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

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function FormRenderer({ form, lang, t, origin }: any) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [step, setStep] = useState(0)

  const fields = form.fields_json || []
  const mode = form.settings?.mode || 'classic'
  const isAnimated = mode === 'animated'
  const [sessionId, setSessionId] = useState<string | null>(null);

// Au mount — créer une entrée "started"
useEffect(() => {
  const trackStart = async () => {
    const res = await fetch(`/api/forms/${form.id}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: { userAgent: navigator.userAgent, language: lang }
      })
    });
    const data = await res.json();
    if (data.id) setSessionId(data.id); // ← garder l'id pour le submit
  };
  trackStart();
}, []);

  const updateAnswer = (label: string, value: any) => {
    setAnswers(prev => ({ ...prev, [label]: value }))
  }

  const submit = async () => {
    setStatus('loading')
    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          origin,
          session_id: sessionId,
          metadata: { userAgent: navigator.userAgent, language: lang },
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  if (status === 'success') return <SuccessScreen t={t} />

  // =====================================================
  // MODE ANIMATED — une question à la fois
  // =====================================================
  if (isAnimated) {
    const currentField = fields[step]
    const isLastStep = step === fields.length - 1
    const progress = ((step + 1) / fields.length) * 100

    const canGoNext = !currentField?.required || (
      answers[currentField.label] !== undefined &&
      answers[currentField.label] !== '' &&
      (!Array.isArray(answers[currentField.label]) || answers[currentField.label].length > 0)
    )

    const handleNext = () => {
      if (isLastStep) submit()
      else setStep(s => s + 1)
    }

    return (
      <div className="space-y-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>{step + 1} / {fields.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Current question */}
        <div key={currentField.id} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 min-h-[200px]">
          <label className="block text-2xl font-black text-gray-900 dark:text-white leading-snug">
            {currentField.label} {currentField.required && <span className="text-red-500">*</span>}
          </label>
          <FieldRenderer
            field={currentField}
            value={answers[currentField.label]}
            onChange={(v: any) => updateAnswer(currentField.label, v)}
            lang={lang}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center justify-center gap-2 px-5 py-4 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-2xl font-bold text-sm transition-all border-none cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || status === 'loading'}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 border-none cursor-pointer"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" /> : (
              isLastStep ? <><Send size={18} /> {t.submit_btn}</> : <>{lang === 'fr' ? 'Suivant' : 'Next'} <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // MODE CLASSIC — toutes les questions
  // =====================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        {fields.map((f: any) => (
          <div key={f.id} className="space-y-3">
            <label className="block text-lg font-bold text-gray-900 dark:text-white">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            <FieldRenderer
              field={f}
              value={answers[f.label]}
              onChange={(v: any) => updateAnswer(f.label, v)}
              lang={lang}
            />
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