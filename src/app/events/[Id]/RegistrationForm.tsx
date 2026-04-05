/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { QRCodeCanvas } from 'qrcode.react'
import { Loader2, CheckCircle2, Send, Download, Printer } from 'lucide-react'

export default function RegistrationForm({ eventId, lang, t }: { eventId: string, lang: string, t: any }) {
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const { error } = await supabase.from('event_registrations').insert([{
      event_id: eventId,
      full_name: formData.get('name'),
      email: formData.get('email'),
      ticket_code: ticketCode
    }])

    if (!error) setTicket(ticketCode)
    else alert(error.message)
    setLoading(false)
  }

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
      <button onClick={() => window.print()} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all">
        <Printer size={20} /> {lang === 'fr' ? 'Imprimer / Capture' : 'Print / Screenshot'}
      </button>
    </div>
  )

  return (
    <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{t.register_title}</h2>
      <p className="text-gray-500 dark:text-slate-400 font-medium mb-8 text-sm">{t.register_sub}</p>
      
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_name}</label>
            <input name="name" required placeholder={t.ph_name} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
            <input name="email" type="email" required placeholder="nom@exemple.com" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors" />
        </div>
        <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          {t.btn_register}
        </button>
      </form>
    </div>
  )
}