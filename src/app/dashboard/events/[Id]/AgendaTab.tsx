/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { MapPin, Star, Trash2, Loader2 } from 'lucide-react'

export default function AgendaTab({ event, agenda, supabase, router, lang, t }: any) {
  const [loading, setLoading] = useState(false)
  const [newSession, setNewSession] = useState({ label: '', room_name: '', speakers: '', start: '', end: '' })

  const handleAddSession = async (e: React.FormEvent) => {
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
    if (!confirm(lang === 'fr' ? "Supprimer cette session ?" : "Delete this session?")) return
    await supabase.from('event_agenda').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-500">
      <div className="lg:col-span-2 space-y-4">
        {agenda.map((item: any) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex justify-between items-center group shadow-sm">
            <div className="flex gap-4">
              <div className="text-center min-w-[80px] p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex flex-col justify-center">
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase leading-none">
                  {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{item.label}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.room_name && <span className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md"><MapPin size={10} /> {item.room_name}</span>}
                  {item.speakers?.map((s: string) => <span key={s} className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded-md"><Star size={10} fill="currentColor" /> {s}</span>)}
                </div>
              </div>
            </div>
            <button onClick={() => deleteSession(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 h-fit lg:sticky lg:top-24 shadow-xl">
        <h4 className="font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6 text-sm">{t.btn_add_session}</h4>
        <form onSubmit={handleAddSession} className="space-y-4">
          <input placeholder={t.label_session} value={newSession.label} onChange={e => setNewSession({ ...newSession, label: e.target.value })} required className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
          <input placeholder={t.label_room} value={newSession.room_name} onChange={e => setNewSession({ ...newSession, room_name: e.target.value })} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
          <input placeholder={t.label_speakers} value={newSession.speakers} onChange={e => setNewSession({ ...newSession, speakers: e.target.value })} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
          <div className="grid grid-cols-2 gap-2">
            <input type="datetime-local" value={newSession.start} onChange={e => setNewSession({ ...newSession, start: e.target.value })} required className="p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-bold text-[10px] dark:text-white" />
            <input type="datetime-local" value={newSession.end} onChange={e => setNewSession({ ...newSession, end: e.target.value })} className="p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-bold text-[10px] dark:text-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all border-none cursor-pointer">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : t.btn_add_session}
          </button>
        </form>
      </div>
    </div>
  )
}