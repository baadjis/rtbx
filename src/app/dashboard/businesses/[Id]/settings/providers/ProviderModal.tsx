/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Save,
  X
} from 'lucide-react'

type Props = {

  open: boolean

  provider: any

  value: string

  onChange: (
    value: string
  ) => void

  loading?: boolean

  t: any

  onClose: () => void

  onSave: () => void

}

export default function ProviderModal({

  open,

  provider,

  value,

  onChange,

  loading,

  t,

  onClose,

  onSave

}: Props) {

  if (
    !open ||
    !provider
  ) {
    return null
  }

  return (

    <div className="
      fixed inset-0 z-50
      flex items-center justify-center
      p-4
    ">

      <div

        className="
          absolute inset-0
          bg-black/50
        "

        onClick={onClose}

      />

      <div className="
        relative

        w-full
        max-w-lg

        bg-white
        dark:bg-slate-900

        rounded-[2rem]

        border
        border-gray-100
        dark:border-slate-800

        shadow-2xl
      ">

        <div className="
          flex items-center justify-between

          p-6

          border-b
          border-gray-100
          dark:border-slate-800
        ">

          <h2 className="
            text-2xl
            font-black
          ">

            {provider.name}

          </h2>

          <button

            onClick={onClose}

            className="
              w-10 h-10

              rounded-xl

              bg-gray-100
              dark:bg-slate-800

              flex items-center justify-center
            "
          >

            <X size={18} />

          </button>

        </div>

        <div className="p-6">

          <label className="
            block mb-2

            text-xs
            uppercase

            tracking-widest

            font-black

            text-gray-400
          ">

            {provider.field}

          </label>

          <input

            value={value}

            onChange={(e) =>
              onChange(
                e.target.value
              )
            }

            placeholder={
              provider.placeholder
            }

            className="
              w-full

              p-4

              rounded-2xl

              bg-gray-50
              dark:bg-slate-800

              border-none
            "

          />

        </div>

        <div className="
          p-6

          flex justify-end gap-3

          border-t
          border-gray-100
          dark:border-slate-800
        ">

          <button

            onClick={onClose}

            className="
              px-5 py-3

              rounded-2xl

              bg-gray-100
              dark:bg-slate-800

              font-bold
            "
          >

            {t.cancel}

          </button>

          <button

            disabled={loading}

            onClick={onSave}

            className="
              px-5 py-3

              rounded-2xl

              bg-indigo-600

              text-white

              font-black

              flex items-center gap-2
            "
          >

            <Save size={16} />

            {t.save}

          </button>

        </div>

      </div>

    </div>

  )

}