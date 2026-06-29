/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {

  useState

} from 'react'

import {

  Smartphone,

  Plus,

  Pencil

} from 'lucide-react'

import AppCard from '../AppCard'
import AppModal from '../AppModal'
import { LangType } from '@/lib/lang/types'

type Props = {

  providers: any[]

  apps: any[]

  t: any,
  lang:LangType,

  onSave: (
    values:{
      provider_id:string
      value:string
    }[]
  )=>Promise<void>

}

export default function AppsSection({

  providers,

  apps,

  t,
  lang,

  onSave

}:Props){

  const [

    modalOpen,

    setModalOpen

  ]=useState(false)

  const [

    saving,

    setSaving

  ]=useState(false)

  const configuredApps=

    providers.filter(

      provider=>

        apps.some(

          app=>

            app.provider_id===

            provider.id &&

            !!app.value

        )

    )

  async function handleSave(

    values:{

      provider_id:string

      value:string

    }[]

  ){

    try{

      setSaving(true)

      await onSave(
        values
      )

      setModalOpen(false)

    }

    finally{

      setSaving(false)

    }

  }

  return(

    <>

      <div className="
        bg-white
        dark:bg-slate-900

        border
        border-gray-100
        dark:border-slate-800

        rounded-[3rem]

        p-8

        shadow-sm

        space-y-8
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
        ">

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-14
              h-14

              rounded-2xl

              bg-indigo-50
              dark:bg-indigo-500/10

              text-indigo-600

              flex
              items-center
              justify-center
            ">

              <Smartphone size={24}/>

            </div>

            <div>

              <h2 className="
                text-2xl
                font-black

                text-gray-900
                dark:text-white
              ">

                {t.apps}

              </h2>

              <p className="
                mt-1

                text-sm

                text-gray-500
                dark:text-slate-400
              ">

                {t.mobile_apps_description}

              </p>

            </div>

          </div>

          <button

            onClick={()=>

              setModalOpen(true)

            }

            className="
              px-5
              py-3

              rounded-2xl

              bg-indigo-600

              text-white

              font-black

              flex
              items-center
              gap-2
            "

          >

            {

              configuredApps.length

              ?<>

                <Pencil size={18}/>

                {t.manage}

              </>

              :<>

                <Plus size={18}/>

                {t.add}

              </>

            }

          </button>

        </div>

        {

          configuredApps.length===0

          ?(

            <div className="
              rounded-[2rem]

              border-2
              border-dashed

              border-gray-200
              dark:border-slate-700

              p-12

              text-center
            ">

              <p className="
                text-lg
                font-black
              ">

                {t.no_app_configured}

              </p>

              <p className="
                mt-2

                text-gray-500
              ">

                {t.add_app_description}

              </p>

            </div>

          )

          :(

            <div className="
              grid
              md:grid-cols-2
              gap-5
            ">

              {

                configuredApps.map(

                  provider=>{

                    const app=

                      apps.find(

                        item=>

                          item.provider_id===

                          provider.id

                      )

                    return(

                      <AppCard

                        key={
                          provider.id
                        }

                        providerId={
                          provider.id
                        }

                        value={
                          app?.value
                        }

                        lang={lang}

                        t={t}

                        
                       
                      />

                    )

                  }

                )

              }

            </div>

          )

        }

      </div>

      <AppModal

        open={modalOpen}

        providers={providers}

        apps={apps}

        t={t}

        loading={saving}

        onClose={()=>

          setModalOpen(false)

        }

        onSave={handleSave}

      />

    </>

  )

}