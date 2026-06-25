/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { X } from 'lucide-react'

type Props = {

  open: boolean

  providers: any[]

  t: any

  onClose: () => void

  onSelect: (
    provider: any
  ) => void

}

export default function ReviewProviderPickerModal({

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
      flex items-center justify-center
      p-4
    ">

      <div className="
        w-full
        max-w-2xl

        bg-white
        dark:bg-slate-900

        rounded-[2rem]

        border
        border-gray-100
        dark:border-slate-800

        p-8
      ">

        <div className="
          flex items-center
          justify-between
          mb-6
        ">

          <h2 className="
            text-2xl
            font-black
          ">

            {t.add_review_platform}

          </h2>

          <button
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

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

                  text-left

                  hover:border-indigo-500

                  border
                  border-transparent

                  transition-all
                "

              >

                <div className="
                  font-black
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