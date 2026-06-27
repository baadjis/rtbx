/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  Plus,
  Pencil
} from 'lucide-react'

import ProviderCard from '../providers/ProviderCard'

type Props = {

  title: string

  description: string

  category: string

  providers: any[]

  links: any[]

  business: any

  t: any

  onEdit: () => void

}

export default function ProviderCategorySection({

  title,

  description,

  category,

  providers,

  links,

  business,

  t,

  onEdit

}: Props) {

  const configuredProviders =

    providers.filter(

      provider =>

        links.some(

          link =>

            link.provider_id ===
              provider.id &&

            !!link.value

        )

    )

  return (

    <div className="
      bg-white
      dark:bg-slate-900

      border
      border-gray-100
      dark:border-slate-800

      rounded-[3rem]

      p-8

      shadow-sm

      space-y-8
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between
        gap-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-black

            text-gray-900
            dark:text-white
          ">

            {title}

          </h2>

          <p className="
            mt-2

            text-gray-500
            dark:text-slate-400
          ">

            {description}

          </p>

        </div>

        <button

          onClick={onEdit}

          className="
            px-5
            py-3

            rounded-2xl

            bg-indigo-600
            hover:bg-indigo-700

            text-white

            font-black

            flex
            items-center
            gap-2

            transition-all
          "

        >

          {

            configuredProviders.length
              ? (
                <>
                  <Pencil size={18} />
                  {t.manage}
                </>
              )
              : (
                <>
                  <Plus size={18} />
                  {t.add}
                </>
              )

          }

        </button>

      </div>

      {/* EMPTY */}

      {

        configuredProviders.length === 0 && (

          <div className="
            rounded-[2rem]

            border-2
            border-dashed
            border-gray-200
            dark:border-slate-700

            p-12

            text-center
          ">

            <p className="
              text-lg
              font-black

              text-gray-900
              dark:text-white
            ">

              {t.no_provider_configured}

            </p>

            <p className="
              mt-3

              text-gray-500
            ">

              {t.add_provider_description}

            </p>

          </div>

        )

      }

      {/* CONFIGURED */}

      {

        configuredProviders.length > 0 && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            {

              configuredProviders.map(

                provider => {

                  const link =

                    links.find(

                      item =>

                        item.provider_id ===
                        provider.id

                    )

                  return (

                    <ProviderCard

                      key={
                        provider.id
                      }

                      category={
                        category
                      }

                      provider={
                        provider
                      }

                      business={
                        business
                      }

                      link={
                        link
                      }

                      t={t}

                      onClick={
                        onEdit
                      }

                    />

                  )

                }

              )

            }

          </div>

        )

      }

    </div>

  )

}