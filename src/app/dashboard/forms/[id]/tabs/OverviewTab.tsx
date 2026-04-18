/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { 
  Users, Star, Calendar, Download, 
  Trash2, MessageSquare, ArrowUpRight, 
  Clock, BarChart3 
} from 'lucide-react'

export default function OverviewTab({ form, lang }: { form: any, lang: string }) {
  const responses = form.form_responses || []
  const fields = form.fields_json || []

  // 1. Logique de calcul du Score Moyen (uniquement sur les champs 'range')
  const rangeFields = fields.filter((f: any) => f.type === 'range')
  let totalScore = 0
  let scoreCount = 0

  responses.forEach((resp: any) => {
    rangeFields.forEach((field: any) => {
      const val = resp.answers_json[field.label]
      if (typeof val === 'number') {
        totalScore += val
        scoreCount++
      }
    })
  })

  const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '--'

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* --- SECTION 1 : KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title={lang === 'fr' ? "Réponses" : "Responses"} 
          value={responses.length} 
          icon={Users} 
          color="indigo" 
          trend="+12%" 
        />
        <StatsCard 
          title={lang === 'fr' ? "Satisfaction" : "Satisfaction"} 
          value={`${avgScore}/10`} 
          icon={Star} 
          color="emerald" 
        />
        <StatsCard 
          title={lang === 'fr' ? "Dernière activité" : "Last activity"} 
          value={responses.length > 0 ? new Date(responses[0].created_at).toLocaleDateString() : '--'} 
          icon={Clock} 
          color="purple" 
        />
      </div>

      {/* --- SECTION 2 : LISTE DES RÉPONSES --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <MessageSquare size={20} />
            </div>
            <h3 className="font-black uppercase tracking-widest text-gray-900 dark:text-white text-sm">
                {lang === 'fr' ? "Réponses Récentes" : "Recent Submissions"}
            </h3>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border-none cursor-pointer">
            <Download size={14} /> Export
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Données</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {responses.length > 0 ? responses.map((resp: any) => (
                <tr key={resp.id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-xs text-gray-400">#{resp.id.toString().slice(-4)}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2 max-w-xl">
                      {Object.entries(resp.answers_json).map(([key, val]: [string, any], idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                            <span className="text-[9px] font-black text-indigo-500 uppercase block mb-0.5">{key}</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-slate-200">{val.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right text-gray-400 font-bold text-xs">
                    {new Date(resp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic font-bold">
                    {lang === 'fr' ? "Aucune réponse enregistrée." : "No responses recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- SOUS-COMPOSANT KPI ---
function StatsCard({ title, value, icon: Icon, color, trend }: any) {
    const colors: any = {
      indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    }
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={28} strokeWidth={2.5} />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} /> {trend}
                </span>
            )}
        </div>
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
      </div>
    )
}