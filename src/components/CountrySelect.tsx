'use client'

import { CountryCode } from 'libphonenumber-js/core'
import {
  Globe
} from 'lucide-react'

import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input'

import en from 'react-phone-number-input/locale/en.json'

type CountrySelectProps = {

  country: CountryCode

  setCountry: (
    value: string
  ) => void

  label?: string

}

export default function CountrySelect({

  country,

  setCountry,

  label = 'Country'

}: CountrySelectProps) {

  return (

    <div className="space-y-2">

      {/* LABEL */}

      <label className="
        text-[10px]
        font-black
        text-gray-400
        uppercase
        tracking-widest
        ml-2
        flex items-center gap-2
      ">

        <Globe size={12} />

        {label}

      </label>

      {/* SELECT */}

      <div className="relative">

        <select

          value={country}

          onChange={(e) =>
            setCountry(
              e.target.value
            )
          }

          className="
            w-full p-4 pr-12

            bg-gray-50
            dark:bg-slate-800

            border-none
            rounded-2xl

            font-bold
            text-gray-900
            dark:text-white

            focus:ring-2
            focus:ring-indigo-500

            appearance-none
            cursor-pointer
          "
        >

          {getCountries().map((countryCode) => (

            <option
              key={countryCode}
              value={countryCode}
            >

              {en[countryCode]} (+{getCountryCallingCode(countryCode)})

            </option>

          ))}

        </select>

        {/* ICON */}

        <div className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          pointer-events-none
        ">

          <Globe
            size={18}
            className="text-gray-400"
          />

        </div>

      </div>

    </div>

  )

}