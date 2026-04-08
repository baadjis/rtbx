/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, CheckCircle2, BarChart3 } from 'lucide-react'

export default function OverviewTab({ event, participants, t }: any) {
  const checkedIn = participants.filter((p: any) => p.checked_in).length;
  const capacityPercent = event.max_capacity ? Math.round((participants.length / event.max_capacity) * 100) : '--';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title={t.stat_total} value={participants.length} icon={Users} color="indigo" />
        <StatsCard title={t.stat_checked} value={checkedIn} icon={CheckCircle2} color="emerald" />
        <StatsCard title={t.stat_capacity} value={capacityPercent === '--' ? '--' : `${capacityPercent}%`} icon={BarChart3} color="purple" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center text-gray-900 dark:text-white font-black uppercase text-sm tracking-widest">
            {t.list_participants}
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {participants.map((p: any) => (
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
  )
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  }
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group transition-all duration-300 hover:shadow-xl">
      <div className={`w-16 h-16 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-5xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
    </div>
  )
}