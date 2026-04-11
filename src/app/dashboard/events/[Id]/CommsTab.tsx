/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react'
import { 
  Zap, MousePointer2, Clock, CalendarRange, 
  CheckCircle2, Mail, ImageIcon, Send, 
  Loader2, Settings2, Upload, X, Info, 
  Plus, FileText, Layout, UserSquare2, Building2
} from 'lucide-react'
import FormBuilder from './FormBuilder'
import BadgeBuilder from '@/components/shared/BadgeBuilder'
import EventQRCode from './EventQRCodeBuilder'

export default function CommsTab({ event, participants, supabase, router, lang, t }: any) {
  const [loading, setLoading] = useState(false)
  const [sendingProgress, setSendingProgress] = useState<null | 'sending' | 'done'>(null)
  
  // --- ÉTATS ---
  const [automationType, setAutomationType] = useState(event.badge_automation_type || 'manual')
  const [badgeFormat, setBadgeFormat] = useState(event.badge_format || 'A6')
  const [badgeSettings, setBadgeSettings] = useState(event.badge_settings || {
    showPhoto: false,
    showCompany: true,
    showRole: true
})
  const [orgLogo, setOrgLogo] = useState<string | null>(event.org_logo_url || null)
  const [orgName, setOrgName] = useState(event.org_name || "")
  const [sponsors, setSponsors] = useState<string[]>(event.sponsors_data || [])
  const [usefulInfo, setUsefulInfo] = useState(event.useful_info || "")

  // --- NOUVEAUX ÉTATS POUR LA REGISTRATION ---
  const [askCompany, setAskCompany] = useState(event.ask_company || false)
  const [askProRole, setAskProRole] = useState(event.ask_professional_role || false)

  const [customFields, setCustomFields] = useState(event.form_config || [])
  const [themeColor, setThemeColor] = useState(event.theme_color || '#4f46e5')

  const handleSaveSettings = async () => {
    setLoading(true)
    const { error } = await supabase.from('events').update({
      badge_automation_type: automationType,
      badge_format: badgeFormat,
      org_name: orgName,
      org_logo_url: orgLogo,
      sponsors_data: sponsors,
      useful_info: usefulInfo,
      // Mise à jour des champs de formulaire
      badge_settings: badgeSettings,
      form_config: customFields
    }).eq('id', event.id)
    
    if (!error) {
        alert(lang === 'fr' ? "Configuration sauvegardée !" : "Configuration saved!")
        router.refresh()
    } else {
        alert(error.message)
    }
    setLoading(false)
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
    // 1. Demande de confirmation
    const confirmMsg = lang === 'fr' 
      ? "Lancer l'envoi groupé des badges à tous les inscrits ?" 
      : "Start bulk badge sending to all participants?";
    
    if (!confirm(confirmMsg)) return;

    setSendingProgress('sending');
    setLoading(true);

    try {
      // 2. Appel de l'API avec le minimum de données
      const res = await fetch("/api/events/send-badges", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: event.id, 
          lang: lang 
          // Note : orgLogo, sponsors et format ne sont plus nécessaires ici,
          // car l'API les récupère directement en base de données.
        })
      });

      if (res.ok) {
        setSendingProgress('done');
        // On rafraîchit les données pour voir les statuts "badge_sent" à jour
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(lang === 'fr' ? `Erreur : ${errorData.error}` : `Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Bulk sending error:", err);
      alert(lang === 'fr' ? "Une erreur technique est survenue lors de l'envoi." : "A technical error occurred during sending.");
    } finally {
      setLoading(false);
      // On masque le message de succès après 3 secondes
      setTimeout(() => setSendingProgress(null), 3000);
    }
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500 text-gray-900 dark:text-white">
      
      {/* COLONNE GAUCHE : AUTOMATISATION, FORMAT & FORMULAIRE */}
      <div className="space-y-6">

        <EventQRCode 
          eventId={event.id}
          themeColor={themeColor}
          logo={orgLogo}
          t={t}
          lang={lang}
        />
        
        {/* 1. CONFIGURATION DU FORMULAIRE (NOUVEAU) */}
        <FormBuilder  lang ={lang} t={t} 
  askCompany={askCompany} setAskCompany={setAskCompany}
  askProRole={askProRole} setAskProRole={setAskProRole}
  customFields={customFields} setCustomFields ={setCustomFields}/>

        {/* 2. CHOIX DU FORMAT BADGE */}
        <BadgeBuilder 
    t={t}
    badgeFormat={badgeFormat}
    setBadgeFormat={setBadgeFormat}
    badgeSettings={badgeSettings}
    setBadgeSettings={setBadgeSettings}
    themeColor={themeColor}
    setThemeColor={setThemeColor}
/>

        {/* 3. STRATÉGIE D'ENVOI */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Zap className="text-indigo-600" /> {t.automation_title}</h3>
          <div className="space-y-3">
            {[{ id: 'manual', label: t.opt_manual, icon: MousePointer2 }, { id: 'immediate', label: t.opt_immediate, icon: Zap }, { id: 'scheduled', label: t.opt_scheduled, icon: Clock }].map((opt) => (
              <button key={opt.id} onClick={() => setAutomationType(opt.id)} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all bg-transparent cursor-pointer ${automationType === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-50 dark:border-slate-800 opacity-60'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-gray-400"><opt.icon size={20} /></div>
                  <span className="font-bold text-sm">{opt.label}</span>
                </div>
                {automationType === opt.id && <CheckCircle2 size={18} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COLONNE DROITE : BRANDING */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8">
        <h3 className="text-2xl font-black mb-2 flex items-center gap-3 uppercase tracking-tight"><Settings2 className="text-indigo-600" /> {t.comm_title}</h3>
        
        {/* LOGO ORG */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_logo}</label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors group">
              {orgLogo ? <img src={orgLogo} className="object-contain w-full h-full" alt="Org" /> : <Upload size={24} className="text-gray-300" />}
              <input type="file" onChange={(e) => handleFileUpload(e, 'org')} className="absolute inset-0 opacity-0 cursor-pointer" />
              {orgLogo && <button onClick={() => setOrgLogo(null)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"><X size={12} /></button>}
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_name}</label>
              <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Raison sociale" className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
          </div>
        </div>

        {/* SPONSORS */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_sponsors}</label>
          <div className="grid grid-cols-4 gap-4">
            {sponsors.map((s, i) => (
              <div key={i} className="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden group shadow-sm">
                <img src={s} className="object-contain w-full h-full p-1" alt="Sponsor" />
                <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"><X size={20} /></button>
              </div>
            ))}
            {sponsors.length < 4 && (
              <div className="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-400 group transition-all">
                <Plus size={24} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                <input type="file" onChange={(e) => handleFileUpload(e, 'sponsor')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            )}
          </div>
        </div>

        {/* INFOS UTILES */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Info size={14} /> {t.label_useful_info}</label>
          <textarea value={usefulInfo} onChange={(e) => setUsefulInfo(e.target.value)} placeholder="WiFi, Parking, Accès..." rows={4} className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-3xl font-medium dark:text-white leading-relaxed focus:ring-2 focus:ring-indigo-500 transition-colors" />
        </div>

        {/* BOUTON DE SAUVEGARDE GLOBAL */}
        <button 
          onClick={handleSaveSettings} 
          disabled={loading} 
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-black shadow-xl hover:shadow-indigo-500/50 transition-all border-none cursor-pointer uppercase text-xs tracking-widest active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : t.btn_save_branding}
        </button>

        {/* BOUTON ENVOI MASSIF - Déplacé ici pour l'équilibre visuel */}
        <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
            <button 
              onClick={sendAllBadges} 
              disabled={loading || participants.length === 0} 
              className="w-full py-4 bg-white dark:bg-slate-800 text-indigo-600 border border-indigo-100 dark:border-indigo-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 disabled:opacity-30 cursor-pointer"
            >
              {loading && sendingProgress === 'sending' ? <Loader2 className="animate-spin" /> : <Send size={18} />} 
              {t.btn_send_all.replace('{n}', participants.length)}
            </button>
        </div>
      </div>
    </div>
  )
}