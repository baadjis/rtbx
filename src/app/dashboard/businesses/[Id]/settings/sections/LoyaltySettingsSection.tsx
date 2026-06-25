/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Trophy,
  Pencil,
  Plus
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

  const hasProgram =
    form.enabled

  return (

    <div className="
      bg-white dark:bg-slate-900
      border border-gray-100 dark:border-slate-800
      rounded-[3rem]
      p-8
      shadow-sm
    ">

      {/* HEADER */}

      <div className="
        flex items-center
        gap-4
        mb-8
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

      {/* EMPTY STATE */}

      {!hasProgram && (

        <div className="
          rounded-[2rem]
          border-2
          border-dashed
          border-gray-200
          dark:border-slate-700

          p-10

          text-center
        ">

          <div className="
            mx-auto
            w-16 h-16

            rounded-2xl

            bg-indigo-50
            dark:bg-indigo-500/10

            text-indigo-600

            flex items-center
            justify-center

            mb-5
          ">

            <Trophy size={28} />

          </div>

          <h3 className="
            text-xl
            font-black
            text-gray-900
            dark:text-white
          ">

            {t.no_loyalty_program}
          </h3>

          <p className="
            mt-3
            text-gray-500
            dark:text-slate-400
            max-w-md
            mx-auto
          ">

            {t.create_loyalty_program_description}
          </p>

          <button

            onClick={onEdit}

            className="
              mt-6

              px-6 py-4

              rounded-2xl

              bg-indigo-600
              hover:bg-indigo-700

              text-white
              font-black

              flex items-center
              gap-2

              mx-auto
            "

          >

            <Plus size={18} />

            {t.create_loyalty_program}

          </button>

        </div>

      )}

      {/* CONFIGURED */}

      {hasProgram && (

        <div className="
          rounded-[2rem]
          bg-gray-50
          dark:bg-slate-800

          p-6

          flex flex-col
          md:flex-row

          md:items-center
          md:justify-between

          gap-6
        ">

          <div>

            <h3 className="
              text-lg
              font-black
              text-gray-900
              dark:text-white
            ">

              {t.loyalty_program_active}
            </h3>

            <div className="
              mt-3
              space-y-1

              text-sm
              text-gray-500
              dark:text-slate-400
            ">

              <p>

                {form.points_per_visit}
                {' '}
                {t.points_per_visit}

              </p>

              <p>

                {form.welcome_bonus_points}
                {' '}
                {t.welcome_bonus}

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
            "

          >

            <Pencil size={18} />

            {t.edit}

          </button>

        </div>

      )}

    </div>

  )

}