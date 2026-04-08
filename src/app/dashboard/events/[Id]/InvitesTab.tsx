/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { UserPlus, Mail, RefreshCw, Loader2 } from 'lucide-react'

export default function InvitesTab({ event, invitations, supabase, router, lang, t }: any) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendInvite = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    setLoading(true)
    try {
      const token = window.crypto.randomUUID()
      const { error } = await supabase.from('event_invitations').insert([{
        event_id: event.id, email: inviteEmail, token: token, status: 'pending'
      }])
      if (!error) { setInviteEmail(''); router.refresh() }
    } catch (err: any) { alert(err.message) }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-xl text-center">
        <h3 className="text-3xl font-black mb-4 dark:text-white italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{t.tab_invites_title}</h3>
        <p className="text-gray-500 dark:text-slate-400 font-medium mb-10">{t.remind_info}</p>
        <form onSubmit={handleSendInvite} className="flex flex-col md:flex-row gap-4">
          <input type="email" placeholder={t.invite_email} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required className="flex-1 p-5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
          <button disabled={loading} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all border-none cursor-pointer whitespace-nowrap">
            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={18} /> {t.btn_send_invite}</>}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest">Invitations envoyées</div>
        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {invitations.map((invite: any) => (
            <div key={invite.id} className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-3"><Mail size={16} className="text-indigo-600" /><span className="font-bold dark:text-white">{invite.email}</span></div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-600 px-3 py-1 rounded-full">{t.invite_status_pending}</span>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-none bg-transparent cursor-pointer"><RefreshCw size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}