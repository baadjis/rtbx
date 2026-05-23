/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import PhoneField from '@/components/PhoneField'

import {
  Mail
} from 'lucide-react'

type ContactSectionProps = {

  t: any

  email: string
  setEmail: any

  phone: string
  setPhone: any

  country?: string

}

export default function ContactSection({

  t,

  email,
  setEmail,

  phone,
  setPhone,

  country

}: ContactSectionProps) {

  return (

    <div className="space-y-6">

      {/* PHONE */}

      <PhoneField

        phone={phone}

        setPhone={setPhone}

        t={t}

        country={country}

      />

      {/* EMAIL */}

      <div className="space-y-2">

        <label className="
          text-[10px]
          font-black
          text-gray-400
          uppercase
          tracking-widest
          ml-2
          flex items-center gap-2
        ">

          <Mail size={12} />

          {t.email}

        </label>

        <div className="relative">

          <Mail
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            placeholder="contact@business.com"

            className="
              w-full p-4 pl-12
              bg-gray-50 dark:bg-slate-800
              border-none rounded-2xl
              font-bold dark:text-white
              focus:ring-2 focus:ring-indigo-500
            "
          />

        </div>

      </div>

    </div>

  )

}