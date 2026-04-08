/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Zap, MousePointer2, Clock, CalendarRange, CheckCircle2, Mail, ImageIcon, Send, Loader2, Settings2, Upload, X, Info, Plus } from 'lucide-react'

export default function CommsTab({ event, participants, supabase, router, lang, t }: any) {
  const [loading, setLoading] = useState(false)
  const [sendingProgress, setSendingProgress] = useState<null | 'sending' | 'done'>(null)
  const [automationType, setAutomationType] = useState(event.badge_automation_type || 'manual')
  const [orgLogo, setOrgLogo] = useState<string | null>(event.org_logo_url || null)
  const [sponsors, setSponsors] = useState<string[]>(event.sponsors_data || [])
  const [usefulInfo, setUsefulInfo] = useState(event.useful_info || "")

  const handleSaveBranding = async () => {
    setLoading(true)
    await supabase.from('events').update({
      badge_automation_type: automationType,
      org_logo_url: orgLogo,
      sponsors_data: sponsors,
      useful_info: usefulInfo
    }).eq('id', event.id)
    alert(lang === 'fr' ? "Configuration sauvegardée !" : "Branding saved!")
    setLoading(false)
    router.refresh()
  }

  const handleFileUpload = (e: any, target: 'org' | 'sponsor') => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (target === 'org') setOrgLogo(reader.result as string)
        else if (sponsors.length < 4) setSponsors([...sponsors, reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const sendAllBadges = async () => {
    if (!confirm(lang === 'fr' ? "Lancer l'envoi groupé ?" : "Start bulk sending?")) return
    setSendingProgress('sending'); setLoading(true)
    const res = await fetch("/api/events/send-badges", {
      method: "POST",
      body: JSON.stringify({ eventId: event.id, orgLogo, sponsors, lang })
    })
    if (res.ok) setSendingProgress('done')
    setLoading(false)
    setTimeout(() => setSendingProgress(null), 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500 text-gray-900 dark:text-white">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Zap className="text-indigo-600" /> {t.automation_title}</h3>
          <div className="space-y-3">
            {[{ id: 'manual', label: t.opt_manual, icon: MousePointer2 }, { id: 'immediate', label: t.opt_immediate, icon: Zap }, { id: 'scheduled', label: t.opt_scheduled, icon: Clock }].map((opt) => (
              <button key={opt.id} onClick={() => setAutomationType(opt.id)} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all bg-transparent cursor-pointer ${automationType === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-50 dark:border-slate-800 opacity-60'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm"><opt.icon size={20} /></div>
                  <span className="font-bold text-sm">{opt.label}</span>
                </div>
                {automationType === opt.id && <CheckCircle2 size={18} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-4 flex items-center gap-3"><Send className="text-indigo-600" /> {t.bulk_badge_title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-8">{t.bulk_badge_desc}</p>
          <button onClick={sendAllBadges} disabled={loading || participants.length === 0} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 border-none cursor-pointer disabled:opacity-50">
            {loading && sendingProgress === 'sending' ? <Loader2 className="animate-spin" /> : <Send size={20} />} {t.btn_send_all.replace('{n}', participants.length)}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8">
        <h3 className="text-xl font-black mb-2 flex items-center gap-3 uppercase tracking-tight"><Settings2 className="text-indigo-600" /> {t.comm_title}</h3>
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_logo}</label>
          <div className="relative w-28 h-28 bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors group">
            {orgLogo ? <img src={orgLogo} className="object-contain w-full h-full" alt="Org" /> : <Upload size={24} className="text-gray-300" />}
            <input type="file" onChange={(e) => handleFileUpload(e, 'org')} className="absolute inset-0 opacity-0 cursor-pointer" />
            {orgLogo && <button onClick={() => setOrgLogo(null)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_sponsors}</label>
          <div className="grid grid-cols-4 gap-4">
            {sponsors.map((s, i) => (
              <div key={i} className="relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group shadow-sm">
                <img src={s} className="object-contain w-full h-full p-1" alt="Sponsor" />
                <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"><X size={20} /></button>
              </div>
            ))}
            {sponsors.length < 4 && (<div className="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-indigo-400 group"><Plus size={24} className="text-gray-300 group-hover:text-indigo-400" /><input type="file" onChange={(e) => handleFileUpload(e, 'sponsor')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>)}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Info size={14} /> {t.label_useful_info}</label>
          <textarea value={usefulInfo} onChange={(e) => setUsefulInfo(e.target.value)} placeholder="WiFi, Parking, Accès..." rows={3} className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium dark:text-white leading-relaxed" />
        </div>
        <button onClick={handleSaveBranding} disabled={loading} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-xl hover:shadow-indigo-500/50 transition-all border-none cursor-pointer uppercase text-xs tracking-widest">{t.btn_save_branding}</button>
      </div>
    </div>
  )
}