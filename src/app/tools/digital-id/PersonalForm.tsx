/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Sparkles,
  BadgeCheck,
  Circle
} from "lucide-react"

const PERSONAL_SUBCATEGORIES = [
  {
    id: 'creator',
    icon: Sparkles,
    labelKey: 'personal_type_creator'
  },
  {
    id: 'personal_branding',
    icon: BadgeCheck,
    labelKey: 'personal_type_personal_branding'
  },
  {
    id: 'other',
    icon: Circle,
    labelKey: 'personal_type_other'
  }
]

export default function PersonalSubcategorySelect({
  subcategory,
  setSubcategory,
  t
}: {
  subcategory: any
  setSubcategory: any
  t: any
}) {
  return (
    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">

      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
        {t.label_personal_type}
      </label>

      <div className="grid grid-cols-2 gap-3">

        {PERSONAL_SUBCATEGORIES.map((item) => {
          const Icon = item.icon
          const active = subcategory === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubcategory(item.id)}
              className={`
                group relative overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                transition-all duration-300
                hover:scale-[1.02]

                ${
                  active
                    ? `
                      bg-white dark:bg-slate-800
                      border-indigo-500/40
                      shadow-[0_0_30px_rgba(99,102,241,0.15)]
                    `
                    : `
                      bg-gray-50 dark:bg-slate-900
                      border-gray-200 dark:border-slate-700
                      hover:border-indigo-400/30
                    `
                }
              `}
            >

              {/* Glow */}
              <div
                className={`
                  absolute inset-0 transition-opacity duration-500
                  bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                  ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
              />

              <div className="relative z-10 space-y-3">

                <div
                  className={`
                    w-11 h-11 rounded-2xl
                    flex items-center justify-center
                    transition-all duration-300

                    ${
                      active
                        ? 'bg-indigo-500/10 text-indigo-600'
                        : 'bg-black/5 dark:bg-white/5 text-gray-500'
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <p
                    className={`
                      text-sm font-black leading-tight
                      ${
                        active
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-white'
                      }
                    `}
                  >
                    {t[item.labelKey]}
                  </p>
                </div>

              </div>
            </button>
          )
        })}

      </div>

      {/* Vanilla hint */}
      <p className="text-[10px] text-gray-400 font-bold px-1">
        {t.personal_type_default_hint}
      </p>
    </div>
  )
}