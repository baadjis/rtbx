/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Building2,
  Globe,
  User,
  Code2,
  Store,
  Rocket
} from "lucide-react"

const SPACE_TYPES = [
  {
    id: 'personal',
    icon: User,
    labelKey: 'opt_personal'
  },
  {
    id: 'organization',
    icon: Building2,
    labelKey: 'opt_organization'
  },
  {
    id: 'developer',
    icon: Code2,
    labelKey: 'opt_developer'
  },
  {
    id: 'business',
    icon: Store,
    labelKey: 'opt_business'
  },
  {
    id: 'startup',
    icon: Rocket,
    labelKey: 'opt_startup'
  }
]

export default function SpaceTypeSelect({
  setAccountType,
  accountType,
  t
}: {
  setAccountType: any
  accountType: any
  t: any
}) {
  return (
    <div className="space-y-4">
      
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
        <Globe size={14} />
        {t.label_account_type}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {SPACE_TYPES.map((type) => {
          const Icon = type.icon
          const active = accountType === type.id

          return (
            <button
              key={type.id}
              onClick={() => setAccountType(type.id)}
              className={`
                group relative overflow-hidden
                flex flex-col items-center justify-center gap-3
                py-5 px-4
                rounded-2xl
                border
                transition-all duration-300
                cursor-pointer

                ${
                  active
                    ? `
                      bg-white dark:bg-slate-800
                      border-indigo-500/40
                      text-indigo-600
                      shadow-[0_0_30px_rgba(99,102,241,0.18)]
                      scale-[1.02]
                    `
                    : `
                      bg-gray-50 dark:bg-slate-900
                      border-gray-200 dark:border-slate-700
                      text-gray-400
                      hover:border-indigo-400/30
                      hover:bg-white dark:hover:bg-slate-800
                      hover:text-indigo-500
                    `
                }
              `}
            >

              {/* Glow */}
              <div
                className={`
                  absolute inset-0 opacity-0 transition-opacity duration-500
                  bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                  ${active ? 'opacity-100' : 'group-hover:opacity-100'}
                `}
              />

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`
                    w-11 h-11 rounded-2xl
                    flex items-center justify-center
                    transition-all duration-300
                    ${
                      active
                        ? 'bg-indigo-500/10 text-indigo-600'
                        : 'bg-black/5 dark:bg-white/5'
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                <span className="text-xs font-black uppercase tracking-wide">
                  {t[type.labelKey]}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}