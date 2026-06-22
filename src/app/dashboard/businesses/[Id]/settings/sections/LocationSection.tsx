/* eslint-disable @typescript-eslint/no-explicit-any */

import { MapPin } from 'lucide-react'

import BusinessLocation
from '@/app/dashboard/businesses/create/BusinessLocation'

export default function LocationSection({

  form,
  setForm,
  t

}: {

  form: any

  setForm: any

  t: any

}) {

  return (

    <div className="
      bg-white dark:bg-slate-900
      border border-gray-100
      dark:border-slate-800
      rounded-[3rem]
      p-8
      shadow-sm
      space-y-8
    ">

      {/* HEADER */}

      <div>

        <h2 className="
          text-2xl
          font-black
          text-gray-900
          dark:text-white
        ">

          {t.location}

        </h2>

        <p className="
          text-gray-500
          dark:text-slate-400
          mt-2
        ">

          {t.location_description}

        </p>

      </div>

      <BusinessLocation

        country={
          form.country_code
        }

        setCountry={(
          country: string
        ) =>
          setForm({
            ...form,
            country_code:
              country
          })
        }

        city={
          form.city || ''
        }

        setCity={(
          city: string
        ) =>
          setForm({
            ...form,
            city
          })
        }

        address={
          form.address || ''
        }

        setAddress={(
          address: string
        ) =>
          setForm({
            ...form,
            address
          })
        }

        postal_code={
          form.postal_code || ''
        }

        setPostalCode={(
          postal_code: string
        ) =>
          setForm({
            ...form,
            postal_code
          })
        }

        t={t}

      />

    </div>

  )

}