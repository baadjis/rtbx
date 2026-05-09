/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Landmark,
  HeartHandshake,
  Building2,
  ShieldCheck
} from "lucide-react"

const ORG_SUBCATEGORIES = [
  {
    id: 'ngo',
    icon: HeartHandshake,
    labelKey: 'org_type_ngo'
  },
  {
    id: 'association',
    icon: Building2,
    labelKey: 'org_type_association'
  },
  {
    id: 'government',
    icon: Landmark,
    labelKey: 'org_type_government'
  },
  {
    id: 'institution',
    icon: ShieldCheck,
    labelKey: 'org_type_institution'
  }
]

export default function OrganizationSubcategorySelect({
  subcategory,
  setSubcategory,
  
  t
}: {
  subcategory: string
  setSubcategory: any
  

  t: any
}) {
  return (
    <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">

     

      {/* SUBCATEGORY */}
      <div className="space-y-3">

        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
          {t.label_org_type || "Organization type"}
        </label>

        <div className="grid grid-cols-2 gap-3">

          {ORG_SUBCATEGORIES.map((item) => {
            const Icon = item.icon
            const active = subcategory=== item.id

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
                        text-sm font-black
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
      </div>
    </div>
  )
}