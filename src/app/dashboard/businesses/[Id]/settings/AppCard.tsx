/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Image from 'next/image'

import {
  Smartphone
} from 'lucide-react'

import {
  useState
} from 'react'

import {
  LangType
} from '@/lib/lang/types'

import {
  APP_PROVIDERS
} from '@/utils/app-providers'

import {
  getProviderGlyph
} from '@/lib/providers/getProviderAsset'

type Props = {

  providerId: string

  value?: string

  lang: LangType

  t: any

}

export default function AppCard({

  providerId,

  value,

  lang,

  t

}: Props) {

  const provider =

    APP_PROVIDERS[
      providerId as keyof typeof APP_PROVIDERS
    ]

  const [

    imageError,

    setImageError

  ] = useState(false)

  if (!provider)
    return null

  const glyph =
    getProviderGlyph(
      provider
    )

  return (

    <div className="
      bg-white
      dark:bg-slate-900

      border
      border-gray-100
      dark:border-slate-800

      rounded-[2rem]

      p-6

      shadow-sm

      flex
      items-center
      gap-4
    ">

      {/* ICON */}

      <div className="
        w-14
        h-14

        rounded-2xl

        bg-gray-50
        dark:bg-slate-800

        flex
        items-center
        justify-center

        overflow-hidden

        shrink-0
      ">

        {

          glyph &&
          !imageError

            ? (

              <Image

                src={glyph}

                alt={

                  provider.label?.en ??

                  provider.label

                }

                width={40}

                height={40}

                onError={()=>

                  setImageError(
                    true
                  )

                }

              />

            )

            : (

              <Smartphone

                size={22}

                className="
                  text-slate-400
                "

              />

            )

        }

      </div>

      {/* CONTENT */}

      <div className="
        flex-1
        min-w-0
      ">

        <h3 className="
          font-black

          text-gray-900
          dark:text-white
        ">

          {

            typeof provider.label ===
            'string'

              ? provider.label

              : provider.label?.[
                  lang
                ] ??

                provider.label?.en

          }

        </h3>

        <p className="
          mt-2

          text-sm

          text-gray-500

          truncate
        ">

          {

            value ||

            t.not_configured

          }

        </p>

      </div>

    </div>

  )

}