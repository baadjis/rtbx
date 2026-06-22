/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Trophy,
  Pencil
} from 'lucide-react'

type LoyaltySettingsForm = {

  enabled: boolean

  points_per_visit: number

  welcome_bonus_points: number

}

type Props = {

  form: LoyaltySettingsForm

  t: any

  onEdit: () => void

}

export default function LoyaltySettingsSection({

  form,

  t,

  onEdit

}: Props) {

  return (

    <div className="
      bg-white dark:bg-slate-900
      border border-gray-100 dark:border-slate-800
      rounded-[3rem]
      p-8
      shadow-sm
      space-y-8
    ">

      {/* HEADER */}

      <div className="
        flex items-center
        justify-between
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

            <Trophy size={24} />

          </div>

          <div>

            <h2 className="
              text-2xl
              font-black
              text-gray-900
              dark:text-white
            ">

              {t.loyalty_settings}

            </h2>

            <p className="
              text-sm
              text-gray-500
              dark:text-slate-400
            ">

              {t.manage_loyalty_program}

            </p>

          </div>

        </div>

        <button

          onClick={onEdit}

          className="
            px-5 py-3

            rounded-2xl

            bg-indigo-600
            hover:bg-indigo-700

            text-white

            font-black

            flex items-center
            gap-2

            transition-all
          "

        >

          <Pencil size={18} />

          {t.edit}

        </button>

      </div>

      {/* CONTENT */}

      <div className="
        grid
        md:grid-cols-3
        gap-4
      ">

        {/* STATUS */}

        <div className="
          p-5
          rounded-2xl

          bg-gray-50
          dark:bg-slate-800
        ">

          <p className="
            text-xs
            uppercase
            tracking-widest
            font-black
            text-gray-400
          ">

            {t.loyalty_program}

          </p>

          <p className="
            mt-2
            text-lg
            font-black
            text-gray-900
            dark:text-white
          ">

            {

              form.enabled

                ? t.active

                : t.disabled

            }

          </p>

        </div>

        {/* POINTS */}

        <div className="
          p-5
          rounded-2xl

          bg-gray-50
          dark:bg-slate-800
        ">

          <p className="
            text-xs
            uppercase
            tracking-widest
            font-black
            text-gray-400
          ">

            {t.points_per_visit}

          </p>

          <p className="
            mt-2
            text-lg
            font-black
            text-gray-900
            dark:text-white
          ">

            {form.points_per_visit}

          </p>

        </div>

        {/* BONUS */}

        <div className="
          p-5
          rounded-2xl

          bg-gray-50
          dark:bg-slate-800
        ">

          <p className="
            text-xs
            uppercase
            tracking-widest
            font-black
            text-gray-400
          ">

            {t.welcome_bonus}

          </p>

          <p className="
            mt-2
            text-lg
            font-black
            text-gray-900
            dark:text-white
          ">

            {form.welcome_bonus_points}

          </p>

        </div>

      </div>

    </div>

  )

}