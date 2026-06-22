/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CheckCircle2,
  Link2,
  Pencil
} from 'lucide-react'

type Props = {

  category: string

  provider: any

  link?: any

  business: any

  t: any

  onClick?: () => void

}

export default function ProviderCard({

  provider,
  link,
  t,
  onClick

}: Props) {

  const connected =
    !!link?.value

  return (

    <button

      onClick={onClick}

      className="
        w-full
        text-left
        p-6
        rounded-[2rem]
        border
        transition-all
        cursor-pointer

        bg-white
        dark:bg-slate-950

        hover:-translate-y-1

        border-gray-100
        dark:border-slate-800

        hover:border-indigo-200
        dark:hover:border-indigo-500/30

        shadow-sm
      "

    >

      {/* TOP */}

      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">

        <div>

          <h4 className="
            text-lg
            font-black
            text-gray-900
            dark:text-white
          ">

            {provider.name}

          </h4>

          <p className="
            text-sm
            text-gray-500
            dark:text-slate-400
            mt-1
          ">

            {provider.field}

          </p>

        </div>

        <div className="
          w-11 h-11
          rounded-2xl

          flex
          items-center
          justify-center

          bg-indigo-50
          dark:bg-indigo-500/10

          text-indigo-600
        ">

          <Link2 size={18} />

        </div>

      </div>

      {/* STATUS */}

      <div className="mt-6">

        {connected ? (

          <div className="
            flex
            items-center
            gap-2
            text-emerald-600
            font-bold
            text-sm
          ">

            <CheckCircle2
              size={16}
            />

            {t.connected}

          </div>

        ) : (

          <div className="
            text-gray-400
            font-bold
            text-sm
          ">

            {t.not_connected}

          </div>

        )}

      </div>

      {/* VALUE */}

      <div className="
        mt-4
        min-h-[48px]
      ">

        {connected ? (

          <div className="
            px-3 py-2
            rounded-xl

            bg-gray-50
            dark:bg-slate-800

            text-xs
            font-mono

            text-gray-700
            dark:text-slate-300

            truncate
          ">

            {link.value}

          </div>

        ) : (

          <div className="
            text-sm
            text-gray-400
            italic
          ">

            {provider.placeholder}

          </div>

        )}

      </div>

      {/* ACTION */}

      <div className="mt-5">

        <div className="
          inline-flex
          items-center
          gap-2

          px-4 py-2

          rounded-xl

          bg-indigo-50
          dark:bg-indigo-500/10

          text-indigo-600

          font-bold
          text-sm
        ">

          <Pencil size={14} />

          {connected
            ? t.edit
            : t.connect}

        </div>

      </div>

    </button>

  )

}