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
    labelKey: 'opt_personal',
    descKey: 'desc_personal'
  },
  {
    id: 'organization',
    icon: Building2,
    labelKey: 'opt_organization',
    descKey: 'desc_organization'
  },
  {
    id: 'developer',
    icon: Code2,
    labelKey: 'opt_developer',
    descKey: 'desc_developer'
  },
  {
    id: 'business',
    icon: Store,
    labelKey: 'opt_business',
    descKey: 'desc_business'
  },
  {
    id: 'startup',
    icon: Rocket,
    labelKey: 'opt_startup',
    descKey: 'desc_startup'
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
    <div className="space-y-5">

      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
        <Globe size={14} />
        {t.label_account_type}
      </label>

      <div className="space-y-3">
        {SPACE_TYPES.map((type) => {
          const Icon = type.icon
          const active = accountType === type.id

          return (
            <button
              key={type.id}
              onClick={() => setAccountType(type.id)}
              className={`
                group relative overflow-hidden
                w-full
                p-5
                rounded-[2rem]
                border
                text-left
                transition-all duration-300
                cursor-pointer

                ${
                  active
                    ? `
                      bg-white dark:bg-slate-800
                      border-indigo-500/40
                      shadow-[0_0_40px_rgba(99,102,241,0.16)]
                      scale-[1.01]
                    `
                    : `
                      bg-gray-50 dark:bg-slate-900
                      border-gray-200 dark:border-slate-800
                      hover:border-indigo-400/30
                      hover:bg-white dark:hover:bg-slate-800
                    `
                }
              `}
            >

              {/* Glow */}
              <div
                className={`
                  absolute inset-0 transition-opacity duration-500
                  bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-fuchsia-500/10
                  ${
                    active
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }
                `}
              />

              <div className="relative z-10 flex items-start gap-4">

                {/* ICON */}
                <div
                  className={`
                    w-14 h-14 shrink-0
                    rounded-2xl
                    flex items-center justify-center
                    transition-all duration-300

                    ${
                      active
                        ? `
                          bg-indigo-500/10
                          text-indigo-600
                          shadow-inner
                        `
                        : `
                          bg-black/[0.03]
                          dark:bg-white/[0.04]
                          text-gray-400
                          group-hover:text-indigo-500
                        `
                    }
                  `}
                >
                  <Icon size={24} />
                </div>

                {/* TEXT */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-3">

                    <h3
                      className={`
                        text-sm md:text-base
                        font-black
                        uppercase
                        tracking-wide
                        transition-colors

                        ${
                          active
                            ? 'text-indigo-600'
                            : 'text-gray-800 dark:text-white'
                        }
                      `}
                    >
                      {t[type.labelKey]}
                    </h3>

                    {active && (
                      <div className="
                        w-3 h-3 rounded-full
                        bg-indigo-500
                        shadow-[0_0_18px_rgba(99,102,241,0.9)]
                      " />
                    )}
                  </div>

                  <p className="
                    mt-1.5
                    text-[11px]
                    leading-relaxed
                    text-gray-500
                    dark:text-slate-400
                    font-medium
                  ">
                    {t[type.descKey]}
                  </p>

                </div>

              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}