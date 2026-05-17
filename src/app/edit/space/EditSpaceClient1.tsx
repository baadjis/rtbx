/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {  useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Data } from '../../tools/digital-id/data' // On peut réutiliser les traductions settings
import { LangType } from '@/lib/lang/types'
import SpaceView from '@/components/spaces/SpaceView'

export default function EditSpaceClient({ space,isProfileOnly, lang, token }: any) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [links, setLinks] = useState<any[]>([{ id: crypto.randomUUID(), network: 'Instagram', handle: '' }])

 

  const [editableSpace, setEditableSpace] =
  useState({
    ...space
  })

const [socialLinks, setSocialLinks] =
  useState(
    space.social_data || []
  )
  
  const router = useRouter()
  const t= Data[lang as LangType]
  // On initialise l'état avec les données existantes du Space
  

  /*const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )*/

  //const links = editableSpace.social_data || []


 /*const updateLink = (
  index: number,
  field: string,
  value: string
) => {

  const updated =
    [...editableSpace.social_data]

  let cleanValue = value

  if (
    field === 'handle' &&
    value.startsWith('@')
  ) {
    cleanValue = value.substring(1)
  }

  updated[index] = {
    ...updated[index],
    [field]: cleanValue
  }

  setEditableSpace({
    ...editableSpace,
    social_data: updated
  })
}*/
 // =========================================================
  // UPDATE LINK
  // =========================================================

  const updateLink = (
    index: number,
    field: string,
    value: string
  ) => {

    const newLinks = [...links]

    let cleanValue = value

    if (
      field === 'handle' &&
      value.startsWith('@')
    ) {
      cleanValue = value.substring(1)
    }

    newLinks[index] = {
      ...newLinks[index],
      [field]: cleanValue
    }

    setLinks(newLinks)

  }

/*const setLinks = (newLinks:any[]) => {
  setEditableSpace({
    ...editableSpace,
    social_data: newLinks
  })
}*/

// =========================================================
// DELETE EXISTING LINK
// =========================================================

const onDeleteLink = (index: number) => {

  const updated =
    editableSpace.social_data.filter(
      (_: any, i: number) => i !== index
    )

  setEditableSpace({
    ...editableSpace,
    social_data: updated
  })

}

const onUpdateLink = (
  index: number
) => {

  const current =
    socialLinks[index]

  const handle =
    prompt(
      'Handle',
      current.handle
    )

  if (
    handle === null
  ) return

  const updated =
    [...socialLinks]

  updated[index] = {
    ...updated[index],
    handle:
      handle.startsWith('@')
        ? handle.substring(1)
        : handle
  }

  setSocialLinks(updated
  )

}

 const handleUpdate = async () => {

  const mergedLinks = [

  ...socialLinks,

  ...links

]

const cleanLinks = mergedLinks
  .filter(
    (l: any) =>

      l &&
      l.network &&
      l.handle &&
      l.handle.trim() !== ''
  )
  .map((l: any) => ({

    id:
      l.id ||
      crypto.randomUUID(),

    network:
      String(l.network),

    handle:
      String(l.handle)
        .replace('@', '')
        .trim()

  }))

  try {

    setLoading(true)

    const payload = {

      entity_name:
        editableSpace.entity_name,

      social_data: cleanLinks,

      theme_color:
        editableSpace.theme_color,

      bg_color:
        editableSpace.bg_color,

      avatar_url:
        editableSpace.avatar_url

    }

    const response =
      await fetch(
        '/api/spaces/update',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            token,

            payload

          })
        }
      )

    const result =
      await response.json()

    if (!response.ok) {

      throw new Error(
        result.error ||
        'Update failed'
      )

    }

    /* SUCCESS */

    setSuccess(true)

    /* IMPORTANT */

    setEditableSpace({
      ...editableSpace,
      social_data:
        payload.social_data
    })

    /* RESET NEW LINKS */

    setLinks([])

    setTimeout(() => {

      setSuccess(false)

      router.refresh()

    }, 2000)

  } catch (err: any) {

    console.error(err)

    alert(
      err.message
    )

  } finally {

    setLoading(false)

  }

}


  

  return (
   <SpaceView
  editMode={true}

  lang={lang}

  entity={editableSpace}

  links={links}
  setLinks={setLinks}

  updateLink={updateLink}

  setEditableName={(v:string)=>
    setEditableSpace({
      ...editableSpace,
      entity_name: v
    })
  }
   onDeleteLink={onDeleteLink}
   onUpdateLink={onUpdateLink}
  isProfileOnly={isProfileOnly}

  onSave={handleUpdate}

  saving={loading}
  saved={success}
/>
  )
}