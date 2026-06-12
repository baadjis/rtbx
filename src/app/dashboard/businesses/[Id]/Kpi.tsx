/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Award,
  TrendingUp,
  Users
} from 'lucide-react'

type ReviewProvider = {

  provider: string

  rating?: number

  total?: number

}

type Props = {

  loyaltyStats: {

    totalCustomers: number

    totalPoints: number

  }

  reviewProviders?: ReviewProvider[]

  t: any

}

function KpiCard({

  icon: Icon,
  iconClass,
  label,
  value,
  subtitle

}: any) {

  return (

    <div
      className="
        bg-white dark:bg-slate-900
        rounded-[3rem]
        border border-gray-100 dark:border-slate-800
        p-7
        shadow-sm
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div
        className={`
          w-14 h-14
          rounded-2xl
          flex items-center justify-center
          mb-5
          ${iconClass}
        `}
      >

        <Icon size={26} />

      </div>

      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.2em]
          text-gray-400 dark:text-slate-500
        "
      >

        {label}

      </p>

      <h3
        className="
          mt-2
          text-4xl
          font-black
          tracking-tight
          text-gray-900 dark:text-white
        "
      >

        {value}

      </h3>

      {subtitle && (

        <p
          className="
            mt-2
            text-sm
            text-gray-500 dark:text-slate-400
            font-medium
          "
        >

          {subtitle}

        </p>

      )}

    </div>

  )

}

export default function Kpi({

  loyaltyStats,
  reviewProviders = [],
  t

}: Props) {

  const getProviderLabel = (
    provider: string
  ) => {

    switch (
      provider?.toLowerCase()
    ) {

      case 'google':
        return 'Google'

      case 'trustpilot':
        return 'Trustpilot'

      case 'tripadvisor':
        return 'Tripadvisor'

      case 'thefork':
        return 'TheFork'

      case 'booking':
        return 'Booking.com'

      default:
        return provider

    }

  }

  return (

    <div
      className="
        grid
        gap-6
        [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
      "
    >

      {/* CUSTOMERS */}

      <KpiCard

        icon={Users}

        iconClass="
          bg-blue-50 dark:bg-blue-900/20
          text-blue-600 dark:text-blue-400
        "

        label={t.total_customers}

        value={loyaltyStats.totalCustomers}

      />

      {/* POINTS */}

      <KpiCard

        icon={Award}

        iconClass="
          bg-emerald-50 dark:bg-emerald-900/20
          text-emerald-600 dark:text-emerald-400
        "

        label={t.total_points}

        value={loyaltyStats.totalPoints}

      />

      {/* REVIEW PROVIDERS */}

      {reviewProviders.map(
        (review) => (

          <KpiCard

            key={review.provider}

            icon={TrendingUp}

            iconClass="
              bg-yellow-50 dark:bg-yellow-900/20
              text-yellow-600 dark:text-yellow-400
            "

            label={
              getProviderLabel(
                review.provider
              )
            }

            value={
              review.rating ??
              '--'
            }

            subtitle={`${review.total || 0} reviews`}

          />

        )
      )}

    </div>

  )

}