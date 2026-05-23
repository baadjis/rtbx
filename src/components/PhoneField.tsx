/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import PhoneInput from 'react-phone-number-input'

import {
  Phone
} from 'lucide-react'
import { CountryCode } from 'libphonenumber-js/core'

type Props = {

  phone: string

  setPhone: (
    value: string
  ) => void

  country?: CountryCode

  t: any

}

export default function PhoneField({

  phone,

  setPhone,

  country,

  t

}: Props) {

  return (

    <div className="space-y-2">

      {/* LABEL */}

      <label className="
        text-[10px]
        font-black
        text-gray-400
        uppercase
        tracking-widest
        ml-2
        flex items-center gap-2
      ">

        <Phone size={12} />

        {t.phone}

      </label>

      {/* INPUT */}

      <div className="
        rounded-2xl
        bg-gray-50 dark:bg-slate-800
        px-4 py-3

        focus-within:ring-2
        focus-within:ring-indigo-500

        transition-all
      ">

        <PhoneInput
          key={country}
          international={false}
          defaultCountry={country}

          country={
            country 
          }

          value={phone}

          onChange={(value) =>
            setPhone(value || '')
          }

          placeholder="+33 6 12 34 56 78"

          className="
            font-bold
            dark:text-white
          "
        />

      </div>

    </div>

  )

}