/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {

  useEffect,

  useState

} from 'react'

import Image from 'next/image'

import {

  Smartphone,

  X

} from 'lucide-react'

import {

  getProviderGlyph

} from '@/lib/providers/getProviderAsset'
import { LangType } from '@/lib/lang/types'

type Props = {

  open: boolean

  providers: any[]

  apps: any[]

  t: any,
  lang:LangType,

  loading?: boolean

  onClose: () => void

  onSave: (
    values:{
      provider_id:string
      value:string
    }[]
  )=>Promise<void>

}

export default function AppModal({

  open,

  providers,

  apps,

  t,
  lang='en',

  loading=false,

  onClose,

  onSave

}:Props){

  const [

    values,

    setValues

  ]=useState<
    Record<string,string>
  >({})

  const [

    imageError,

    setImageError

  ]=useState<
    Record<string,boolean>
  >({})

  const [

    saving,

    setSaving

  ]=useState(false)

  // =======================================
  // INIT
  // =======================================

  useEffect(()=>{

    if(!open)
      return

    const initial:
      Record<string,string>={}

    providers.forEach(

      provider=>{

        const existing=

          apps.find(

            item=>

              item.provider_id===

              provider.id

          )

        initial[
          provider.id
        ]=

          existing?.value??

          ''

      }

    )

    setValues(
      initial
    )

    setImageError({})

  },[

    open,

    providers,

    apps

  ])

  // =======================================
  // CHANGE
  // =======================================

  function handleChange(

    providerId:string,

    value:string

  ){

    setValues(

      prev=>({

        ...prev,

        [providerId]:
          value

      })

    )

  }

  // =======================================
  // SAVE
  // =======================================

  async function handleSave(){

    try{

      setSaving(true)

      await onSave(

        providers.map(

          provider=>({

            provider_id:
              provider.id,

            value:

              values[
                provider.id
              ]??

              ''

          })

        )

      )

      onClose()

    }

    finally{

      setSaving(false)

    }

  }

  if(!open)
    return null

  return (

  <div className="
    fixed
    inset-0
    z-50

    bg-black/50

    flex
    items-center
    justify-center

    p-4
  ">

    <div className="
      w-full
      max-w-3xl

      max-h-[90vh]

      overflow-hidden

      bg-white
      dark:bg-slate-900

      rounded-[2.5rem]

      border
      border-gray-100
      dark:border-slate-800

      shadow-2xl

      flex
      flex-col
    ">

      {/* HEADER */}

      <div className="
        flex
        items-start
        justify-between

        p-8

        border-b
        border-gray-100
        dark:border-slate-800
      ">

        <div>

          <h2 className="
            text-3xl
            font-black

            text-gray-900
            dark:text-white
          ">

            {t.mobile_apps}

          </h2>

          <p className="
            mt-2

            text-gray-500
            dark:text-slate-400
          ">

            {t.mobile_apps_description}

          </p>

        </div>

        <button

          onClick={onClose}

          className="
            w-12
            h-12

            rounded-xl

            bg-gray-100
            dark:bg-slate-800

            flex
            items-center
            justify-center
          "

        >

          <X size={18} />

        </button>

      </div>

      {/* BODY */}

      <div className="
        flex-1

        overflow-y-auto

        p-8

        space-y-6
      ">

        {

          providers.map(

            provider => {

              const glyph =
                getProviderGlyph(
                  provider
                )

              return (

                <div

                  key={
                    provider.id
                  }

                  className="
                    flex
                    items-center

                    gap-5

                    p-5

                    rounded-[2rem]

                    bg-gray-50
                    dark:bg-slate-800
                  "

                >

                  {/* ICON */}

                  <div className="
                    w-14
                    h-14

                    rounded-2xl

                    bg-white
                    dark:bg-slate-900

                    flex
                    items-center
                    justify-center

                    overflow-hidden

                    shrink-0
                  ">

                    {

                      glyph &&
                      !imageError[
                        provider.id
                      ]

                      ? (

                        <Image

                          src={glyph}

                          alt={
                            provider.label[lang]
                          }

                          width={36}

                          height={36}

                          onError={() =>

                            setImageError(

                              prev => ({

                                ...prev,

                                [

                                  provider.id

                                ]: true

                              })

                            )

                          }

                        />

                      )

                      : (

                        <Smartphone

                          size={22}

                          className="
                            text-slate-400
                          "

                        />

                      )

                    }

                  </div>

                  {/* CONTENT */}

                  <div className="
                    flex-1

                    space-y-2
                  ">

                    <h3 className="
                      font-black

                      text-gray-900
                      dark:text-white
                    ">

                      {

                        typeof provider.label ===
                        'string'

                          ? provider.label

                          : provider.name[lang] 

                      }

                    </h3>

                    <input

                      type="url"

                      value={

                        values[
                          provider.id
                        ] ??

                        ''

                      }

                      onChange={(e)=>

                        handleChange(

                          provider.id,

                          e.target.value

                        )

                      }

                      placeholder={
                        t.enter_app_url
                      }

                      className="
                        w-full

                        px-4
                        py-3

                        rounded-xl

                        bg-white
                        dark:bg-slate-900

                        border
                        border-gray-200
                        dark:border-slate-700

                        outline-none
                      "

                    />

                  </div>

                </div>

              )

            }

          )

        }

      </div>

      {/* FOOTER */}

      <div className="
        p-8

        border-t
        border-gray-100
        dark:border-slate-800

        flex
        justify-end
        gap-4
      ">

        <button

          onClick={onClose}

          className="
            px-6
            py-3

            rounded-2xl

            bg-gray-100
            dark:bg-slate-800

            font-black
          "

        >

          {t.cancel}

        </button>

        <button

          onClick={handleSave}

          disabled={
            saving ||
            loading
          }

          className="
            px-8
            py-3

            rounded-2xl

            bg-indigo-600
            hover:bg-indigo-700

            text-white

            font-black
          "

        >

          {

            saving ||

            loading

              ? t.saving

              : t.save_changes

          }

        </button>

      </div>

    </div>

  </div>

)}