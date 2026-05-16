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
  const [links,setLinks]=useState(space.social_data||[])
  const [editableSpace, setEditableSpace] =
  useState({
    ...space,
    social_data: space.social_data || []
  })
  
  const router = useRouter()
  const t= Data[lang as LangType]
  // On initialise l'état avec les données existantes du Space
  

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  const handleUpdate = async () => {
    
    setLoading(true)

    const { error } = await supabase
      .from('spaces')
      .update({
  entity_name:
    editableSpace.entity_name,

  social_data:
    links,

  theme_color:
    editableSpace.theme_color,

  bg_color:
    editableSpace.bg_color,

  avatar_url:
    editableSpace.avatar_url,

  updated_at:
    new Date().toISOString()
}).eq('edit_token', token) // Sécurité par le token

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
          setSuccess(false)
          router.refresh()
      }, 3000)
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  


  

  return (
   <SpaceView
  editMode

  lang={lang}

  entity={editableSpace}

  
  setLinks={setLinks}

  updateLink={updateLink}

  setEditableName={(v:string)=>
    setEditableSpace({
      ...editableSpace,
      entity_name: v
    })
  }

  isProfileOnly={isProfileOnly}

  onSave={handleUpdate}

  saving={loading}
  saved={success}
/>
  )
}