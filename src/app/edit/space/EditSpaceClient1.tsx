/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Data } from '../../tools/digital-id/data'
import { LangType } from '@/lib/lang/types'
import SpaceView from '@/components/spaces/SpaceView'
import { get_social_config } from '@/utils/social-config'
import { createBrowserClient } from '@supabase/ssr'

export default function EditSpaceClient({ space, isProfileOnly, lang, token }: any) {
  const SOCIAL_CONFIG = get_social_config(lang)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ==================== AVATAR STATES ====================
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [socialLinks, setSocialLinks] = useState<any[]>(space.social_data || [])
  const [links, setLinks] = useState<any[]>([
    { id: crypto.randomUUID(), network: 'Instagram', handle: '' }
  ])

  const [editableSpace, setEditableSpace] = useState({ ...space })
  const [showAddLinks, setShowAddLinks] = useState(false)
  const [avatar_url, setAvataurl] = useState(space?.avatar_url || null)

  const router = useRouter()
  const t = Data[lang as LangType]

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const usedNetworks = [
    ...(socialLinks || []),
    ...(links || []).filter((l: any) => l.handle?.trim() !== '')
  ]
    .filter(Boolean)
    .map((l: any) => l.network)

  const socialLinksOptions = Object.keys(SOCIAL_CONFIG).filter(
    (network) => !usedNetworks.includes(network)
  )

  // ====================== UPLOAD AVATAR ======================
  const onAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onloadend = () => setAvataurl(reader.result as string)
  reader.readAsDataURL(file)

  setSelectedAvatarFile(file)
}

  // ====================== REMOVE AVATAR ======================
 
// ====================== REMOVE AVATAR ======================
const onRemoveAvatar = async () => {
  if (!avatar_url) return

  const confirmDelete = window.confirm("Supprimer l'avatar ?")
  if (!confirmDelete) return

  setAvataurl(null)           // Mise à jour immédiate de la preview
  setSelectedAvatarFile(null)
}

  // ====================== HANDLE UPDATE ======================
  const handleUpdate = async () => {
  try {
    setLoading(true)

    const mergedLinks = [...socialLinks, ...links]
    const cleanLinks = mergedLinks
      .filter((l: any) => l?.network && l?.handle?.trim() !== '')
      .map((l: any) => ({
        id: l.id || crypto.randomUUID(),
        network: String(l.network),
        handle: String(l.handle).replace('@', '').trim()
      }))

    // =====================================================
    // Préparation du FormData
    // =====================================================
    const formData = new FormData()
    formData.append('token', token)

    const payload = {
      entity_name: editableSpace.entity_name,
      social_data: cleanLinks,
      theme_color: editableSpace.theme_color,
      bg_color: editableSpace.bg_color,
      avatar_url: avatar_url   // ← null si supprimé, ou l'URL actuelle
    }

    formData.append('payload', JSON.stringify(payload))

    // Ajout du fichier seulement s'il y en a un nouveau
    if (selectedAvatarFile) {
      formData.append('avatar', selectedAvatarFile)
    }

    const response = await fetch('/api/spaces/update', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || 'Update failed')

    setSuccess(true)
    setSelectedAvatarFile(null)

    setTimeout(() => {
      setSuccess(false)
      router.refresh()
    }, 2000)

  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Erreur lors de la mise à jour')
  } finally {
    setLoading(false)
    setIsUploadingAvatar(false)
  }
}

  // =========================================================
  // Tes fonctions originales (intactes)
  // =========================================================
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    let cleanValue = value
    if (field === 'handle' && value.startsWith('@')) {
      cleanValue = value.substring(1)
    }
    newLinks[index] = { ...newLinks[index], [field]: cleanValue }
    setLinks(newLinks)
  }

  const onDeleteLink = (index: number) => {
    const updated = socialLinks.filter((_: any, i: number) => i !== index)
    setSocialLinks(updated)
  }

  const onUpdateLink = (index: number) => {
    const current = socialLinks[index]
    const handle = prompt('Handle', current.handle)
    if (handle === null) return

    const updated = [...socialLinks]
    updated[index] = {
      ...updated[index],
      handle: handle.startsWith('@') ? handle.substring(1) : handle
    }
    setSocialLinks(updated)
  }

  const onExitEdit = () => {
    router.push(`/u/${space.slug}`)
  }

  const onAddLink = () => {
    setShowAddLinks(!showAddLinks)
  }

  return (
    <SpaceView
      editMode={true}
      lang={lang}
      entity={{ ...editableSpace, avatar_url }}
      links={links}
      setLinks={setLinks}
      updateLink={updateLink}
      setEditableName={(v: string) =>
        setEditableSpace({ ...editableSpace, entity_name: v })
      }
      onDeleteLink={onDeleteLink}
      onUpdateLink={onUpdateLink}
      onExitEdit={onExitEdit}
      onAddLink={onAddLink}
      showAddLinks={showAddLinks}
      isProfileOnly={isProfileOnly}
      socialLinks={socialLinks}
      socialLinksOptions={socialLinksOptions}
      onAvatarUpload={onAvatarUpload}
      avatar_url={avatar_url}
      onRemoveAvatar={onRemoveAvatar}
      onSave={handleUpdate}
      saving={loading}
      saved={success}
    />
  )
}