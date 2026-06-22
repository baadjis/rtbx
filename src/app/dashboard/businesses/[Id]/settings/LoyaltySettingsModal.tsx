/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  Trophy,
  X
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

type LoyaltySettings = {

  enabled: boolean

  points_per_visit: number

  welcome_bonus_points: number

}

type Props = {

  open: boolean

  settings: LoyaltySettings

  t: any

  onClose: () => void

  onSave: (
    data: LoyaltySettings
  ) => Promise<void>

}

export default function LoyaltySettingsModal({

  open,

  settings,

  t,

  onClose,

  onSave

}: Props) {

  const [loading,setLoading] =
    useState(false)

  const [form,setForm] =
    useState<LoyaltySettings>({

      enabled: true,

      points_per_visit: 1,

      welcome_bonus_points: 0

    })

  useEffect(() => {

    if (!open)
      return

    setForm({

      enabled:
        settings?.enabled ?? true,

      points_per_visit:
        settings?.points_per_visit ?? 1,

      welcome_bonus_points:
        settings?.welcome_bonus_points ?? 0

    })

  }, [
    open,
    settings
  ])

  if (!open)
    return null

  async function handleSubmit() {

    try {

      setLoading(true)

      await onSave(
        form
      )

      onClose()

    } catch (err) {

      console.error(err)

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
        max-w-xl

        bg-white
        dark:bg-slate-900

        border
        border-gray-100
        dark:border-slate-800

        rounded-[2.5rem]

        shadow-2xl

        p-8

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

        {/* ENABLE */}

        <div className="
          flex items-center
          justify-between

          p-5

          rounded-2xl

          bg-gray-50
          dark:bg-slate-800
        ">

          <div>

            <h3 className="
              font-black

              text-gray-900
              dark:text-white
            ">

              {t.loyalty_program}

            </h3>

            <p className="
              text-sm
              text-gray-500
            ">

              {t.enable_loyalty_program}

            </p>

          </div>

          <input

            type="checkbox"

            checked={
              form.enabled
            }

            onChange={(e) =>

              setForm({

                ...form,

                enabled:
                  e.target.checked

              })

            }

          />

        </div>

        {/* SETTINGS */}

        <div className="
          grid
          md:grid-cols-2
          gap-6
        ">

          <div>

            <label className="
              block
              mb-2

              font-black
            ">

              {t.points_per_visit}

            </label>

            <input

              type="number"

              min={1}

              value={
                form.points_per_visit
              }

              onChange={(e) =>

                setForm({

                  ...form,

                  points_per_visit:
                    Number(
                      e.target.value
                    )

                })

              }

              className="
                w-full

                px-5 py-4

                rounded-2xl

                bg-gray-50
                dark:bg-slate-800

                border-none
              "

            />

          </div>

          <div>

            <label className="
              block
              mb-2

              font-black
            ">

              {t.welcome_bonus}

            </label>

            <input

              type="number"

              min={0}

              value={
                form.welcome_bonus_points
              }

              onChange={(e) =>

                setForm({

                  ...form,

                  welcome_bonus_points:
                    Number(
                      e.target.value
                    )

                })

              }

              className="
                w-full

                px-5 py-4

                rounded-2xl

                bg-gray-50
                dark:bg-slate-800

                border-none
              "

            />

          </div>

        </div>

        {/* SAVE */}

        <button

          onClick={
            handleSubmit
          }

          disabled={
            loading
          }

          className="
            w-full

            py-5

            rounded-[2rem]

            bg-indigo-600
            hover:bg-indigo-700

            text-white

            font-black

            transition-all
          "

        >

          {

            loading

              ? t.saving

              : t.save_changes

          }

        </button>

      </div>

    </div>

  )

}