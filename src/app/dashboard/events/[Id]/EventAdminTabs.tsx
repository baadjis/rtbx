/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, CalendarRange, FileText, 
  ImageIcon, Send, UserPlus, Globe, Lock, Loader2, 
  Settings2
} from 'lucide-react'

// Import des sous-composants
import OverviewTab from './OverviewTab'
import AgendaTab from './AgendaTab'
import RegistrationTab from './RegistrationTab'
import BadgesTab from './BadgesTab'
import InvitesTab from './InvitesTab'
import CommsTab from './CommsTab'
import Link from 'next/link'

export default function EventAdminTabs({ lang, event, agenda, participants, invitations, t }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'registration' | 'badges' | 'invites' | 'comms'>('overview')
  const [loading, setLoading] = useState(false)
  const [sendingProgress, setSendingProgress] = useState<null | 'sending' | 'done'>(null)
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // --- ÉTATS PARTAGÉS (Centralisés ici pour être accessibles par tous les onglets) ---
  
  // 1. Inscription (FormBuilder)
  const [askCompany, setAskCompany] = useState(event.ask_company || false)
  const [askProRole, setAskProRole] = useState(event.ask_professional_role || false)
  const [customFields, setCustomFields] = useState(event.form_config || [])

  // 2. Badges (BadgeBuilder)
  const [badgeFormat, setBadgeFormat] = useState(event.badge_format || 'A6')
  const [themeColor, setThemeColor] = useState(event.theme_color || '#4f46e5')
  const [badgeSettings, setBadgeSettings] = useState(event.badge_settings || {
    showPhoto: false, showCompany: true, showRole: true
  })

  // 3. Communications & Branding
  const [automationType, setAutomationType] = useState(event.badge_automation_type || 'manual')
  const [orgName, setOrgName] = useState(event.org_name || "")
  const [orgLogo, setOrgLogo] = useState<string | null>(event.org_logo_url || null)
  const [sponsors, setSponsors] = useState<string[]>(event.sponsors_data || [])
  const [usefulInfo, setUsefulInfo] = useState(event.useful_info || "")

  // --- LOGIQUE COMMUNE ---

  const handleSaveSettings = async () => {
    setLoading(true)
    const { error } = await supabase.from('events').update({
      ask_company: askCompany,
      ask_professional_role: askProRole,
      form_config: customFields,
      badge_format: badgeFormat,
      theme_color: themeColor,
      badge_settings: badgeSettings,
      badge_automation_type: automationType,
      org_name: orgName,
      org_logo_url: orgLogo,
      sponsors_data: sponsors,
      useful_info: usefulInfo
    }).eq('id', event.id)
    
    if (!error) {
      alert(lang === 'fr' ? "Configuration sauvegardée !" : "Settings saved!")
      router.refresh()
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  const togglePublish = async () => {
    if (event.is_published) {
        // Mode simple pour repasser en brouillon
        setLoading(true);
        await supabase.from('events').update({ is_published: false }).eq('id', event.id);
        router.refresh();
        setLoading(false);
        return;
    }

    // Mode complexe pour publier (déclenche les emails)
    setLoading(true);
    try {
        const res = await fetch("/api/events/publish", {
            method: "POST",
            body: JSON.stringify({ eventId: event.id, lang: lang })
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.invitationsSent > 0) {
                alert(lang === 'fr' 
                    ? `Événement publié ! ${data.invitationsSent} invitations envoyées.` 
                    : `Event published! ${data.invitationsSent} invitations sent.`);
            }
            router.refresh();
        }
    } catch (err) {
       console.log(err)
        alert("Erreur lors de la publication.");
    } finally {
        setLoading(false);
    }
};
  const sendAllBadges = async () => {
    if (!confirm(lang === 'fr' ? "Lancer l'envoi groupé ?" : "Start bulk sending?")) return
    setSendingProgress('sending'); setLoading(true)
    const res = await fetch("/api/events/send-badges", {
      method: "POST",
      body: JSON.stringify({ eventId: event.id, lang })
    })
    if (res.ok) setSendingProgress('done')
    setLoading(false)
    setTimeout(() => setSendingProgress(null), 3000)
  }

  // Objet regroupant toutes les props communes pour simplifier l'appel des onglets
  const tabProps = { lang, event, agenda, participants, invitations, t, supabase, router }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER DE PUBLICATION */}
      {/* --- HEADER : PUBLICATION & ÉDITION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${event.is_published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
            {event.is_published ? <Globe size={24} /> : <Lock size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-black dark:text-white leading-none">{event.title}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">
                {event.is_published ? t.status_live : t.status_draft}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* BOUTON MODIFIER (Lien vers la page edit) */}
          <Link 
            href={`/dashboard/events/${event.id}/edit`}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 no-underline border-none"
          >
            <Settings2 size={14} />
            {lang === 'fr' ? 'Modifier' : 'Edit'}
          </Link>

          {/* BOUTON PUBLIER / BROUILLON */}
          <button 
            onClick={togglePublish} 
            disabled={loading} 
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-lg ${
              event.is_published 
              ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : (event.is_published ? t.btn_unpublish : t.btn_publish)}
          </button>
        </div>
      </div>

      {/* TABS SWITCHER (6 ONGLET) */}
      <div className="w-full bg-gray-100 dark:bg-slate-900 p-1.5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-inner flex overflow-x-auto no-scrollbar items-center">
        {[
          { id: 'overview', icon: LayoutDashboard },
          { id: 'agenda', icon: CalendarRange },
          { id: 'registration', icon: FileText },
          { id: 'badges', icon: ImageIcon },
          { id: 'invites', icon: UserPlus },
          { id: 'comms', icon: Send }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-all border-none cursor-pointer whitespace-nowrap min-w-max md:min-w-0 ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md scale-[1.02]' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 bg-transparent'
            }`}
          >
            <tab.icon size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">{t[`tab_${tab.id}`]}</span>
          </button>
        ))}
      </div>

      {/* RENDU DES ONGLETS */}
      <div className="mt-8">
        {activeTab === 'overview' && <OverviewTab {...tabProps} />}
        
        {activeTab === 'agenda' && <AgendaTab {...tabProps} />}
        
        {activeTab === 'registration' && (
          <RegistrationTab 
            {...tabProps}
            askCompany={askCompany} setAskCompany={setAskCompany}
            askProRole={askProRole} setAskProRole={setAskProRole}
            customFields={customFields} setCustomFields={setCustomFields}
            handleSave={handleSaveSettings} loading={loading}
          />
        )}
        
        {activeTab === 'badges' && (
          <BadgesTab 
            {...tabProps}
            badgeFormat={badgeFormat} setBadgeFormat={setBadgeFormat}
            badgeSettings={badgeSettings} setBadgeSettings={setBadgeSettings}
            themeColor={themeColor} setThemeColor={setThemeColor}
            orgName={orgName} orgLogo={orgLogo}
            handleSave={handleSaveSettings} loading={loading}
          />
        )}

        {activeTab === 'invites' && <InvitesTab {...tabProps} />}

        {activeTab === 'comms' && (
          <CommsTab 
            {...tabProps}
            automationType={automationType} setAutomationType={setAutomationType}
            orgLogo={orgLogo} setOrgLogo={setOrgLogo}
            orgName={orgName} setOrgName={setOrgName}
            sponsors={sponsors} setSponsors={setSponsors}
            usefulInfo={usefulInfo} setUsefulInfo={setUsefulInfo}
            themeColor={themeColor}
            sendAllBadges={sendAllBadges}
            handleSave={handleSaveSettings}
            loading={loading}
            sendingProgress={sendingProgress}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}