/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { X, Calendar } from 'lucide-react'

type Props = {

  open: boolean

  providers: any[]

  t: any

  onClose: () => void

  onSelect: (
    provider: any
  ) => void

}

export default function BookingProviderPickerModal({

  open,

  providers,

  t,

  onClose,

  onSelect

}: Props) {

  if (!open) {
    return null
  }

  return (

    <div className="
      fixed inset-0 z-50

      bg-black/50

      flex items-center
      justify-center

      p-4
    ">

      <div className="
        w-full
        max-w-2xl

        bg-white
        dark:bg-slate-900

        border
        border-gray-100
        dark:border-slate-800

        rounded-[2.5rem]

        shadow-2xl

        p-8
      ">

        {/* HEADER */}

        <div className="
          flex items-center
          justify-between

          mb-8
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

              flex
              items-center
              justify-center
            ">

              <Calendar size={24} />

            </div>

            <div>

              <h2 className="
                text-2xl
                font-black
              ">

                {t.add_booking_platform}

              </h2>

              <p className="
                text-sm
                text-gray-500
                dark:text-slate-400
              ">

                {t.booking_platforms_description}

              </p>

            </div>

          </div>

          <button

            onClick={onClose}

            className="
              p-3

              rounded-xl

              bg-gray-100
              dark:bg-slate-800
            "

          >

            <X size={18} />

          </button>

        </div>

        {/* PROVIDERS */}

        <div className="
          grid
          md:grid-cols-2
          gap-4
        ">

          {providers.map(
            provider => (

              <button

                key={
                  provider.id
                }

                onClick={() =>
                  onSelect(
                    provider
                  )
                }

                className="
                  p-5

                  rounded-2xl

                  bg-gray-50
                  dark:bg-slate-800

                  border
                  border-transparent

                  hover:border-indigo-500

                  text-left

                  transition-all
                "

              >

                <div className="
                  font-black

                  text-gray-900
                  dark:text-white
                ">

                  {

                    provider.label?.en ||

                    provider.name ||

                    provider.id

                  }

                </div>

              </button>

            )
          )}

        </div>

      </div>

    </div>

  )

}