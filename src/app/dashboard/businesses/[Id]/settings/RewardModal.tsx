/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  Gift,
  X
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

type Props = {

  open: boolean

  reward?: any | null

  t: any

  onClose: () => void

  onSave: (
    data: {

      title: string

      description?: string

      points_required: number

      active: boolean

    }
  ) => Promise<void>

}

export default function RewardModal({

  open,

  reward,

  t,

  onClose,

  onSave

}: Props) {

  const [loading,setLoading] =
    useState(false)

  const [form,setForm] =
    useState({

      title: '',

      description: '',

      points_required: 50,

      active: true

    })

  useEffect(() => {

    if (!open)
      return

    setForm({

      title:
        reward?.title || '',

      description:
        reward?.description || '',

      points_required:
        reward?.points_required || 50,

      active:
        reward?.active ?? true

    })

  }, [
    open,
    reward
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

        rounded-[2.5rem]

        border
        border-gray-100
        dark:border-slate-800

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

              bg-amber-50
              dark:bg-amber-500/10

              text-amber-600

              flex items-center
              justify-center
            ">

              <Gift size={24} />

            </div>

            <div>

              <h2 className="
                text-2xl
                font-black
                text-gray-900
                dark:text-white
              ">

                {

                  reward

                    ? t.edit_reward

                    : t.create_reward

                }

              </h2>

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

        {/* TITLE */}

        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            {t.reward_name}

          </label>

          <input

            value={
              form.title
            }

            onChange={e =>

              setForm({

                ...form,

                title:
                  e.target.value

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

        {/* DESCRIPTION */}

        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            {t.reward_description}

          </label>

          <textarea

            value={
              form.description
            }

            onChange={e =>

              setForm({

                ...form,

                description:
                  e.target.value

              })

            }

            rows={4}

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

        {/* POINTS */}

        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            {t.points_required}

          </label>

          <input

            type="number"

            min={1}

            value={
              form.points_required
            }

            onChange={e =>

              setForm({

                ...form,

                points_required:
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

        {/* ACTIVE */}

        <label className="
          flex items-center
          gap-3

          font-bold
        ">

          <input

            type="checkbox"

            checked={
              form.active
            }

            onChange={e =>

              setForm({

                ...form,

                active:
                  e.target.checked

              })

            }

          />

          {t.active}

        </label>

        {/* FOOTER */}

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
          "

        >

          {t.save_reward}

        </button>

      </div>

    </div>

  )

}