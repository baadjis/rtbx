/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Building2,
  Globe,
  User,
  Code2,
  Store,
  Rocket,
  Check
} from "lucide-react"

const SPACE_TYPES = [
  {
    id: 'personal',
    icon: User,
    labelKey: 'opt_personal',
    mini: 'Creator • Branding'
  },
  {
    id: 'organization',
    icon: Building2,
    labelKey: 'opt_organization',
    mini: 'NGO • Association'
  },
  {
    id: 'developer',
    icon: Code2,
    labelKey: 'opt_developer',
    mini: 'Portfolio • Projects'
  },
  {
    id: 'business',
    icon: Store,
    labelKey: 'opt_business',
    mini: 'Restaurant • Barber'
  },
  {
    id: 'startup',
    icon: Rocket,
    labelKey: 'opt_startup',
    mini: 'SaaS • Team'
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
    

     
      <div className="grid grid-cols-2 gap-3">

        {SPACE_TYPES.map((type) => {
          const Icon = type.icon
          const active = accountType === type.id

          return (
            <button
              key={type.id}
              onClick={() => setAccountType(type.id)}
              className={`
                group
                relative
                overflow-hidden
                p-4
                rounded-[1.7rem]
                border
                text-left
                transition-all duration-300
                cursor-pointer

                ${
                  active
                    ? `
                      bg-white dark:bg-slate-800
                      border-indigo-500/40
                      shadow-[0_0_30px_rgba(99,102,241,0.15)]
                      scale-[1.02]
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

              {/* SELECTED BADGE */}
              <div
                className={`
                  absolute top-3 right-3
                  w-5 h-5
                  rounded-full
                  flex items-center justify-center
                  transition-all duration-300

                  ${
                    active
                      ? `
                        bg-indigo-500
                        text-white
                        scale-100
                        shadow-[0_0_15px_rgba(99,102,241,0.6)]
                      `
                      : `
                        bg-black/5 dark:bg-white/5
                        text-transparent
                        scale-90
                      `
                  }
                `}
              >
                <Check size={12} strokeWidth={4} />
              </div>

              {/* CONTENT */}
              <div className="relative z-10">

                {/* ICON */}
                <div
                  className={`
                    w-12 h-12
                    rounded-2xl
                    flex items-center justify-center
                    mb-3
                    transition-all duration-300

                    ${
                      active
                        ? `
                          bg-indigo-500/10
                          text-indigo-600
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
                  <Icon size={22} />
                </div>

                {/* TITLE */}
                <h3
                  className={`
                    text-sm
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

                {/* MINI DESC */}
                <p className="
                  mt-1
                  text-[10px]
                  font-medium
                  text-gray-400
                  dark:text-slate-500
                  leading-relaxed
                ">
                  {type.mini}
                </p>

              </div>
            </button>
          )
        })}
      </div>
    
  )
}