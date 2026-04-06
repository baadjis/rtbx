/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, CalendarRange, Send, Users, 
  Trash2, Plus, CheckCircle2, Clock, MapPin, 
  UserPlus, Mail, Loader2, RefreshCw, Star, ArrowRight,
  BarChart3, Settings2, ImageIcon, Info, Upload, X, ShieldCheck
} from 'lucide-react'

export default function EventAdminTabs({ lang, event, agenda, participants, invitations, t }: any) {
  // Navigation entre 4 onglets
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'invites' | 'comms'>('overview')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // --- ÉTATS FORMULAIRES ---
  const [newSession, setNewSession] = useState({ label: '', room_name: '', speakers: '', start: '', end: '' })
  const [inviteEmail, setInviteEmail] = useState('')
  const [orgLogo, setOrgLogo] = useState<string | null>(null)
  const [sponsors, setSponsors] = useState<string[]>([])
  const [usefulInfo, setUsefulInfo] = useState("")
  const [sendingProgress, setSendingProgress] = useState<null | 'sending' | 'done'>(null);

const sendAllBadges = async () => {
    if (!confirm(lang === 'fr' ? "Envoyer les badges à tous ?" : "Send badges to all?")) return;
    
    setSendingProgress('sending');
    setLoading(true);

    try {
        const response = await fetch("/api/events/send-badges", {
            method: "POST",
            body: JSON.stringify({
                eventId: event.id,
                orgLogo: orgLogo, // Ton state logo
                sponsors: sponsors, // Ton array de sponsors
                lang: lang
            })
        });

        if (response.ok) {
            setSendingProgress('done');
            alert(lang === 'fr' ? "Tous les emails ont été envoyés !" : "All emails sent!");
            router.refresh();
        }
    } catch (err) {
        alert("Erreur lors de l'envoi groupé.");
    } finally {
        setLoading(false);
        setTimeout(() => setSendingProgress(null), 3000);
    }
};

  // --- LOGIQUE AGENDA ---
  const handleAddSession = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('event_agenda').insert([{
      event_id: event.id,
      label: newSession.label,
      room_name: newSession.room_name,
      speakers: newSession.speakers.split(',').map(s => s.trim()).filter(s => s !== ''),
      start_time: newSession.start,
      end_time: newSession.end || null
    }])
    if (!error) {
      setNewSession({ label: '', room_name: '', speakers: '', start: '', end: '' })
      router.refresh()
    }
    setLoading(false)
  }

  const deleteSession = async (id: string) => {
    await supabase.from('event_agenda').delete().eq('id', id)
    router.refresh()
  }

  // --- LOGIQUE INVITATIONS (CORRIGÉE AVEC CRYPTO) ---
 const handleSendInvite = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/events/send-invite", {
        method: "POST",
        body: JSON.stringify({
          email: inviteEmail,
          eventId: event.id,
          lang: lang
        })
      });

      if (!response.ok) throw new Error("Failed to send email");

      setInviteEmail('');
      alert(lang === 'fr' ? "Invitation envoyée !" : "Invitation sent!");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
};
  // --- LOGIQUE BRANDING ---
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* 1. BARRE DE NAVIGATION (TABS) */}
      <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-[2rem] w-full md:w-fit mx-auto border border-gray-100 dark:border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: t.tab_overview, icon: LayoutDashboard },
          { id: 'agenda', label: t.tab_agenda, icon: CalendarRange },
          { id: 'invites', label: t.tab_invites, icon: Send },
          { id: 'comms', label: t.tab_comms, icon: Mail }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-none cursor-pointer ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 bg-transparent'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENU : OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title={t.stat_total} value={participants.length} icon={Users} color="indigo" />
            <StatsCard title={t.stat_checked} value={participants.filter((p:any) => p.checked_in).length} icon={CheckCircle2} color="emerald" />
            <StatsCard title={t.stat_capacity} value={event.max_capacity ? `${Math.round((participants.length/event.max_capacity)*100)}%` : '--'} icon={BarChart3} color="purple" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-gray-900 dark:text-white">{t.list_participants}</h3>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><Users size={20}/></div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full">
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {participants.map((p:any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-5 font-bold dark:text-white">{p.full_name}</td>
                      <td className="px-8 py-5 text-gray-500 dark:text-slate-400 text-sm font-medium">{p.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.checked_in ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {p.checked_in ? t.status_checked : t.status_registered}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENU : AGENDA --- */}
      {activeTab === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-500">
          <div className="lg:col-span-2 space-y-4">
            {agenda.length > 0 ? agenda.map((item:any) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex justify-between items-center group shadow-sm transition-all hover:shadow-md">
                <div className="flex gap-4">
                  <div className="text-center min-w-[80px] p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex flex-col justify-center">
                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase leading-none">{new Date(item.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.label}</h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {item.room_name && <span className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md"><MapPin size={10}/> {item.room_name}</span>}
                      {item.speakers?.map((s:string) => <span key={s} className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded-md"><Star size={10} fill="currentColor"/> {s}</span>)}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteSession(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Trash2 size={18}/></button>
              </div>
            )) : <div className="p-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800"><p className="text-gray-400 font-bold italic">Aucun programme défini.</p></div>}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 h-fit lg:sticky lg:top-24 shadow-xl">
             <h4 className="font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6 text-sm">{t.btn_add_session}</h4>
             <form onSubmit={handleAddSession} className="space-y-4">
                <input placeholder={t.label_session} value={newSession.label} onChange={e=>setNewSession({...newSession, label:e.target.value})} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
                <input placeholder={t.label_room} value={newSession.room_name} onChange={e=>setNewSession({...newSession, room_name:e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
                <input placeholder={t.label_speakers} value={newSession.speakers} onChange={e=>setNewSession({...newSession, speakers:e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
                <div className="grid grid-cols-2 gap-2">
                   <input type="datetime-local" value={newSession.start} onChange={e=>setNewSession({...newSession, start:e.target.value})} required className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-[10px] dark:text-white" />
                   <input type="datetime-local" value={newSession.end} onChange={e=>setNewSession({...newSession, end:e.target.value})} className="p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-[10px] dark:text-white" />
                </div>
                <button disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all border-none cursor-pointer">
                  {loading ? <Loader2 className="animate-spin mx-auto"/> : t.btn_add_session}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* --- CONTENU : INVITATIONS --- */}
      {activeTab === 'invites' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-xl text-center">
             <h3 className="text-3xl font-black mb-4 dark:text-white">{t.tab_invites}</h3>
             <p className="text-gray-500 dark:text-slate-400 font-medium mb-10 max-w-lg mx-auto">{t.remind_info}</p>
             <form onSubmit={handleSendInvite} className="flex flex-col md:flex-row gap-4">
                <input type="email" placeholder={t.invite_email} value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} required className="flex-1 p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
                <button disabled={loading} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
                  <UserPlus size={18}/> {t.btn_send_invite}
                </button>
             </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
             <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                <h4 className="font-black uppercase tracking-widest text-gray-400 text-xs">Historique des invitations</h4>
             </div>
             <div className="divide-y divide-gray-50 dark:divide-slate-800">
                {invitations.map((invite:any) => (
                  <div key={invite.id} className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                      <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold">{invite.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full">{t.invite_status_pending}</span>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors bg-transparent border-none cursor-pointer"><RefreshCw size={16}/></button>
                    </div>
                  </div>
                ))}
                {invitations.length === 0 && <p className="p-10 text-center text-gray-400 font-medium">Aucune invitation envoyée.</p>}
             </div>
          </div>
        </div>
      )}

      {/* --- CONTENU : COMMUNICATIONS & BRANDING (NEW) --- */}
      {activeTab === 'comms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500">
          
          {/* PARAMÈTRES EMAILS */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                    <Mail className="text-indigo-600" /> {t.auto_confirm_title}
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">{t.auto_confirm_desc}</p>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                    <ImageIcon className="text-indigo-600" /> {t.bulk_badge_title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">{t.bulk_badge_desc}</p>
                <button 
  onClick={sendAllBadges} 
  disabled={loading || participants.length === 0} 
  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
>
  {loading && sendingProgress === 'sending' ? (
    <> <Loader2 className="animate-spin" /> {lang === 'fr' ? 'Envoi en masse...' : 'Sending bulk...'} </>
  ) : (
    <> <Send size={20} /> {t.btn_send_all.replace('{n}', participants.length)} </>
  )}
</button>
                <p className="text-[10px] text-center mt-6 font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 py-2 rounded-lg">{t.msg_soon}</p>
            </div>
          </div>

          {/* BRANDING (Logos/Infos) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8 transition-colors">
                <h3 className="text-xl font-black mb-2 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
                    <Settings2 className="text-indigo-600" /> Branding du Badge
                </h3>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_logo}</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-colors hover:border-indigo-400">
                            {orgLogo ? <img src={orgLogo} className="object-contain w-full h-full" alt="Org" /> : <Upload size={24} className="text-gray-300"/>}
                            <input type="file" onChange={(e) => handleFileUpload(e, 'org')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_org_name}</label>
                           <input placeholder={t.ph_biz_name || "Nom de l'entreprise"} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.label_sponsors}</label>
                    <div className="grid grid-cols-4 gap-4">
                        {sponsors.map((s, i) => (
                            <div key={i} className="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden group shadow-sm transition-all hover:scale-105">
                                <img src={s} className="object-contain w-full h-full p-1" alt="Sponsor" />
                                <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"><X size={20} strokeWidth={3}/></button>
                            </div>
                        ))}
                        {sponsors.length < 4 && (
                            <div className="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center transition-colors hover:border-indigo-400 group">
                                <Plus size={24} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                <input type="file" onChange={(e) => handleFileUpload(e, 'sponsor')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Info size={14}/> {t.label_useful_info}</label>
                    <textarea value={usefulInfo} onChange={(e) => setUsefulInfo(e.target.value)} placeholder="Ex: WiFi: Guest_Pass / Parking gratuit au sous-sol..." rows={3} className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium dark:text-white leading-relaxed focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                <button className="w-full py-5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-black rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 border-none cursor-pointer uppercase text-xs tracking-widest">
                    {t.btn_save_branding}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- SOUS-COMPOSANT KPI ---
function StatsCard({ title, value, icon: Icon, color }: any) {
  const colors:any = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  }
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group transition-all duration-300 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900">
      <div className={`w-16 h-16 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-5xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
    </div>
  )
}