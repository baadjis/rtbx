/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Award,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'

type ReviewProvider = {

  provider: string

  rating?: number

  total?: number

}

type Props = {

  loyaltyStats: any

  reviewProviders?: ReviewProvider[]

  t: any

}

export default function Kpi({

  loyaltyStats,
  reviewProviders = [],
  t

}: Props) {

  // =====================================================
  // LABEL
  // =====================================================

  const getProviderLabel = (
    provider: string
  ) => {

    switch (
      provider?.toLowerCase()
    ) {

      case 'google':
        return t.google_reviews

      case 'trustpilot':
        return t.trustpilot_reviews

      case 'tripadvisor':
        return t.tripadvisor_reviews

      case 'booking':
        return t.booking_reviews

      default:
        return provider

    }

  }

  return (

    <div className="
      grid grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
    ">

      {/* =====================================================
          CUSTOMERS
      ===================================================== */}

      <div className="
        bg-white dark:bg-slate-900
        p-6
        rounded-[2.5rem]
        border border-gray-100 dark:border-slate-800
        shadow-sm
        group
      ">

        <div className="
          w-12 h-12
          bg-blue-50 dark:bg-blue-900/20
          text-blue-600 dark:text-blue-400
          rounded-2xl
          flex items-center justify-center
          mb-4
          group-hover:scale-110
          transition-transform
        ">
          
          <Users size={24} />

        </div>

        <p className="
          text-xs
          font-black
          text-gray-400 dark:text-gray-500
          uppercase tracking-widest
        ">

          {t.total_customers}

        </p>

        <h3 className="
          text-3xl
          font-black
          text-gray-900 dark:text-white
          mt-1
        ">

          {loyaltyStats.totalCustomers}

        </h3>

      </div>

      {/* =====================================================
          LOYALTY
      ===================================================== */}

      <div className="
        bg-white dark:bg-slate-900
        p-6
        rounded-[2.5rem]
        border border-gray-100 dark:border-slate-800
        shadow-sm
        group
      ">

        <div className="
          w-12 h-12
          bg-emerald-50 dark:bg-emerald-900/20
          text-emerald-600 dark:text-emerald-400
          rounded-2xl
          flex items-center justify-center
          mb-4
          group-hover:scale-110
          transition-transform
        ">

          <Award size={24} />

        </div>

        <p className="
          text-xs
          font-black
          text-gray-400 dark:text-gray-500
          uppercase tracking-widest
        ">

          {t.total_points}

        </p>

        <h3 className="
          text-3xl
          font-black
          text-gray-900 dark:text-white
          mt-1
        ">

          {loyaltyStats.totalPoints}

        </h3>

      </div>

      {/* =====================================================
          REVIEW PROVIDERS
      ===================================================== */}

      {reviewProviders.map(
        (review) => (

          <div
            key={review.provider}
            className="
              bg-white dark:bg-slate-900
              p-6
              rounded-[2.5rem]
              border border-gray-100 dark:border-slate-800
              shadow-sm
              group
            "
          >

            <div className="
              w-12 h-12
              bg-yellow-50 dark:bg-yellow-900/20
              text-yellow-600 dark:text-yellow-400
              rounded-2xl
              flex items-center justify-center
              mb-4
              group-hover:scale-110
              transition-transform
            ">

              <TrendingUp size={24} />

            </div>

            <p className="
              text-xs
              font-black
              text-gray-400 dark:text-gray-500
              uppercase tracking-widest
            ">

              {getProviderLabel(
                review.provider
              )}

            </p>

            <div className="
              flex items-end
              gap-2
              mt-1
            ">

              <h3 className="
                text-3xl
                font-black
                text-gray-900 dark:text-white
              ">

                {review.rating || '--'}

              </h3>

              <span className="
                text-sm
                text-gray-400
                font-bold
                pb-1
              ">

                ({review.total || 0})

              </span>

            </div>

          </div>

        )
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {reviewProviders.length === 0 && (

        <div className="
          bg-white dark:bg-slate-900
          p-6
          rounded-[2.5rem]
          border border-dashed border-gray-200 dark:border-slate-700
          shadow-sm
          flex flex-col justify-center
        ">

          <div className="
            w-12 h-12
            bg-gray-100 dark:bg-slate-800
            text-gray-400
            rounded-2xl
            flex items-center justify-center
            mb-4
          ">

            <Star size={24} />

          </div>

          <p className="
            text-xs
            font-black
            text-gray-400
            uppercase tracking-widest
          ">

            {t.review_providers}

          </p>

          <p className="
            text-sm
            text-gray-500 dark:text-slate-400
            mt-2
            leading-relaxed
            font-medium
          ">

            {t.no_review_provider_connected}

          </p>

        </div>

      )}

    </div>

  )

}