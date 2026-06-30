/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Mail,
  Phone,
  Globe
} from 'lucide-react'
import SectionSaveButton from './SectionSaveButton'

export default function ContactSection({

  form,
  setForm,
   handleSave,
  dirty,
  saved=false,
  loading,
  
  t

}: {

  form: any

  setForm: any
  handleSave:any
  dirty:boolean
  saved:boolean
  loading:boolean

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

          {t.contact_information}

        </h2>

        <p className="
          text-gray-500
          dark:text-slate-400
          mt-2
        ">

          {t.contact_information_description}

        </p>

      </div>

      {/* EMAIL */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.email}

        </label>

        <div className="relative">

          <Mail
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input

            type="email"

            value={
              form.email || ''
            }

            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value
              })
            }

            className="
              w-full
              pl-12
              p-4
              rounded-2xl
              bg-gray-50
              dark:bg-slate-800
              border-none
              text-gray-900
              dark:text-white
            "

          />

        </div>

      </div>

      {/* PHONE */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.phone}

        </label>

        <div className="relative">

          <Phone
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input

            value={
              form.phone || ''
            }

            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value
              })
            }

            className="
              w-full
              pl-12
              p-4
              rounded-2xl
              bg-gray-50
              dark:bg-slate-800
              border-none
              text-gray-900
              dark:text-white
            "

          />

        </div>

      </div>

      {/* WEBSITE */}

      <div className="space-y-2">

        <label className="
          text-xs
          uppercase
          tracking-widest
          font-black
          text-gray-400
        ">

          {t.website}

        </label>

        <div className="relative">

          <Globe
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input

            type="url"

            placeholder="https://"

            value={
              form.website || ''
            }

            onChange={(e) =>
              setForm({
                ...form,
                website:
                  e.target.value
              })
            }

            className="
              w-full
              pl-12
              p-4
              rounded-2xl
              bg-gray-50
              dark:bg-slate-800
              border-none
              text-gray-900
              dark:text-white
            "

          />

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