'use client'
import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Data } from './data';

export default function ContactForm({ lang, formId }: { lang: 'fr' | 'en', formId: string }) {
  const t = Data[lang];
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setStatus("sending");
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 transition-colors">
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>
        
        <h1 className="text-3xl font-black text-center mb-2 text-gray-900 dark:text-white leading-tight">
          {t.title}
        </h1>
        <p className="text-center text-gray-500 dark:text-slate-400 font-medium mb-10 text-sm">
          {t.sub}
        </p>
        
        {status === "success" && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl font-bold border border-green-100 dark:border-green-900/30 flex items-center gap-3 animate-in fade-in zoom-in">
            <CheckCircle2 size={20} /> {t.msg_success}
          </div>
        )}

        {status === "error" && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl font-bold border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-in shake">
            <AlertCircle size={20} /> {t.msg_error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">
              {t.label_email}
            </label>
            <input 
              name="email" 
              type="email" 
              placeholder={t.ph_email}
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">
              {t.label_msg}
            </label>
            <textarea 
              name="message" 
              placeholder={t.ph_msg}
              rows={5} 
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 dark:text-white transition-colors"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === "sending"} 
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {status === "sending" ? (
              <> <Loader2 className="animate-spin" /> {t.btn_sending} </>
            ) : (
              <> <Send size={20} /> {t.btn_send} </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}