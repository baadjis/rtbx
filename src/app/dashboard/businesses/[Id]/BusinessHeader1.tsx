/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'

import {
  ExternalLink,
  MapPin,
  QrCode,
  Star,
  Link2,
  ShieldCheck,
  Globe,
  ArrowRight,
  Settings2,
  ScanLine
} from 'lucide-react'

export default function BusinessHeader({
  business,
  t
}: {
  business: any
  t: any
}) {

  const hasGoogle =
    !!business.google_place_id

  const hasSpace =
    !!business.space_id

  const hasSocials =
    business.social_links?.length > 0

  return (

    <div className="
      bg-white dark:bg-slate-900
      rounded-[3rem]
      border border-gray-100 dark:border-slate-800
      shadow-sm
      overflow-hidden
    ">

      {/* ===================================================== */}
      {/* TOP */}
      {/* ===================================================== */}

      <div className="
        p-8 md:p-12
        flex flex-col xl:flex-row
        justify-between
        gap-10
      ">

        {/* LEFT */}

        <div className="space-y-5">

          {/* TITLE */}

          <div className="space-y-3">

            <div className="flex items-center gap-4">

              <div className="
                w-14 h-14
                rounded-2xl
                bg-indigo-600
                flex items-center justify-center
                shadow-xl shadow-indigo-200
              ">

                <Star className="
                  text-white
                  w-7 h-7
                  fill-current
                " />

              </div>

              <div>

                <div className="
                  flex items-center
                  gap-2 flex-wrap
                ">

                  <h1 className="
                    text-3xl md:text-5xl
                    font-black
                    tracking-tight
                    text-gray-900 dark:text-white
                  ">

                    {business.name}

                  </h1>

                  {business.verified && (

                    <div className="
                      px-3 py-1
                      rounded-full
                      bg-green-100 dark:bg-green-500/10
                      text-green-600
                      text-[10px]
                      font-black
                      uppercase tracking-widest
                      flex items-center gap-1
                    ">

                      <ShieldCheck size={12} />

                      Verified

                    </div>

                  )}

                </div>

                <div className="
                  mt-2
                  flex items-center gap-2
                  text-gray-500 dark:text-slate-400
                  font-medium
                ">

                  <MapPin
                    size={16}
                    className="text-indigo-600"
                  />

                  <span className="text-sm md:text-base">

                    {business.address}

                    {business.city &&
                      `, ${business.city}`}

                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* STATUS */}

          <div className="
            flex flex-wrap gap-3
          ">

            <div className="
              px-4 py-2
              rounded-2xl
              bg-gray-50 dark:bg-slate-800
              border border-gray-100 dark:border-slate-700
              text-xs font-black uppercase tracking-wider
              text-gray-500 dark:text-slate-400
            ">

              {business.business_type || 'business'}

            </div>

            {hasGoogle && (

              <div className="
                px-4 py-2
                rounded-2xl
                bg-amber-50 dark:bg-amber-500/10
                border border-amber-100 dark:border-amber-500/20
                text-xs font-black uppercase tracking-wider
                text-amber-600
              ">

                Google Connected

              </div>

            )}

            {hasSpace && (

              <div className="
                px-4 py-2
                rounded-2xl
                bg-indigo-50 dark:bg-indigo-500/10
                border border-indigo-100 dark:border-indigo-500/20
                text-xs font-black uppercase tracking-wider
                text-indigo-600
              ">

                Space Connected

              </div>

            )}

          </div>

        </div>

        {/* RIGHT */}

        <div className="
          flex flex-wrap
          gap-3
          items-start
        ">

          {/* LOYALTY SCAN */}

          <Link
            href="/scan"
            className="
              flex items-center gap-2
              px-6 py-4
              bg-indigo-600
              text-white
              rounded-2xl
              font-black
              hover:bg-indigo-700
              shadow-lg shadow-indigo-200
              dark:shadow-none
              transition-all
              no-underline
              text-sm
            "
          >

            <ScanLine size={18} />

            {t.scan_customer}

          </Link>

          {/* SETTINGS */}

          <Link
            href={`/dashboard/business/${business.id}/settings`}
            className="
              flex items-center gap-2
              px-6 py-4
              bg-gray-50 dark:bg-slate-800
              text-gray-700 dark:text-slate-300
              rounded-2xl
              font-bold
              hover:bg-indigo-50
              dark:hover:bg-indigo-900/30
              hover:text-indigo-600
              transition-all
              no-underline
              text-sm
              border border-gray-100 dark:border-slate-700
            "
          >

            <Settings2 size={16} />

            {t.settings}

          </Link>

        </div>

      </div>

      {/* ===================================================== */}
      {/* QUICK ACTIONS */}
      {/* ===================================================== */}

      <div className="
        border-t border-gray-100
        dark:border-slate-800
        p-6 md:p-8
        bg-gray-50/50
        dark:bg-slate-900/40
      ">

        <div className="
          flex items-center gap-2
          mb-6
        ">

          <div className="
            w-10 h-10
            rounded-2xl
            bg-indigo-100 dark:bg-indigo-500/10
            text-indigo-600
            flex items-center justify-center
          ">

            <Globe size={18} />

          </div>

          <div>

            <h3 className="
              text-xl
              font-black
              text-gray-900 dark:text-white
            ">

              {t.quick_actions}

            </h3>

            <p className="
              text-sm
              text-gray-500 dark:text-slate-400
              font-medium
            ">

              {t.quick_actions_subtitle}

            </p>

          </div>

        </div>

        {/* CARDS */}

        <div className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          {/* GOOGLE REVIEWS */}

          <Link
            href={`/tools/google-review?business=${business.id}`}
            className="
              group
              rounded-[2rem]
              bg-white dark:bg-slate-900
              border border-gray-100 dark:border-slate-800
              p-5
              space-y-4
              no-underline
              hover:-translate-y-1
              transition-all
            "
          >

            <div className="
              w-12 h-12
              rounded-2xl
              bg-amber-100 dark:bg-amber-500/10
              text-amber-600
              flex items-center justify-center
            ">

              <QrCode size={20} />

            </div>

            <div>

              <h4 className="
                text-lg
                font-black
                text-gray-900 dark:text-white
              ">

                {t.google_review_qr}

              </h4>

              <p className="
                mt-1
                text-sm
                text-gray-500 dark:text-slate-400
                leading-relaxed
              ">

                {hasGoogle
                  ? t.manage_google_review_qr
                  : t.generate_google_review_qr
                }

              </p>

            </div>

            <div className="
              flex items-center gap-2
              text-indigo-600
              font-black
              text-sm
            ">

              {t.open_tool}

              <ArrowRight size={16} />

            </div>

          </Link>

          {/* SOCIAL LINKS */}

          <button
            className="
              group
              rounded-[2rem]
              bg-white dark:bg-slate-900
              border border-gray-100 dark:border-slate-800
              p-5
              space-y-4
              text-left
              hover:-translate-y-1
              transition-all
              cursor-pointer
            "
          >

            <div className="
              w-12 h-12
              rounded-2xl
              bg-cyan-100 dark:bg-cyan-500/10
              text-cyan-600
              flex items-center justify-center
            ">

              <Link2 size={20} />

            </div>

            <div>

              <h4 className="
                text-lg
                font-black
                text-gray-900 dark:text-white
              ">

                {t.social_links}

              </h4>

              <p className="
                mt-1
                text-sm
                text-gray-500 dark:text-slate-400
                leading-relaxed
              ">

                {hasSocials
                  ? t.manage_social_links
                  : t.add_social_links
                }

              </p>

            </div>

            <div className="
              flex items-center gap-2
              text-indigo-600
              font-black
              text-sm
            ">

              {hasSocials
                ? t.manage
                : t.add_links
              }

              <ArrowRight size={16} />

            </div>

          </button>

          {/* CONNECT SPACE */}

          <Link
            href={`/dashboard/business/${business.id}/space`}
            className="
              group
              rounded-[2rem]
              bg-white dark:bg-slate-900
              border border-gray-100 dark:border-slate-800
              p-5
              space-y-4
              no-underline
              hover:-translate-y-1
              transition-all
            "
          >

            <div className="
              w-12 h-12
              rounded-2xl
              bg-violet-100 dark:bg-violet-500/10
              text-violet-600
              flex items-center justify-center
            ">

              <Globe size={20} />

            </div>

            <div>

              <h4 className="
                text-lg
                font-black
                text-gray-900 dark:text-white
              ">

                RTBX Space

              </h4>

              <p className="
                mt-1
                text-sm
                text-gray-500 dark:text-slate-400
                leading-relaxed
              ">

                {hasSpace
                  ? t.space_connected
                  : t.connect_space
                }

              </p>

            </div>

            <div className="
              flex items-center gap-2
              text-indigo-600
              font-black
              text-sm
            ">

              {hasSpace
                ? t.manage
                : t.connect
              }

              <ArrowRight size={16} />

            </div>

          </Link>

        </div>

      </div>

    </div>

  )

}