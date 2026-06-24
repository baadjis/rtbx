/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Image from 'next/image'

import {
  Smartphone,
  Pencil
} from 'lucide-react'


import {
  LangType
} from '@/lib/lang/types'
import { APP_PROVIDERS } from '@/utils/app-providers'

type Props = {

  providerId: string

  value?: string

  lang: LangType

  t: any

  onEdit: () => void

}

export default function AppCard({

  providerId,

  value,

  lang,

  t,

  onEdit

}: Props) {

  const provider =
    APP_PROVIDERS[
      providerId as keyof typeof APP_PROVIDERS
    ]

  if (!provider)
    return null

  return (

    <div className="
      bg-white dark:bg-slate-900

      border border-gray-100
      dark:border-slate-800

      rounded-[2rem]

      p-6

      shadow-sm

      flex items-center
      justify-between
      gap-4
    ">

      <div className="
        flex items-center
        gap-4
      ">

        <div className="
          w-14 h-14

          rounded-2xl

          bg-gray-50
          dark:bg-slate-800

          overflow-hidden

          flex items-center
          justify-center
        ">

          <Image

            src={`/provider_assets/${provider.folder}/full.png`}

            alt={provider.label.en}

            width={40}

            height={40}

            onError={(e) => {

              e.currentTarget.style.display =
                'none'

            }}

          />

        </div>

        <div>

          <h3 className="
            font-black

            text-gray-900
            dark:text-white
          ">

            {provider.label[lang]}

          </h3>

          <p className="
            text-sm
            text-gray-500
          ">

            {

              value

                ? t.configured

                : t.not_configured

            }

          </p>

        </div>

      </div>

      <button

        onClick={onEdit}

        className="
          px-4 py-3

          rounded-xl

          bg-indigo-600
          text-white

          flex items-center
          gap-2

          font-black
        "

      >

        <Pencil size={16} />

        {t.edit}

      </button>

    </div>

  )

}