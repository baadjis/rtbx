/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Trash2
} from 'lucide-react'

type Props = {

  t: any

  onDelete: () => void

}

export default function BusinessDangerSection({

  t,

  onDelete

}: Props) {

  return (

    <div className="
      bg-white dark:bg-slate-900

      border border-red-200
      dark:border-red-900/50

      rounded-[3rem]

      p-8

      shadow-sm
    ">

      <div className="
        flex flex-col
        md:flex-row

        md:items-center
        md:justify-between

        gap-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-black

            text-red-600
          ">

            {t.danger_zone}

          </h2>

          <p className="
            mt-2

            text-sm

            text-gray-500
            dark:text-slate-400
          ">

            {t.delete_business_description}

          </p>

        </div>

        <button

          onClick={onDelete}

          className="
            px-6 py-4

            rounded-2xl

            bg-red-600
            hover:bg-red-700

            text-white

            font-black

            flex items-center
            gap-3

            border-none
            cursor-pointer

            transition-all
          "

        >

          <Trash2 size={18} />

          {t.delete_business}

        </button>

      </div>

    </div>

  )

}