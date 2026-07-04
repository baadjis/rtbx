/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {
  Users, Star, MessageSquare, ArrowUpRight,
  Clock, Download, TrendingUp, CheckCircle2
} from 'lucide-react'

// =====================================================
// ANALYTICS HELPERS
// =====================================================

function getDistribution(responses: any[], fieldLabel: string): Record<string | number, number> {
  const dist: Record<string | number, number> = {}
  responses.forEach(resp => {
    const val = resp.answers_json?.[fieldLabel]
    if (val === undefined || val === null || val === '') return
    const vals = Array.isArray(val) ? val : [val]
    vals.forEach(v => {
      dist[v] = (dist[v] || 0) + 1
    })
  })
  return dist
}

function getAverage(responses: any[], fieldLabel: string): number | null {
  const vals = responses
    .map(r => r.answers_json?.[fieldLabel])
    .filter(v => typeof v === 'number')
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// =====================================================
// DISTRIBUTION CHARTS — barres CSS pures
// =====================================================

function RangeDistribution({ field, responses, lang }: any) {
  const min = field.range_settings?.min ?? 0
  const max = field.range_settings?.max ?? 10
  const dist = getDistribution(responses, field.label)
  const maxCount = Math.max(...Object.values(dist).map(Number), 1)
  const avg = getAverage(responses, field.label)
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className="space-y-3">
      {avg !== null && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-gray-900 dark:text-white">{avg.toFixed(1)}</span>
          <span className="text-gray-400 text-sm">/ {max} {lang === 'fr' ? 'moy.' : 'avg.'}</span>
        </div>
      )}
      <div className="space-y-1.5">
        {values.map(v => {
          const count = dist[v] || 0
          const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
          return (
            <div key={v} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400 w-6 text-right flex-shrink-0">{v}</span>
              <div className="flex-1 h-5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-400 w-6 flex-shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-300 dark:text-slate-600 px-9">
        <span>{field.range_settings?.min_label || min}</span>
        <span>{field.range_settings?.max_label || max}</span>
      </div>
    </div>
  )
}

function StarsDistribution({ field, responses, lang }: any) {
  const maxStars = field.star_settings?.max_stars || 5
  const dist = getDistribution(responses, field.label)
  const maxCount = Math.max(...Object.values(dist).map(Number), 1)
  const avg = getAverage(responses, field.label)
  const values = Array.from({ length: maxStars }, (_, i) => i + 1)

  return (
    <div className="space-y-3">
      {avg !== null && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-gray-900 dark:text-white">{avg.toFixed(1)}</span>
          <Star size={18} className="text-yellow-400 fill-yellow-400" />
          <span className="text-gray-400 text-sm">/ {maxStars}</span>
        </div>
      )}
      <div className="space-y-1.5">
        {values.slice().reverse().map(v => {
          const count = dist[v] || 0
          const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
          return (
            <div key={v} className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 w-16 flex-shrink-0 justify-end">
                {Array.from({ length: v }).map((_, i) => (
                  <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex-1 h-5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-400 w-6 flex-shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NpsDistribution({ field, responses, lang }: any) {
  const dist = getDistribution(responses, field.label)
  const total = responses.filter((r:any) => r.answers_json?.[field.label] !== undefined).length
  const maxCount = Math.max(...Object.values(dist).map(Number), 1)

  const promoters = Object.entries(dist).filter(([k]) => Number(k) >= 9).reduce((a, [, v]) => a + v, 0)
  const detractors = Object.entries(dist).filter(([k]) => Number(k) <= 6).reduce((a, [, v]) => a + v, 0)
  const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0

  const colorForValue = (v: number) => {
    if (v >= 9) return 'bg-emerald-500'
    if (v >= 7) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-black ${npsScore >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
          {npsScore > 0 ? '+' : ''}{npsScore}
        </span>
        <span className="text-gray-400 text-sm">NPS</span>
        <div className="flex gap-3 ml-2">
          <span className="text-[10px] font-bold text-emerald-500">😊 {promoters}</span>
          <span className="text-[10px] font-bold text-red-400">😞 {detractors}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {Array.from({ length: 11 }, (_, i) => i).map(v => {
          const count = dist[v] || 0
          const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
          return (
            <div key={v} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400 w-4 text-right flex-shrink-0">{v}</span>
              <div className="flex-1 h-4 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorForValue(v)} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-400 w-6 flex-shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] px-7">
        <span className="text-red-400 font-bold">{lang === 'fr' ? 'Détracteurs' : 'Detractors'} (0-6)</span>
        <span className="text-yellow-400 font-bold">{lang === 'fr' ? 'Passifs' : 'Passives'} (7-8)</span>
        <span className="text-emerald-400 font-bold">{lang === 'fr' ? 'Promoteurs' : 'Promoters'} (9-10)</span>
      </div>
    </div>
  )
}

function SelectDistribution({ field, responses }: any) {
  const dist = getDistribution(responses, field.label)
  const total = Object.values(dist).reduce((a, b) => a + b, 0)
  const maxCount = Math.max(...Object.values(dist).map(Number), 1)
  const options = field.options || Object.keys(dist)

  return (
    <div className="space-y-1.5">
      {options.map((opt: string) => {
        const count = dist[opt] || 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        const barPct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
        return (
          <div key={opt} className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-gray-600 dark:text-slate-400 w-28 truncate flex-shrink-0">{opt}</span>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${barPct}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-400 w-12 flex-shrink-0 text-right">{count} ({pct}%)</span>
          </div>
        )
      })}
    </div>
  )
}

// =====================================================
// FIELD ANALYTICS CARD
// =====================================================
function FieldAnalyticsCard({ field, responses, lang }: any) {
  const answeredCount = responses.filter(
    (r: any) => {
      const val = r.answers_json?.[field.label]
      return val !== undefined && val !== null && val !== '' &&
        (!Array.isArray(val) || val.length > 0)
    }
  ).length

  const responseRate = responses.length > 0
    ? Math.round((answeredCount / responses.length) * 100)
    : 0

  const TYPE_LABELS: Record<string, string> = {
    range: 'Curseur', stars: 'Étoiles', nps: 'NPS',
    select: 'Liste', multiselect: 'Choix multiple',
    text: 'Texte', email: 'Email', phone: 'Téléphone',
    date: 'Date', image_choice: 'Choix image',
  }

  const hasChart = ['range', 'stars', 'nps', 'select', 'multiselect'].includes(field.type)

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-black text-gray-900 dark:text-white text-sm truncate">{field.label}</p>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
            {TYPE_LABELS[field.type] || field.type}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black text-gray-900 dark:text-white">{answeredCount}</p>
          <p className="text-[10px] text-gray-400">{responseRate}% {lang === 'fr' ? 'réponses' : 'responses'}</p>
        </div>
      </div>

      {hasChart && answeredCount > 0 && (
        <div className="pt-2 border-t border-gray-50 dark:border-slate-800">
          {field.type === 'range' && <RangeDistribution field={field} responses={responses} lang={lang} />}
          {field.type === 'stars' && <StarsDistribution field={field} responses={responses} lang={lang} />}
          {field.type === 'nps' && <NpsDistribution field={field} responses={responses} lang={lang} />}
          {(field.type === 'select' || field.type === 'multiselect') && (
            <SelectDistribution field={field} responses={responses} lang={lang} />
          )}
        </div>
      )}

      {!hasChart && (
        <div className="pt-2 border-t border-gray-50 dark:border-slate-800">
          <p className="text-xs text-gray-400 italic">
            {answeredCount} {lang === 'fr' ? 'réponses collectées' : 'responses collected'}
          </p>
        </div>
      )}

      {answeredCount === 0 && (
        <p className="text-xs text-gray-300 dark:text-slate-600 italic">
          {lang === 'fr' ? 'Aucune réponse pour ce champ.' : 'No responses for this field.'}
        </p>
      )}
    </div>
  )
}

// =====================================================
// OVERVIEW TAB PRINCIPAL
// =====================================================
export default function OverviewTab({ form, lang }: { form: any; lang: string }) {
  const responses = (form.form_responses || []).filter((r: any) => r.submitted_at !== null)
  const started = form.form_responses || []
  const fields = form.fields_json || []

  // KPIs
  const totalSubmitted = responses.length
  const totalStarted = started.length
  const completionRate = totalStarted > 0
    ? Math.round((totalSubmitted / totalStarted) * 100)
    : null

  // Score moyen sur les champs range
  const rangeFields = fields.filter((f: any) => f.type === 'range')
  let totalScore = 0, scoreCount = 0
  responses.forEach((resp: any) => {
    rangeFields.forEach((field: any) => {
      const val = resp.answers_json?.[field.label]
      if (typeof val === 'number') { totalScore += val; scoreCount++ }
    })
  })
  const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '--'

  const lastActivity = responses.length > 0
    ? new Date(responses[0].submitted_at || responses[0].created_at).toLocaleDateString(
        lang === 'fr' ? 'fr-FR' : 'en-US',
        { day: 'numeric', month: 'short', year: 'numeric' }
      )
    : '--'

  // Champs avec analytics (exclure les champs sans distribution)
  const analyticsFields = fields.filter((f: any) =>
    ['range', 'stars', 'nps', 'select', 'multiselect', 'text', 'email', 'phone', 'date'].includes(f.type)
  )

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title={lang === 'fr' ? 'Réponses' : 'Responses'}
          value={totalSubmitted}
          icon={Users}
          color="indigo"
        />
        <StatsCard
          title={lang === 'fr' ? 'Satisfaction' : 'Satisfaction'}
          value={rangeFields.length > 0 ? `${avgScore}/10` : '--'}
          icon={Star}
          color="emerald"
        />
        {completionRate !== null ? (
          <StatsCard
            title={lang === 'fr' ? 'Complétion' : 'Completion'}
            value={`${completionRate}%`}
            icon={CheckCircle2}
            color="violet"
          />
        ) : (
          <StatsCard
            title={lang === 'fr' ? 'Vues' : 'Views'}
            value={totalStarted}
            icon={TrendingUp}
            color="violet"
          />
        )}
        <StatsCard
          title={lang === 'fr' ? 'Dernière activité' : 'Last activity'}
          value={lastActivity}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* ANALYTICS PAR CHAMP */}
      {analyticsFields.length > 0 && totalSubmitted > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
            {lang === 'fr' ? 'Analyse par champ' : 'Field Analysis'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsFields.map((field: any) => (
              <FieldAnalyticsCard
                key={field.id}
                field={field}
                responses={responses}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

      {/* TABLEAU DES RÉPONSES */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-black uppercase tracking-widest text-gray-900 dark:text-white text-sm">
              {lang === 'fr' ? 'Réponses Récentes' : 'Recent Submissions'}
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
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {lang === 'fr' ? 'Données' : 'Data'}
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  {lang === 'fr' ? 'Date' : 'Date'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {responses.length > 0 ? responses.map((resp: any) => (
                <tr key={resp.id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-xs text-gray-400">
                    #{resp.id.toString().slice(-4)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2 max-w-xl">
                      {Object.entries(resp.answers_json || {}).map(([key, val]: [string, any], idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                          <span className="text-[9px] font-black text-indigo-500 uppercase block mb-0.5">{key}</span>
                          <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                            {Array.isArray(val) ? val.join(', ') : val?.toString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right text-gray-400 font-bold text-xs">
                    {new Date(resp.submitted_at || resp.created_at).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'en-US',
                      { day: 'numeric', month: 'short' }
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic font-bold">
                    {lang === 'fr' ? 'Aucune réponse enregistrée.' : 'No responses recorded yet.'}
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

// =====================================================
// STATS CARD
// =====================================================
function StatsCard({ title, value, icon: Icon, color, trend }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  }
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm group transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 ${colors[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
    </div>
  )
}