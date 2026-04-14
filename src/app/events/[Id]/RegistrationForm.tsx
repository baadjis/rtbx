/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Loader2, CheckCircle2, Send, Printer, 
  Building2, UserSquare2, Info, ShieldCheck, 
  ChevronRight, ExternalLink 
} from 'lucide-react'
import Link from 'next/link'

export default function RegistrationForm({ eventId, lang, t, eventConfig, origin }: { 
  eventId: string, 
  lang: string, 
  t: any,
  origin: string,
  eventConfig: any
}) {
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  
  // États pour les consentements
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [discoveryOptIn, setDiscoveryOptIn] = useState(false)
  const [merchantOptIn, setMerchantOptIn] = useState(false)

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) return; // Sécurité supplémentaire

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const payload: any = {
      eventId,
      name: formData.get('name'),
      email: formData.get('email'),
      lang,
      origin,
      company_name: formData.get('company_name') || null,
      professional_role: formData.get('professional_role') || null,
      custom_data: {},
      // Envoi des consentements à l'API
      opt_in_discovery: discoveryOptIn,
      opt_in_merchant: merchantOptIn
    };

    if (eventConfig.form_config) {
      eventConfig.form_config.forEach((field: any) => {
        payload.custom_data[field.label] = formData.get(`custom_${field.id}`);
      });
    }
    
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setTicket(result.ticketCode);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert(lang === 'fr' ? "Erreur : " + err.message : "Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (ticket) return (
    <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-green-100 dark:border-green-900/30 text-center animate-in zoom-in duration-500">
      <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.success_msg}</h2>
      
      <div className="bg-white p-6 rounded-3xl inline-block my-8 shadow-inner border border-gray-100">
        <QRCodeCanvas value={ticket} size={200} level="H" />
      </div>
      
      <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mb-8 uppercase tracking-widest">Ticket ID: {ticket}</p>
      <button onClick={() => window.print()} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all border-none cursor-pointer">
        <Printer size={20} /> {lang === 'fr' ? 'Imprimer / Capture' : 'Print / Screenshot'}
      </button>
    </div>
  )

  return (
    <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 transition-colors">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{t.register_title}</h2>
      <p className="text-gray-500 dark:text-slate-400 font-medium mb-8 text-sm">{t.register_sub}</p>
      
      <form onSubmit={handleRegister} className="space-y-5">
        
        {/* --- CHAMPS FIXES --- */}
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">{t.label_name}</label>
            <input name="name" required placeholder={t.ph_name} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">Email</label>
            <input name="email" type="email" required placeholder="nom@exemple.com" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
        </div>

        {/* --- CHAMPS OPTIONNELS --- */}
        {eventConfig.ask_company && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
               <Building2 size={12}/> {lang === 'fr' ? "Entreprise" : "Company"}
            </label>
            <input name="company_name" required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
          </div>
        )}

        {eventConfig.ask_professional_role && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
               <UserSquare2 size={12}/> {lang === 'fr' ? "Poste / Fonction" : "Job Title"}
            </label>
            <input name="professional_role" required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
          </div>
        )}

        {/* --- CHAMPS DYNAMIQUES --- */}
        {eventConfig.form_config && eventConfig.form_config.map((field: any) => (
          <div key={field.id} className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">
               {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input 
              name={`custom_${field.id}`} 
              type={field.type} 
              required={field.required}
              placeholder={field.label}
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" 
            />
          </div>
        ))}

        {/* --- SECTION LÉGALE & CONSENTEMENTS --- */}
        <div className="pt-6 space-y-4 border-t border-gray-50 dark:border-slate-800 mt-6">
            
            {/* 1. Terms & Privacy (Obligatoire) */}
            <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                    <input 
                        type="checkbox" required checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-200 dark:border-slate-700 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
                    />
                    <CheckCircle2 size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                      {t.legal_accept}{' '}
                    <Link href="/terms" className="text-indigo-600 font-bold hover:underline">Conditions</Link>{' '}
                       {t.legal_and}{' '}
                    <Link href="/privacy" className="text-indigo-600 font-bold hover:underline">Politique de Confidentialité</Link>.
                </span>
            </label>

            {/* 2. Discovery Pool (Uniquement si Public) */}
            {eventConfig.visibility === 'public' && (
                <label className="flex items-start gap-3 cursor-pointer group p-3 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-50 dark:border-indigo-900/20">
                    <div className="relative mt-1">
                        <input 
                            type="checkbox" checked={discoveryOptIn}
                            onChange={(e) => setDiscoveryOptIn(e.target.checked)}
                            className="peer h-5 w-5 appearance-none rounded-md border-2 border-indigo-200 dark:border-indigo-800 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
                        />
                        <CheckCircle2 size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-xs text-indigo-900 dark:text-indigo-300 font-bold leading-snug">
                        {t.discovery_opt_in}
                    </span>
                </label>
            )}

            {/* 3. Merchant Opt-in (Toujours proposé) */}
            <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                    <input 
                        type="checkbox" checked={merchantOptIn}
                        onChange={(e) => setMerchantOptIn(e.target.checked)}
                        className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-200 dark:border-slate-700 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
                    />
                    <CheckCircle2 size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                      {t.merchant_opt_in}
                </span>
            </label>
        </div>

        <div className="pt-4">
            <button 
                disabled={loading || !acceptedTerms} 
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 border-none cursor-pointer active:scale-95"
            >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {t.btn_register}
            </button>
        </div>

        <p className="text-[10px] text-gray-400 font-medium text-center italic mt-4 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> {t.security_note}
        </p>
      </form>
    </div>
  )
}