/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import {
  Search,
  X
} from 'lucide-react'

import {
  getProviderGlyph
} from '@/lib/providers/getProviderAsset'

/*import {
  getProviderLogo
} from '@/lib/providers/getProviderAsset'

import {
  getProviderColor
} from '@/lib/providers/getProviderAsset'*/

type Props = {

  open: boolean

  title: string

  description: string

  providers: any[]

  t: any

  onClose: () => void

  onSelect: (
    provider: any
  ) => void

}

export default function ProviderPickerModal({

  open,

  title,

  description,

  providers,

  t,

  onClose,

  onSelect

}: Props) {

  const [

    search,

    setSearch

  ] = useState('')

  // =====================================================
  // FILTER
  // =====================================================

  const filteredProviders =
    useMemo(() => {

      const query =
        search
          .toLowerCase()
          .trim()

      if (!query) {

        return providers

      }

      return providers.filter(

        provider =>

          provider.label?.en
            ?.toLowerCase()
            .includes(query)

          ||

          provider.label?.fr
            ?.toLowerCase()
            .includes(query)

      )

    },

    [

      search,

      providers

    ])

  // =====================================================
  // CLOSE
  // =====================================================

  function handleClose() {

    setSearch('')

    onClose()

  }

  // =====================================================
  // SELECT
  // =====================================================

  function handleSelect(

    provider:any

  ) {

    setSearch('')

    onSelect(

      provider

    )

  }

  if (!open) {

    return null

  }


    return (

    <div className="
      fixed
      inset-0
      z-50

      bg-black/50

      flex
      items-center
      justify-center

      p-4
    ">

      <div className="
        w-full
        max-w-4xl

        max-h-[90vh]

        overflow-hidden

        bg-white
        dark:bg-slate-900

        border
        border-gray-100
        dark:border-slate-800

        rounded-[2.5rem]

        shadow-2xl

        flex
        flex-col
      ">

        {/* ============================================= */}

        {/* HEADER */}

        {/* ============================================= */}

        <div className="
          flex
          items-center
          justify-between

          p-8

          border-b
          border-gray-100
          dark:border-slate-800
        ">

          <div>

            <h2 className="
              text-3xl
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

            onClick={handleClose}

            className="
              w-12
              h-12

              rounded-xl

              bg-gray-100
              dark:bg-slate-800

              flex
              items-center
              justify-center
            "

          >

            <X size={20} />

          </button>

        </div>

        {/* SEARCH */}

        <div className="p-8 pb-0">

          <div className="
            relative
          ">

            <Search

              size={18}

              className="
                absolute

                left-5
                top-1/2

                -translate-y-1/2

                text-gray-400
              "

            />

            <input

              value={search}

              onChange={(e)=>

                setSearch(
                  e.target.value
                )

              }

              placeholder={
                t.search
              }

              className="
                w-full

                pl-14
                pr-5
                py-4

                rounded-2xl

                bg-gray-50
                dark:bg-slate-800

                border-none

                outline-none
              "

            />

          </div>

        </div>

        {/* LIST */}

        <div className="
          flex-1

          overflow-y-auto

          p-8
        ">

          <div className="
            grid

            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3

            gap-5
          ">

            {

              filteredProviders.map(

                provider => {

                  const glyph =
                    getProviderGlyph(
                      provider
                    )

                  

                  return (

                    <button

                      key={
                        provider.id
                      }

                      onClick={()=>

                        handleSelect(
                          provider
                        )

                      }

                      className="
                        text-left

                        rounded-[2rem]

                        border
                        border-gray-100
                        dark:border-slate-800

                        bg-white
                        dark:bg-slate-900

                        hover:border-indigo-500

                        transition-all

                        p-6
                      "

                    >

                      <div className="
                        flex
                        items-center
                        gap-4
                      ">

                        <div

                          className="
                            w-16
                            h-16

                            rounded-2xl

                            bg-gray-50
                            dark:bg-slate-800

                            flex
                            items-center
                            justify-center

                            overflow-hidden
                          "

                          

                        >

                          {

                            glyph 

                              ? (

                                  <Image

                                    src={
                                      glyph 
                                    }

                                    alt={
                                      provider.label.en
                                    }

                                    width={42}

                                    height={42}

                                  />

                                )

                              : (

                                  <span className="
                                    text-xl
                                    font-black
                                  ">

                                    {

                                      provider
                                        .label
                                        .en[0]

                                    }

                                  </span>

                                )

                          }

                        </div>

                        <div>

                          <h3 className="
                            font-black

                            text-gray-900
                            dark:text-white
                          ">

                            {

                              provider.label.fr
                              ??

                              provider.label.en

                            }

                          </h3>

                          <p className="
                            mt-1

                            text-sm

                            text-gray-500
                          ">

                            {

                              provider
                                .website

                            }

                          </p>

                        </div>

                      </div>

                    </button>

                  )

                }

              )

            }

          </div>

        </div>

      </div>

    </div>

  )

}