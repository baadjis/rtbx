'use client'

import { Clock } from 'lucide-react'

import { getDayLabel } from '@/lib/business-opening-hours/days'
import { LangType } from '@/lib/lang/types'

type Hour = {

  day_of_week: number

  is_closed: boolean

  open_time: string | null

  close_time: string | null

}

type Props = {

  lang: LangType

  hours: Hour[]

  setHours: (
    hours: Hour[]
  ) => void

}

export default function OpeningHoursSection({

  lang,

  hours,

  setHours

}: Props) {

  // =====================================================
  // UPDATE DAY
  // =====================================================

  function updateDay(

    day: number,

    patch: Partial<Hour>

  ) {

    setHours(

      hours.map(
        item =>

          item.day_of_week === day

            ? {
                ...item,
                ...patch
              }

            : item
      )

    )

  }

  // =====================================================
  // COPY MONDAY
  // =====================================================

  function copyMondayToAll() {

    const monday =
      hours.find(
        item =>
          item.day_of_week === 0
      )

    if (!monday) return

    setHours(

      hours.map(
        item =>

          item.day_of_week === 0

            ? item

            : {

                ...item,

                is_closed:
                  monday.is_closed,

                open_time:
                  monday.open_time,

                close_time:
                  monday.close_time

              }

      )

    )

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-6">

      {/* ACTIONS */}

      <div className="flex justify-end">

        <button

          type="button"

          onClick={
            copyMondayToAll
          }

          className="
            px-4 py-2
            rounded-xl

            bg-indigo-50
            dark:bg-indigo-500/10

            text-indigo-600
            dark:text-indigo-400

            text-sm
            font-black
          "

        >

          {lang === 'fr'

            ? 'Copier lundi sur tous les jours'

            : 'Copy Monday to all days'}

        </button>

      </div>

      {/* DAYS */}

      <div className="space-y-4">

        {hours.map(
          day => (

            <div

              key={
                day.day_of_week
              }

              className="
                bg-white
                dark:bg-slate-900

                border
                border-gray-100
                dark:border-slate-800

                rounded-[2rem]

                p-5

                flex
                flex-col
                lg:flex-row

                lg:items-center

                gap-5
              "

            >

              {/* DAY */}

              <div className="
                min-w-[160px]

                flex items-center
                gap-3
              ">

                <div className="
                  w-10 h-10

                  rounded-xl

                  bg-indigo-50
                  dark:bg-indigo-500/10

                  text-indigo-600

                  flex
                  items-center
                  justify-center
                ">

                  <Clock size={18} />

                </div>

                <span className="
                  font-black

                  text-gray-900
                  dark:text-white
                ">

                  {getDayLabel(
                    day.day_of_week,
                    lang
                  )}

                </span>

              </div>

              {/* OPEN SWITCH */}

              <label className="
                flex
                items-center
                gap-2

                font-bold

                text-gray-600
                dark:text-slate-300
              ">

                <input

                  type="checkbox"

                  checked={
                    !day.is_closed
                  }

                  onChange={(
                    e
                  ) =>

                    updateDay(

                      day.day_of_week,

                      {

                        is_closed:
                          !e.target
                            .checked

                      }

                    )

                  }

                />

                {lang === 'fr'
                  ? 'Ouvert'
                  : 'Open'}

              </label>

              {/* HOURS */}

              {!day.is_closed ? (

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                ">

                  <input

                    type="time"

                    value={
                      day.open_time ||
                      ''
                    }

                    onChange={(
                      e
                    ) =>

                      updateDay(

                        day.day_of_week,

                        {

                          open_time:
                            e.target
                              .value

                        }

                      )

                    }

                    className="
                      px-4 py-3

                      rounded-xl

                      bg-gray-50
                      dark:bg-slate-800

                      border-none
                    "

                  />

                  <span className="
                    font-black
                    text-gray-400
                  ">

                    →

                  </span>

                  <input

                    type="time"

                    value={
                      day.close_time ||
                      ''
                    }

                    onChange={(
                      e
                    ) =>

                      updateDay(

                        day.day_of_week,

                        {

                          close_time:
                            e.target
                              .value

                        }

                      )

                    }

                    className="
                      px-4 py-3

                      rounded-xl

                      bg-gray-50
                      dark:bg-slate-800

                      border-none
                    "

                  />

                </div>

              ) : (

                <div className="
                  text-sm

                  font-bold

                  text-gray-400
                ">

                  {lang === 'fr'
                    ? 'Fermé'
                    : 'Closed'}

                </div>

              )}

            </div>

          )
        )}

      </div>

    </div>

  )

}