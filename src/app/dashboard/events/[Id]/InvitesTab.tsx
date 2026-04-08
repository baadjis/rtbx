/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { UserPlus, Mail, RefreshCw, Loader2, Users, ClipboardList } from 'lucide-react'
import UniversalImporter from '@/components/shared/UniversalImporter'

export default function InvitesTab({ event, invitations, supabase, router, lang, t }: any) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBulk, setShowBulk] = useState(false)

  // --- LOGIQUE INVITATION UNIQUE ---
  const handleSendInvite = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    setLoading(true)
    try {
      const token = window.crypto.randomUUID()
      const { error } = await supabase.from('event_invitations').insert([{
        event_id: event.id, 
        email: inviteEmail.trim().toLowerCase(), 
        token: token, 
        status: 'pending'
      }])
      if (!error) { 
        setInviteEmail('')
        router.refresh() 
      } else { throw error }
    } catch (err: any) { 
      alert(err.message) 
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIQUE IMPORT MASSIF ---
  const handleBulkImport = async (data: any[]) => {
    setLoading(true)
    try {
      // On prépare les lignes pour Supabase avec des tokens uniques
      const invitesToInsert = data.map(item => ({
        event_id: event.id,
        email: item.email.trim().toLowerCase(),
        token: window.crypto.randomUUID(),
        status: 'pending'
        // On pourrait aussi sauver le nom/entreprise si tu ajoutes les colonnes à la table invitations
      }))

      const { error, count } = await supabase
        .from('event_invitations')
        .insert(invitesToInsert)

      if (error) throw error

      alert(t.import_success.replace('{n}', data.length))
      setShowBulk(false)
      router.refresh()
    } catch (err: any) {
      alert("Erreur lors de l'import : " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* 1. SÉLECTEUR DE MÉTHODE (UX CHOIX) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setShowBulk(false)}
          className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${!showBulk ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-lg' : 'border-gray-100 dark:border-slate-800 bg-transparent opacity-60'}`}
        >
          <div className={`p-3 rounded-xl ${!showBulk ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <UserPlus size={20} />
          </div>
          <div className="text-left">
            <p className="font-black uppercase text-[10px] tracking-widest text-gray-400">Méthode 1</p>
            <p className="font-bold dark:text-white">Invitation Unique</p>
          </div>
        </button>

        <button 
          onClick={() => setShowBulk(true)}
          className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${showBulk ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-lg' : 'border-gray-100 dark:border-slate-800 bg-transparent opacity-60'}`}
        >
          <div className={`p-3 rounded-xl ${showBulk ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <ClipboardList size={20} />
          </div>
          <div className="text-left">
            <p className="font-black uppercase text-[10px] tracking-widest text-gray-400">Méthode 2</p>
            <p className="font-bold dark:text-white">Importation Massive</p>
          </div>
        </button>
      </div>

      {/* 2. AFFICHAGE CONDITIONNEL */}
      {!showBulk ? (
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-xl text-center animate-in slide-in-from-left-8 duration-500">
          <h3 className="text-3xl font-black mb-4 dark:text-white italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {t.tab_invites_title}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium mb-10">{t.remind_info}</p>
          <form onSubmit={handleSendInvite} className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder={t.invite_email} 
              value={inviteEmail} 
              onChange={e => setInviteEmail(e.target.value)} 
              required 
              className="flex-1 p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all" 
            />
            <button disabled={loading} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all border-none cursor-pointer whitespace-nowrap active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={18} /> {t.btn_send_invite}</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-8 duration-500">
          <UniversalImporter 
            title={t.bulk_invite_title}
            description={t.bulk_invite_desc}
            requiredFields={['email']}
            availableFields={[
              { value: 'email', label: t.label_email },
              { value: 'full_name', label: t.label_name },
              { value: 'company', label: t.label_company }
            ]}
            lang={lang}
            onImport={handleBulkImport}
          />
        </div>
      )}

      {/* 3. HISTORIQUE (LISTE) */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                <Users size={16} />
             </div>
             <h4 className="font-black uppercase tracking-widest text-gray-900 dark:text-white text-xs">Historique des invitations ({invitations.length})</h4>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {invitations.map((invite: any) => (
            <div key={invite.id} className="p-6 flex justify-between items-center group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                <span className="font-bold dark:text-white">{invite.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${invite.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {invite.status === 'accepted' ? 'Acceptée' : t.invite_status_pending}
                </span>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
                    <RefreshCw size={16} />
                </button>
              </div>
            </div>
          ))}
          {invitations.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-medium">
               {lang=='fr'?"Aucune invitation envoyée.":"No invitation sent yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}