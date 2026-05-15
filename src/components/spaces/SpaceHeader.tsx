/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Camera, Check, Pencil, Upload, X } from 'lucide-react'
import { SpaceAvatar } from './SpaceAvatar'

type Variant = 'default' | 'circle' | 'diamond'

type SpaceHeaderProps = {
  imageUrl?: string
  themeColor?: string
  displayName: string

  isProfileOnly?: boolean
  entity?: any
  t: any

  // EDIT MODE
  editMode?: boolean

  editableName?: string
  setEditableName?: (v: string) => void

  onAvatarUpload?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void

  onRemoveAvatar?: () => void

  variant?: Variant

  saving?: boolean
  saved?: boolean
}

export default function SpaceHeader({
  imageUrl,
  themeColor = '#4f46e5',
  displayName,

  isProfileOnly = false,
  entity,
  t,

  editMode = false,

  editableName,
  setEditableName,

  onAvatarUpload,
  onRemoveAvatar,

  variant = 'circle',

  saving = false,
  saved = false
}: SpaceHeaderProps) {

  const badge =
    isProfileOnly
      ? t.badge_personal
      : entity?.space_type === 'organization'
      ? 'Verified Organization'
      : t.badge_label

  return (

    <div className="
      relative
      space-y-7
      animate-in fade-in zoom-in duration-700
    ">

      {/* ========================================= */}
      {/* AVATAR */}
      {/* ========================================= */}

      <div className="relative w-fit mx-auto">

        <SpaceAvatar
          imageUrl={imageUrl || ''}
          themeColor={themeColor}
          displayName={displayName}
          variant={variant}
          editMode={editMode}
        />

        {editMode && (

          <>
            {/* upload */}
            <label
              className="
                absolute bottom-1 right-1
                w-12 h-12
                rounded-2xl
                bg-white text-slate-900
                flex items-center justify-center
                cursor-pointer
                shadow-xl
                border border-white/20
                hover:scale-105
                transition-all
              "
            >
              <Camera size={18} />

              <input
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
              />
            </label>

            {/* remove */}
            {imageUrl && (
              <button
                onClick={onRemoveAvatar}
                className="
                  absolute -top-2 -right-2
                  w-8 h-8
                  rounded-full
                  bg-red-500
                  text-white
                  flex items-center justify-center
                  shadow-lg
                  hover:scale-105
                  transition-all
                "
              >
                <X size={14} />
              </button>
            )}
          </>

        )}

      </div>

      {/* ========================================= */}
      {/* NAME */}
      {/* ========================================= */}

      <div className="space-y-4 text-center">

        {!editMode ? (

          <h1 className="
            text-4xl md:text-5xl
            font-black
            tracking-tight
            leading-tight
            uppercase italic
            text-white
          ">
            {displayName}
          </h1>

        ) : (

          <div className="
            max-w-md mx-auto
            flex items-center gap-3
            p-2
            rounded-[2rem]
            bg-white/10
            backdrop-blur-xl
            border border-white/10
          ">

            <div className="
              w-12 h-12
              rounded-2xl
              bg-white/10
              flex items-center justify-center
              shrink-0
            ">
              <Pencil size={18} className="text-white/70" />
            </div>

            <input
              value={editableName}
              onChange={(e) =>
                setEditableName?.(e.target.value)
              }
              placeholder={t.ph_entity_name}
              className="
                flex-1
                bg-transparent
                text-white
                text-2xl md:text-3xl
                font-black
                uppercase italic
                border-none
                outline-none
                placeholder:text-white/30
              "
            />

          </div>

        )}

        {/* ========================================= */}
        {/* BADGE */}
        {/* ========================================= */}

        <div className="
          flex flex-wrap items-center justify-center
          gap-3
        ">

          <div className="
            inline-flex items-center gap-2
            px-4 py-2
            bg-white/5
            rounded-full
            border border-white/10
            backdrop-blur-md
          ">

            <div
              className="
                w-2 h-2
                rounded-full
                animate-pulse
              "
              style={{
                backgroundColor: themeColor
              }}
            />

            <span className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]
              text-white/80
            ">
              {badge}
            </span>

          </div>

          {/* EDIT STATUS */}

          {editMode && (

            <div className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/5
              backdrop-blur-md
            ">

              {saving ? (

                <>
                  <Upload
                    size={12}
                    className="animate-pulse text-white/70"
                  />

                  <span className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-white/70
                  ">
                    {t.saving}
                  </span>
                </>

              ) : saved ? (

                <>
                  <Check
                    size={12}
                    className="text-green-400"
                  />

                  <span className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-green-400
                  ">
                    {t.saved}
                  </span>
                </>

              ) : (

                <>
                  <Pencil
                    size={12}
                    className="text-white/60"
                  />

                  <span className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-white/60
                  ">
                    {t.editing}
                  </span>
                </>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  )
}