/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Footer from './SpaceFooter'
import RenderSocialLinks from './RenderSocialLinks'
import SpaceHeader from './SpaceHeader'
import { LangType } from '@/lib/lang/types'
import { Data } from './data'

type SpaceViewProps = {
  entity: any
  lang: LangType
  
  // modes
  editMode?: boolean
  saving?: boolean
  saved?: boolean
  isProfileOnly:boolean

  // edit actions
  onSave?: () => void
  onDeleteLink?: (index: number)=>void
  // live edition
  setEditableName?: any
  
}

export default function SpaceView({
  entity,
  lang,
  
  editMode = false,
  saving = false,
  saved = false,
  onSave,
  setEditableName,
  onDeleteLink,
  isProfileOnly
}: SpaceViewProps) {


  const t=Data[lang]


  // =========================================================
  // DISPLAY NAME
  // =========================================================

  let displayName = ''

  if (isProfileOnly) {

    displayName =
      entity.full_name ||
      `${entity.first_name || ''} ${entity.last_name || ''}`.trim() ||
      entity.slug

  } else {

    displayName =
      entity.space_type === 'organization'
        ? (entity.entity_name || entity.slug)
        : entity.slug
  }

  // =========================================================
  // DATA
  // =========================================================

  const imageUrl = entity.avatar_url

  const themeColor =
    entity.theme_color || '#4f46e5'

  const bgColor =
    entity.bg_color || '#0f172a'

  const socialLinks =
    entity.social_data || []

  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        min-h-screen
        flex flex-col
        items-center
        justify-center
        p-6
        text-white
        relative
        overflow-hidden
      "
      style={{
        backgroundColor: bgColor
      }}
    >

      {/* ================================================= */}
      {/* BACKGROUND DESKTOP */}
      {/* ================================================= */}

      <div
        className="
          absolute inset-0
          pointer-events-none
          hidden md:block
        "
        style={{
          background: `
            radial-gradient(circle at 50% 15%, ${themeColor} 0%, transparent 55%),
            radial-gradient(circle at 85% 85%, rgba(147,51,234,0.35) 0%, transparent 60%),
            radial-gradient(circle at 15% 85%, rgba(79,70,229,0.35) 0%, transparent 60%)
          `
        }}
      />

      {/* ================================================= */}
      {/* BACKGROUND MOBILE */}
      {/* ================================================= */}

      <div
        className="
          absolute inset-0
          pointer-events-none
          md:hidden
        "
        style={{
          background: `
            radial-gradient(circle at 50% 10%, ${themeColor} 0%, transparent 45%)
          `
        }}
      />

      {/* ================================================= */}
      {/* OVERLAY */}
      {/* ================================================= */}

      <div className="
        absolute inset-0
        pointer-events-none
        bg-black/40 md:bg-black/20
      " />

      

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="
        relative z-10
        w-full max-w-md
        space-y-12
        text-center
      ">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <SpaceHeader
          editMode={editMode}
          entity={entity}
          isProfileOnly={isProfileOnly}
          imageUrl={imageUrl}
          themeColor={themeColor}
          displayName={displayName}
          t={t}
          setEditableName={setEditableName}
          variant="circle"
        />

        {/* ================================================= */}
        {/* LINKS */}
        {/* ================================================= */}

        <RenderSocialLinks
          lang={lang}
          socialLinks={socialLinks}
          themeColor={themeColor}
          editMode={editMode}
          onDeleteLink={onDeleteLink}
        />

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <Footer
  t={t}

  editMode={editMode}

  onSave={onSave}

  loading={saving}
  saved={saved}

  hasChanges={true}
/>

      </div>

    </div>
  )
}