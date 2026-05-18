/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Footer from './SpaceFooter'
import RenderSocialLinks from './RenderSocialLinks'
import SpaceHeader from './SpaceHeader'
import { LangType } from '@/lib/lang/types'
import { Data } from './data'
import SocialLinksAdd from './SocialLinksAdd'
import { Link2 } from 'lucide-react'

type SpaceViewProps = {
  entity: any
  lang: LangType
  
  // modes
  editMode?: boolean
  saving?: boolean
  saved?: boolean
  showAddLinks?:boolean,
  isProfileOnly:boolean

  // edit actions
  onSave?:  any
  socialLinks:any[]
  socialLinksOptions?:any
  onDeleteLink?: (index: number)=>void
  onUpdateLink?: (index: number)=>void
  onExitEdit?:()=>void
  onAddLink?:()=>void


  // live edition
  setEditableName?: any
  setLinks?:any
  updateLink?:any
  links?:any

  
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
  onUpdateLink,
  onAddLink,
  showAddLinks,
  onExitEdit,
  socialLinks,
  socialLinksOptions,
  isProfileOnly,
  setLinks,
  updateLink,
  links
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
  const publicUrl=`/u/${entity.slug}`
  const homeUrl =`/`

  const themeColor =
    entity.theme_color || '#4f46e5'

  const bgColor =
    entity.bg_color || '#0f172a'

  /*const socialLinks =
    entity.social_data || []*/

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
          onUpdateLink={onUpdateLink}
        />


      

{/* ================================================= */}
{/* EDIT SOCIALS */}
{/* ================================================= */}

{editMode && showAddLinks &&(

  <div className="
    space-y-5
    mt-8

    rounded-[2.5rem]

    border border-white/10

    bg-white/5
    backdrop-blur-2xl

    p-5
  ">

    <div className="flex items-center gap-3">

      <div
        className="
          w-11 h-11
          rounded-2xl

          flex items-center justify-center

          bg-white/10
          border border-white/10
        "
      >

        <Link2 size={18} />

      </div>

      <div className="text-left">

        <p className="
          text-sm font-black
          uppercase tracking-[0.18em]
        ">
          {t.edit_links}
        </p>

        <p className="
          text-xs text-white/50
        ">
          {t.edit_links_hint}
        </p>

      </div>

    </div>

     <SocialLinksAdd
      links={links}
      setLinks={
       setLinks
      }
      updateLink={updateLink
      }
      t={t}
      lang={lang}
      socialLinksOptions={socialLinksOptions}
    />

  </div>

)}

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

<Footer
  t={t}

  editMode={editMode}

  onSave={onSave}
  onExitEdit={onExitEdit}
  onAddLink={onAddLink}

  loading={saving}
  saved={saved}

  hasChanges={true}
  publicUrl={publicUrl}
  homeUrl={homeUrl}

/>

      </div>

    </div>
  )
}