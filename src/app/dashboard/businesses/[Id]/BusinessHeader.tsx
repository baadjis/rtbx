/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image'
import Link from 'next/link'

import {
  ExternalLink,
  MapPin,
  QrCode,
  ShieldCheck,
  Settings,
  Star,
  UtensilsCrossed,
  Hotel,
  Stethoscope,
  Scissors,
  Dumbbell,
  ShoppingBag
} from 'lucide-react'

function BusinessIcon({type,size=24}:
  {type?: string;
  size?:number}

) {

  switch (type) {

    case 'restaurant':
    case 'cafe':
      return <UtensilsCrossed size={size}/>

    case 'hotel':
    case 'hospitality':
      return <Hotel size={size}/>

    case 'medical':
    case 'healthcare':
      return <Stethoscope size={size}/>

    case 'beauty':
      return <Scissors size={size}/>

    case 'fitness':
      return <Dumbbell size={size}/>

    case 'retail':
      return <ShoppingBag size={size}/>

    default:
      return <Star size={size}/>

  }

}


export default function BusinessHeader({
  business,
  t
}: {
  business: any
  t: any
}) {

  

  return (

    <div
      className="
        bg-white dark:bg-slate-900
        p-8 md:p-10
        rounded-[3rem]
        border border-gray-100
        dark:border-slate-800
        shadow-sm
        flex flex-col xl:flex-row
        justify-between
        gap-8
      "
    >

      {/* ===================================================== */}
      {/* LEFT */}
      {/* ===================================================== */}

      <div className="flex items-start gap-5">

        {business.avatar_url ? (

          <Image
            src={business.avatar_url}
            alt={business.name}
            width={80}
            height={80}
            className="
              w-20 h-20
              rounded-[1.5rem]
              object-cover
              border border-gray-200
              dark:border-slate-700
            "
          />

        ) : (

          <div
            className="
              w-20 h-20
              rounded-[1.5rem]
              bg-indigo-600
              text-white
              flex items-center
              justify-center
              shadow-lg
            "
          >

            <BusinessIcon size={34} />

          </div>

        )}

        <div className="space-y-3">

          <h1
            className="
              text-3xl md:text-5xl
              font-black
              tracking-tight
              text-gray-900
              dark:text-white
            "
          >
            {business.name}
          </h1>

          {business.address && (

            <div
              className="
                flex items-start gap-2
                text-gray-500
                dark:text-slate-400
              "
            >

              <MapPin
                size={18}
                className="
                  text-indigo-600
                  mt-0.5
                  shrink-0
                "
              />

              <span className="font-medium">
                {business.address}
              </span>

            </div>

          )}

          {business.verified && (

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3 py-2
                rounded-full
                bg-emerald-50
                dark:bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-400
                text-xs
                font-black
                uppercase
                tracking-wider
              "
            >

              <ShieldCheck size={14} />

              {t.verified_business}

            </div>

          )}

        </div>

      </div>

      {/* ===================================================== */}
      {/* ACTIONS */}
      {/* ===================================================== */}

      <div
        className="
          flex flex-wrap
          items-center
          gap-3
        "
      >

        {/* REVIEW QR */}

        <Link
          href={`/tools/google-review?id=${business.id}`}
          className="
            h-11
            px-4
            rounded-2xl
            bg-indigo-600
            text-white
            font-bold
            text-sm
            flex items-center
            gap-2
            hover:bg-indigo-700
            transition-all
            no-underline
          "
        >

          <QrCode size={16} />

          {t.review_qr}

        </Link>

        {/* SETTINGS */}

        <Link
          href={`/dashboard/business/${business.id}/settings`}
          className="
            h-11
            px-4
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
            border border-gray-100
            dark:border-slate-700
            text-gray-700
            dark:text-slate-300
            font-bold
            text-sm
            flex items-center
            gap-2
            hover:bg-indigo-50
            dark:hover:bg-indigo-900/30
            hover:text-indigo-600
            transition-all
            no-underline
          "
        >

          <Settings size={16} />

          {t.settings}

        </Link>

        {/* GOOGLE MAPS */}

        {business.google_place_id && (

          <a
            href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${business.google_place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              h-11
              px-4
              rounded-2xl
              bg-gray-50
              dark:bg-slate-800
              border border-gray-100
              dark:border-slate-700
              text-gray-700
              dark:text-slate-300
              font-bold
              text-sm
              flex items-center
              gap-2
              hover:bg-indigo-50
              dark:hover:bg-indigo-900/30
              hover:text-indigo-600
              transition-all
              no-underline
            "
          >

            <ExternalLink size={16} />

            {t.view_on_maps}

          </a>

        )}

        {/* MOBILE ONLY */}

        <Link
          href="/scan"
          className="
            flex md:hidden
            h-11
            px-4
            rounded-2xl
            bg-emerald-600
            text-white
            font-bold
            text-sm
            items-center
            gap-2
            no-underline
          "
        >

          <QrCode size={16} />

          {t.scan_customer}

        </Link>

      </div>

    </div>

  )

}