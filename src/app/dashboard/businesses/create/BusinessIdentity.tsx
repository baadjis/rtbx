/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { LangType } from '@/lib/lang/types'
import { getBusinessTypeOptions } from '@/utils/busines-types'



type BusinessIdentityProps = {

  t: any

  name: string
  setName: any
  businessType: string
  setBusinessType: any
  lang:LangType

}

export default function BusinessIdentity({

  t,

  name,
  setName,
  businessType,
  setBusinessType,
  lang,
  

}: BusinessIdentityProps) {
  const businessTypeOptions =
  getBusinessTypeOptions(lang)

  return (

    <div className="space-y-6">

      {/* NAME */}

      <div className="space-y-2">

        <label className="
          text-[10px]
          font-black
          text-gray-400
          uppercase
          tracking-widest
          ml-2
        ">

          {t.business_name}

        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder={
            t.business_name_placeholder
          }
          className="
            w-full p-4
            bg-gray-50 dark:bg-slate-800
            border-none rounded-2xl
            font-bold dark:text-white
            focus:ring-2 focus:ring-indigo-500
          "
        />

      </div>

      

      {/* TYPE */}

      {/* TYPE */}

<div className="space-y-2">

  <label
    className="
      text-[10px]
      font-black
      text-gray-400
      uppercase
      tracking-widest
      ml-2
    "
  >

    {t.business_type}

  </label>

  <select
    value={businessType}
    onChange={(e) =>
      setBusinessType(
        e.target.value
      )
    }
    className="
      w-full p-4
      bg-gray-50 dark:bg-slate-800
      border-none rounded-2xl
      font-bold dark:text-white
      focus:ring-2 focus:ring-indigo-500
    "
  >

    <option value="">
      {t.select_business_type}
    </option>

    {businessTypeOptions.map(
      (type:any) => (

        <option
          key={type.value}
          value={type.value}
        >
          {type.label}
        </option>

      )
    )}

  </select>

</div>

    </div>

  )

}