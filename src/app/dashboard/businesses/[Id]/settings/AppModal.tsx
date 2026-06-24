/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {

  useEffect,
  useState

} from 'react'

import {

  X,
  Smartphone

} from 'lucide-react'
import { APP_PROVIDERS } from '@/utils/app-providers'



type Props = {

  open: boolean

  providerId: string

  value?: string

  t: any

  onClose: () => void

  onSave: (
    data: {

      provider_id: string

      value: string

    }

  ) => Promise<void>

}

export default function AppModal({

  open,

  providerId,

  value,

  t,

  onClose,

  onSave

}: Props) {

  const [url,setUrl] =
    useState('')

  const [loading,setLoading] =
    useState(false)

  useEffect(() => {

    if (!open)
      return

    setUrl(
      value || ''
    )

  }, [

    open,
    value

  ])

  if (!open)
    return null

  const provider =
    APP_PROVIDERS[
      providerId as keyof typeof APP_PROVIDERS
    ]

  async function handleSubmit() {

    try {

      setLoading(true)

      await onSave({

        provider_id:
          providerId,

        value:
          url

      })

      onClose()

    } finally {

      setLoading(false)

    }

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
        max-w-lg

        bg-white
        dark:bg-slate-900

        rounded-[2.5rem]

        p-8

        space-y-6
      ">

        <div className="
          flex items-center
          justify-between
        ">

          <div className="
            flex items-center
            gap-3
          ">

            <Smartphone />

            <h2 className="
              text-xl
              font-black
            ">

              {provider?.label?.en}

            </h2>

          </div>

          <button
            onClick={onClose}
          >

            <X />

          </button>

        </div>

        <input

          value={url}

          onChange={(e) =>
            setUrl(
              e.target.value
            )
          }

          placeholder="https://"

          className="
            w-full

            px-5 py-4

            rounded-2xl

            bg-gray-50
            dark:bg-slate-800

            border-none
          "

        />

        <button

          onClick={
            handleSubmit
          }

          disabled={
            loading
          }

          className="
            w-full

            py-4

            rounded-2xl

            bg-indigo-600

            text-white

            font-black
          "

        >

          {

            loading

              ? t.saving

              : t.save

          }

        </button>

      </div>

    </div>

  )

}