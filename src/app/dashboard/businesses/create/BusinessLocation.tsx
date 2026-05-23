/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import CountrySelect from '@/components/CountrySelect'
import { CountryCode } from 'libphonenumber-js/core'


type BusinessLocationProps = {

  t: any

  postal_code: string
  setPostalCode: any

  address: string
  setAddress: any

  city: string
  setCity: any

  country: CountryCode
  setCountry: any

}

export default function BusinessLocation({

  t,

  address,
  setAddress,

  city,
  setCity,

  country,
  setCountry,

  postal_code,
  setPostalCode

}: BusinessLocationProps) {

  return (

    <div className="space-y-6">

      {/* ADDRESS */}

      <div className="space-y-2">

        <label className="
          text-[10px]
          font-black
          text-gray-400
          uppercase
          tracking-widest
          ml-2
        ">

          {t.address}

        </label>

        <input
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          placeholder={
            t.address_placeholder
          }
          className="
            w-full p-4
            bg-gray-50 dark:bg-slate-800
            border-none rounded-2xl
            font-bold dark:text-white
            focus:ring-2 focus:ring-indigo-500
          "
        />

      </div>

      {/* POSTAL CODE */}

      <div className="space-y-2">

        <label className="
          text-[10px]
          font-black
          text-gray-400
          uppercase
          tracking-widest
          ml-2
        ">

          {t.postal_code}

        </label>

        <input
          value={postal_code}
          onChange={(e) =>
            setPostalCode(
              e.target.value
            )
          }
          placeholder={
            t.postal_code_placeholder
          }
          className="
            w-full p-4
            bg-gray-50 dark:bg-slate-800
            border-none rounded-2xl
            font-bold dark:text-white
            focus:ring-2 focus:ring-indigo-500
          "
        />

      </div>

      {/* CITY + COUNTRY */}

      <div className="
        grid grid-cols-1
        md:grid-cols-2
        gap-4
      ">

        {/* CITY */}

        <div className="space-y-2">

          <label className="
            text-[10px]
            font-black
            text-gray-400
            uppercase
            tracking-widest
            ml-2
          ">

            {t.city}

          </label>

          <input
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            placeholder={
              t.city_placeholder
            }
            className="
              w-full p-4
              bg-gray-50 dark:bg-slate-800
              border-none rounded-2xl
              font-bold dark:text-white
              focus:ring-2 focus:ring-indigo-500
            "
          />

        </div>

        {/* COUNTRY */}
          <CountrySelect

            country={country}

            setCountry={setCountry}

            label={
              t.country
            }

          />


      </div>

    </div>

  )

}