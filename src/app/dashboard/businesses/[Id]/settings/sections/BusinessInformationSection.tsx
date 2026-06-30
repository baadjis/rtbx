/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image'

import {
  Building2,
  Palette,
  Upload
} from 'lucide-react'

import {
  BUSINESS_TYPES,
  getBusinessTypeLabel
}
from '@/utils/busines-types'
import { LangType } from '@/lib/lang/types'
import SectionSaveButton from './SectionSaveButton'

export default function BusinessInformationSection({

  form,
  setForm,
  handleSave,
  dirty,
  saved=false,
  loading,
  t,
  lang,
  


}: {

  form: any

  setForm: any
  handleSave:any
  dirty: boolean
  saved: boolean
  loading:boolean

  t: any

  lang: LangType

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

          {t.business_information}

        </h2>

        <p className="
          text-gray-500
          dark:text-slate-400
          mt-2
        ">

          {t.business_information_description}

        </p>

      </div>

      {/* AVATAR */}

      <div className="
        flex flex-col
        md:flex-row
        items-start
        gap-6
      ">

        <div className="
          w-28 h-28
          rounded-[2rem]
          overflow-hidden
          border
          border-gray-200
          dark:border-slate-700
          bg-gray-100
          dark:bg-slate-800
          flex items-center
          justify-center
        ">

          {form.avatar_url ? (

            <Image
              src={form.avatar_url}
              alt={form.name}
              width={112}
              height={112}
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <Building2
              size={36}
              className="
                text-gray-400
              "
            />

          )}

        </div>

        <label className="
          px-5 py-3
          rounded-2xl
          bg-indigo-600
          text-white
          font-black
          cursor-pointer
          flex items-center
          gap-2
          hover:bg-indigo-700
          transition-all
        ">

          <Upload size={18} />

          {t.change_avatar}

          <input
            type="file"
            hidden
          />

        </label>

      </div>

      {/* NAME */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.business_name}

        </label>

        <input

          value={form.name}

          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }

          className="
            w-full
            p-4
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
            border-none
            text-gray-900
            dark:text-white
            font-bold
          "

        />

      </div>

      {/* TYPE */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.business_type}

        </label>

        <select

          value={
            form.business_type || ''
          }

          onChange={(e) =>
            setForm({
              ...form,
              business_type:
                e.target.value
            })
          }

          className="
            w-full
            p-4
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
            border-none
            text-gray-900
            dark:text-white
            font-bold
          "

        >

          {BUSINESS_TYPES.map(
            (type) => (

              <option
                key={type}
                value={type}
              >

                {getBusinessTypeLabel(
                  type,
                  lang
                )}

              </option>

            )
          )}

        </select>

      </div>

      {/* DESCRIPTION */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.description}

        </label>

        <textarea

          rows={5}

          value={
            form.description || ''
          }

          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value
            })
          }

          className="
            w-full
            p-4
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
            border-none
            resize-none
            text-gray-900
            dark:text-white
          "

        />

      </div>

      {/* COLOR */}

      <div className="space-y-3">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.theme_color}

        </label>

        <div className="
          flex items-center
          gap-4
        ">

          <div className="
            w-12 h-12
            rounded-2xl
            flex items-center
            justify-center
            bg-gray-100
            dark:bg-slate-800
          ">

            <Palette
              size={18}
            />

          </div>

          <input

            type="color"

            value={
              form.theme_color ||
              '#4f46e5'
            }

            onChange={(e) =>
              setForm({
                ...form,
                theme_color:
                  e.target.value
              })
            }

            className="
              h-12
              w-20
              cursor-pointer
            "

          />

          <span className="
            font-black
            text-gray-600
            dark:text-slate-300
          ">

            {form.theme_color}

          </span>

        </div>

      </div>

      <SectionSaveButton

   loading={loading}

   dirty={dirty}

   saved={saved}

   label={t.save_changes}

   savingLabel={t.saving}

   savedLabel={t.saved}

   onClick={handleSave}

/>

    </div>

  )

}