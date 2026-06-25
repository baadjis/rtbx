/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Star,
  Plus,
  Pencil
} from 'lucide-react'

type Props = {

  links: any[]

  t: any

  onAdd: () => void

}

export default function ReviewsSection({

  links,

  t,

  onAdd

}: Props) {

  const configuredLinks =
    links.filter(
      item =>
        item.value?.trim()
    )

  const hasProviders =
    configuredLinks.length > 0

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

          <Star size={24} />

        </div>

        <div>

          <h2 className="
            text-2xl
            font-black
            text-gray-900
            dark:text-white
          ">

            {t.review_platforms}

          </h2>

          <p className="
            text-sm
            text-gray-500
            dark:text-slate-400
          ">

            {t.review_platforms_description}

          </p>

        </div>

      </div>

      {/* EMPTY */}

      {!hasProviders && (

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

            <Star size={28} />

          </div>

          <h3 className="
            text-xl
            font-black
            text-gray-900
            dark:text-white
          ">

            {t.no_review_providers}

          </h3>

          <p className="
            mt-3
            text-gray-500
            dark:text-slate-400
            max-w-md
            mx-auto
          ">

            {t.review_platforms_description}

          </p>

          <button

            onClick={onAdd}

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

            {t.add_review_platform}

          </button>

        </div>

      )}

      {/* CONFIGURED */}

      {hasProviders && (

        <div className="space-y-4">

          <div className="
            grid
            md:grid-cols-2
            gap-4
          ">

            {configuredLinks.map(
              (link) => (

                <div

                  key={link.id}

                  className="
                    p-5

                    rounded-2xl

                    bg-gray-50
                    dark:bg-slate-800

                    flex
                    items-center
                    justify-between
                    gap-4
                  "

                >

                  <div>

                    <p className="
                      font-black

                      text-gray-900
                      dark:text-white
                    ">

                      {link.provider_name ||
                        link.provider_id}

                    </p>

                    <p className="
                      text-sm
                      text-gray-500
                      truncate
                    ">

                      {link.value}

                    </p>

                  </div>

                </div>

              )
            )}

          </div>

          <button

            onClick={onAdd}

            className="
              w-full

              py-4

              rounded-2xl

              bg-indigo-600
              hover:bg-indigo-700

              text-white

              font-black

              flex items-center
              justify-center
              gap-2
            "

          >

            <Pencil size={18} />

            {t.manage_platforms}

          </button>

        </div>

      )}

    </div>

  )

}