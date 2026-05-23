/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Building2,
  Globe,
  MapPin,
  Star,
  QrCode,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react'

type Props = {
  business: any
}

export default function BusinessPreview({
  business
}: Props) {

  const googleReviewUrl =
    business?.google_place_id
      ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
      : null

  return (

    <div className="sticky top-24">

      <div className="
        relative overflow-hidden
        rounded-[3rem]
        border border-slate-200/60 dark:border-slate-800
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur-2xl
        shadow-[0_40px_120px_rgba(79,70,229,0.10)]
      ">

        {/* BACKGROUND */}

        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-indigo-500/5
          via-violet-500/5
          to-cyan-500/5
        " />

        <div className="
          absolute -top-24 -right-24
          w-72 h-72
          rounded-full
          bg-indigo-500/10
          blur-3xl
        " />

        {/* CONTENT */}

        <div className="relative p-8 md:p-10">

          {/* HEADER */}

          <div className="flex items-start gap-5">

            {/* AVATAR */}

            <div
              className="
                w-24 h-24
                rounded-[2rem]
                overflow-hidden
                flex items-center justify-center
                shadow-xl
                border border-white/20
                shrink-0
              "
              style={{
                background:
                  business?.theme_color ||
                  'linear-gradient(135deg,#6366f1,#9333ea)'
              }}
            >

              {business?.avatar_url ? (

                <img
                  src={business.avatar_url}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="
                  w-full h-full
                  bg-slate-950
                  flex items-center justify-center
                ">

                  <Building2
                    size={34}
                    className="text-white"
                  />

                </div>

              )}

            </div>

            {/* INFOS */}

            <div className="flex-1 min-w-0">

              <div className="
                inline-flex items-center gap-2
                px-3 py-1.5
                rounded-full
                bg-indigo-500/10
                border border-indigo-500/20
                text-indigo-600 dark:text-indigo-300
                text-[10px]
                font-black uppercase tracking-[0.25em]
                mb-4
              ">

                <Sparkles size={12} />

                BUSINESS

              </div>

              <h2 className="
                text-3xl md:text-4xl
                font-black
                tracking-tight
                text-slate-900 dark:text-white
                leading-none
              ">

                {business?.name || 'Your Business'}

              </h2>

              {business?.business_type && (

                <p className="
                  mt-3
                  text-xs uppercase
                  tracking-[0.25em]
                  font-black
                  text-slate-400
                ">

                  {business.business_type}

                </p>

              )}

            </div>

          </div>

          {/* ADDRESS */}

          {business?.address && (

            <div className="
              mt-8
              flex items-start gap-3
              p-5
              rounded-[2rem]
              bg-slate-50 dark:bg-slate-800/60
              border border-slate-100 dark:border-slate-700
            ">

              <div className="
                w-11 h-11
                rounded-2xl
                bg-indigo-500/10
                text-indigo-600
                flex items-center justify-center
                shrink-0
              ">

                <MapPin size={18} />

              </div>

              <div className="min-w-0">

                <p className="
                  text-[10px]
                  uppercase tracking-[0.25em]
                  font-black
                  text-slate-400
                  mb-2
                ">

                  Address

                </p>

                <p className="
                  text-sm
                  font-bold
                  text-slate-700 dark:text-slate-300
                  leading-relaxed
                ">

                  {business.address}

                </p>

              </div>

            </div>

          )}

          {/* WEBSITE */}

          {business?.website && (

            <div className="
              mt-5
              flex items-center gap-3
              p-5
              rounded-[2rem]
              bg-slate-50 dark:bg-slate-800/60
              border border-slate-100 dark:border-slate-700
            ">

              <div className="
                w-11 h-11
                rounded-2xl
                bg-cyan-500/10
                text-cyan-600
                flex items-center justify-center
                shrink-0
              ">

                <Globe size={18} />

              </div>

              <div className="flex-1 min-w-0">

                <p className="
                  text-[10px]
                  uppercase tracking-[0.25em]
                  font-black
                  text-slate-400
                  mb-2
                ">

                  Website

                </p>

                <p className="
                  text-sm
                  font-bold
                  text-slate-700 dark:text-slate-300
                  truncate
                ">

                  {business.website}

                </p>

              </div>

            </div>

          )}

          {/* GOOGLE */}

          {business?.google_place_id && (

            <div className="
              mt-5
              rounded-[2rem]
              border border-amber-100 dark:border-amber-900/30
              bg-amber-50/70 dark:bg-amber-900/10
              p-6
            ">

              <div className="
                flex items-center gap-3
                mb-5
              ">

                <div className="
                  w-12 h-12
                  rounded-2xl
                  bg-white dark:bg-slate-900
                  shadow-sm
                  flex items-center justify-center
                ">

                  <Star
                    size={20}
                    className="text-amber-500 fill-amber-500"
                  />

                </div>

                <div>

                  <h3 className="
                    text-lg
                    font-black
                    text-slate-900 dark:text-white
                  ">

                    Google Reviews

                  </h3>

                  <p className="
                    text-xs
                    text-slate-500 dark:text-slate-400
                    font-medium
                  ">

                    Connected successfully

                  </p>

                </div>

              </div>

              <div className="
                grid grid-cols-2
                gap-4
              ">

                <div className="
                  p-4
                  rounded-2xl
                  bg-white/80 dark:bg-slate-900/80
                  border border-white/30 dark:border-slate-800
                ">

                  <div className="
                    flex items-center gap-2
                    text-amber-500
                    mb-2
                  ">

                    <Star
                      size={16}
                      className="fill-amber-500"
                    />

                    <span className="
                      text-xs
                      font-black uppercase
                    ">

                      Rating

                    </span>

                  </div>

                  <p className="
                    text-2xl
                    font-black
                    text-slate-900 dark:text-white
                  ">

                    {business.google_rating || '—'}

                  </p>

                </div>

                <div className="
                  p-4
                  rounded-2xl
                  bg-white/80 dark:bg-slate-900/80
                  border border-white/30 dark:border-slate-800
                ">

                  <div className="
                    flex items-center gap-2
                    text-indigo-500
                    mb-2
                  ">

                    <CheckCircle2 size={16} />

                    <span className="
                      text-xs
                      font-black uppercase
                    ">

                      Reviews

                    </span>

                  </div>

                  <p className="
                    text-2xl
                    font-black
                    text-slate-900 dark:text-white
                  ">

                    {business.google_reviews_total || '—'}

                  </p>

                </div>

              </div>

              {googleReviewUrl && (

                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-5
                    inline-flex items-center gap-2
                    text-sm
                    font-black
                    text-amber-600
                    hover:gap-3
                    transition-all
                    no-underline
                  "
                >

                  <ExternalLink size={16} />

                  Open Google Review Page

                </a>

              )}

            </div>

          )}

          {/* FUTURE */}

          <div className="
            mt-8
            rounded-[2rem]
            border border-dashed border-slate-200 dark:border-slate-700
            p-6
            text-center
          ">

            <div className="
              w-14 h-14
              rounded-2xl
              bg-indigo-500/10
              text-indigo-600
              flex items-center justify-center
              mx-auto mb-4
            ">

              <QrCode size={24} />

            </div>

            <h4 className="
              text-lg
              font-black
              text-slate-900 dark:text-white
              mb-2
            ">

              More features coming

            </h4>

            <p className="
              text-sm
              text-slate-500 dark:text-slate-400
              leading-relaxed
              font-medium
            ">

              Add QR codes, social links,
              branding and connect your
              RTBX Space later.

            </p>

          </div>

        </div>

      </div>

    </div>

  )
}