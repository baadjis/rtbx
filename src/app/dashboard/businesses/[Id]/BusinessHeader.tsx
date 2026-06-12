/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'

import {
  Star,
  MapPin,
  ScanLine,
  Settings,
  ExternalLink,
  CheckCircle2
} from 'lucide-react'

export default function BusinessHeader({
  business,
  t
}: {
  business: any
  t: any
}) {

  const mapsUrl =
    business.google_place_id
      ? `https://www.google.com/maps/search/?api=1&query_place_id=${business.google_place_id}`
      : null

  return (

    <div
      className="
        bg-white dark:bg-slate-900
        border border-gray-100 dark:border-slate-800
        rounded-[3rem]
        p-8 md:p-12
        shadow-sm
        flex flex-col xl:flex-row
        justify-between
        gap-8
      "
    >

      {/* ================================================= */}
      {/* LEFT */}
      {/* ================================================= */}

      <div className="space-y-4">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-indigo-600
              flex items-center justify-center
              shadow-lg
            "
          >

            <Star
              className="
                text-white
                w-7 h-7
                fill-current
              "
            />

          </div>

          <div>

            <h1
              className="
                text-3xl md:text-5xl
                font-black
                tracking-tight
                text-gray-900 dark:text-white
              "
            >

              {business.name}

            </h1>

            {business.business_type && (

              <p
                className="
                  text-sm
                  font-bold
                  text-indigo-600
                  uppercase
                  tracking-wider
                  mt-1
                "
              >

                {business.business_type}

              </p>

            )}

          </div>

        </div>

        {business.address && (

          <div
            className="
              flex items-center gap-2
              text-gray-500 dark:text-slate-400
              font-medium
            "
          >

            <MapPin
              size={18}
              className="text-indigo-600"
            />

            <span>

              {business.address}

            </span>

          </div>

        )}

        <div className="flex flex-wrap gap-2">

          {business.verified && (

            <div
              className="
                inline-flex items-center gap-2
                px-3 py-2
                rounded-xl
                bg-green-50
                dark:bg-green-500/10
                text-green-600
                dark:text-green-400
                text-xs
                font-black
              "
            >

              <CheckCircle2 size={14} />

              {t.verified}

            </div>

          )}

          {business.google_place_id && (

            <div
              className="
                inline-flex items-center gap-2
                px-3 py-2
                rounded-xl
                bg-blue-50
                dark:bg-blue-500/10
                text-blue-600
                dark:text-blue-400
                text-xs
                font-black
              "
            >

              Google Connected

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* RIGHT */}
      {/* ================================================= */}

      <div className="flex flex-wrap gap-3">

        <Link
          href="/scan"
          className="
            flex items-center gap-2
            px-6 py-3
            rounded-2xl
            bg-indigo-600
            text-white
            font-black
            hover:bg-indigo-700
            transition-all
            no-underline
          "
        >

          <ScanLine size={18} />

          {t.scan_customer}

        </Link>

        <Link
          href={`/dashboard/business/${business.id}/settings`}
          className="
            flex items-center gap-2
            px-6 py-3
            rounded-2xl
            bg-gray-50 dark:bg-slate-800
            text-gray-700 dark:text-slate-300
            font-bold
            border border-gray-100 dark:border-slate-700
            hover:bg-indigo-50
            dark:hover:bg-indigo-900/30
            hover:text-indigo-600
            transition-all
            no-underline
          "
        >

          <Settings size={18} />

          {t.settings}

        </Link>

        {mapsUrl && (

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-2xl
              bg-gray-50 dark:bg-slate-800
              text-gray-700 dark:text-slate-300
              font-bold
              border border-gray-100 dark:border-slate-700
              hover:bg-indigo-50
              dark:hover:bg-indigo-900/30
              hover:text-indigo-600
              transition-all
              no-underline
            "
          >

            <ExternalLink size={18} />

            {t.view_on_maps}

          </a>

        )}

      </div>

    </div>

  )

}