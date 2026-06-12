/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'

import {
  QrCode,
  Settings,
  ScanLine,
  ExternalLink
} from 'lucide-react'

type Props = {
  business: any
  t: any
}

export default function BusinessQuickActions({
  business,
  t
}: Props) {

  return (

    <div
      className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
      "
    >

      <Link
        href="/scan"
        className="
          bg-white dark:bg-slate-900
          border border-gray-100 dark:border-slate-800
          rounded-[2rem]
          p-5
          flex flex-col
          gap-3
          no-underline
          shadow-sm
          hover:-translate-y-1
          transition-all
        "
      >
        <div className="
          w-12 h-12
          rounded-2xl
          bg-indigo-50
          dark:bg-indigo-500/10
          text-indigo-600
          flex items-center justify-center
        ">
          <ScanLine size={22} />
        </div>

        <span className="
          font-black
          text-gray-900
          dark:text-white
        ">
          {t.scan_customer}
        </span>
      </Link>

      <Link
        href={`/tools/google-review?business=${business.id}`}
        className="
          bg-white dark:bg-slate-900
          border border-gray-100 dark:border-slate-800
          rounded-[2rem]
          p-5
          flex flex-col
          gap-3
          no-underline
          shadow-sm
          hover:-translate-y-1
          transition-all
        "
      >
        <div className="
          w-12 h-12
          rounded-2xl
          bg-yellow-50
          dark:bg-yellow-500/10
          text-yellow-600
          flex items-center justify-center
        ">
          <QrCode size={22} />
        </div>

        <span className="
          font-black
          text-gray-900
          dark:text-white
        ">
          {t.review_qr}
        </span>
      </Link>

      <Link
        href={`/dashboard/business/${business.id}/settings`}
        className="
          bg-white dark:bg-slate-900
          border border-gray-100 dark:border-slate-800
          rounded-[2rem]
          p-5
          flex flex-col
          gap-3
          no-underline
          shadow-sm
          hover:-translate-y-1
          transition-all
        "
      >
        <div className="
          w-12 h-12
          rounded-2xl
          bg-violet-50
          dark:bg-violet-500/10
          text-violet-600
          flex items-center justify-center
        ">
          <Settings size={22} />
        </div>

        <span className="
          font-black
          text-gray-900
          dark:text-white
        ">
          {t.settings}
        </span>
      </Link>

      {!!business.google_place_id && (

        <a
          href={`https://www.google.com/maps/search/?api=1&query_place_id=${business.google_place_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-white dark:bg-slate-900
            border border-gray-100 dark:border-slate-800
            rounded-[2rem]
            p-5
            flex flex-col
            gap-3
            no-underline
            shadow-sm
            hover:-translate-y-1
            transition-all
          "
        >
          <div className="
            w-12 h-12
            rounded-2xl
            bg-emerald-50
            dark:bg-emerald-500/10
            text-emerald-600
            flex items-center justify-center
          ">
            <ExternalLink size={22} />
          </div>

          <span className="
            font-black
            text-gray-900
            dark:text-white
          ">
            {t.view_on_maps}
          </span>
        </a>

      )}

    </div>

  )

}