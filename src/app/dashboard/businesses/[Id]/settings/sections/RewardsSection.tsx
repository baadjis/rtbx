/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Gift,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react'

type Props = {

  rewards: any[]

  t: any

  onCreate: () => void

  onEdit: (
    reward: any
  ) => void

  onDelete: (
    reward: any
  ) => void

}

export default function RewardsSection({

  rewards,

  t,

  onCreate,

  onEdit,

  onDelete

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

              {t.rewards}

            </h2>

            <p className="
              text-sm
              text-gray-500
            ">

              {t.manage_rewards}

            </p>

          </div>

        </div>

        <button

          onClick={onCreate}

          className="
            px-5 py-3
            rounded-2xl
            bg-indigo-600
            text-white
            font-black
            flex items-center
            gap-2
          "

        >

          <Plus size={18} />

          {t.add_reward}

        </button>

      </div>

      {/* LIST */}

      <div className="
        space-y-4
      ">

        {rewards.map(

          reward => (

            <div

              key={reward.id}

              className="
                p-5
                rounded-2xl
                border
                border-gray-100
                dark:border-slate-800

                flex
                items-center
                justify-between
              "

            >

              <div>

                <h3 className="
                  font-black
                  text-gray-900
                  dark:text-white
                ">

                  {reward.title}

                </h3>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">

                  {reward.points_required}
                  {' '}
                  {t.points}
                </p>

              </div>

              <div className="
                flex
                gap-2
              ">

                <button

                  onClick={() =>
                    onEdit(
                      reward
                    )
                  }

                  className="
                    p-3
                    rounded-xl
                    bg-gray-100
                    dark:bg-slate-800
                  "

                >

                  <Pencil size={18} />

                </button>

                <button

                  onClick={() =>
                    onDelete(
                      reward
                    )
                  }

                  className="
                    p-3
                    rounded-xl
                    bg-red-50
                    text-red-600
                  "

                >

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          )

        )}

      </div>

    </div>

  )

}