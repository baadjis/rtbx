/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {

  useState

} from 'react'

import {

  Smartphone

} from 'lucide-react'



import AppCard from '../AppCard'
import AppModal from '../AppModal'

import {

  LangType

} from '@/lib/lang/types'
import { APP_PROVIDERS } from '@/utils/app-providers'

type Props = {

  links: any[]

  t: any

  lang: LangType

  onSave: (
    data: {

      provider_id: string

      value: string

    }
  ) => Promise<void>

}

export default function AppsSection({

  links,

  t,

  lang,

  onSave

}: Props) {

  const [

    selectedProvider,

    setSelectedProvider

  ] = useState<string | null>(
    null
  )

  return (

    <>

      <div className="
        bg-white dark:bg-slate-900

        border border-gray-100
        dark:border-slate-800

        rounded-[3rem]

        p-8

        shadow-sm

        space-y-6
      ">

        <div className="
          flex items-center
          gap-4
        ">

          <div className="
            w-14 h-14

            rounded-2xl

            bg-indigo-50
            dark:bg-indigo-500/10

            text-indigo-600

            flex items-center
            justify-center
          ">

            <Smartphone />

          </div>

          <div>

            <h2 className="
              text-2xl
              font-black
            ">

              {t.apps}

            </h2>

          </div>

        </div>

        <div className="
          grid
          gap-4
        ">

          {

            Object.values(
              APP_PROVIDERS
            ).map(

              provider => {

                const link =
                  links.find(

                    item =>

                      item.provider_id ===
                      provider.id

                  )

                return (

                  <AppCard

                    key={
                      provider.id
                    }

                    providerId={
                      provider.id
                    }

                    value={
                      link?.value
                    }

                    lang={lang}

                    t={t}

                    onEdit={() =>

                      setSelectedProvider(
                        provider.id
                      )

                    }

                  />

                )

              }

            )

          }

        </div>

      </div>

      {

        selectedProvider && (

          <AppModal

            open

            providerId={
              selectedProvider
            }

            value={
              links.find(

                item =>

                  item.provider_id ===
                  selectedProvider

              )?.value
            }

            t={t}

            onClose={() =>

              setSelectedProvider(
                null
              )

            }

            onSave={
              onSave
            }

          />

        )

      }

    </>

  )

}