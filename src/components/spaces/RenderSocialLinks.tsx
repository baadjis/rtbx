/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { Trash2, ExternalLink, GripVertical } from 'lucide-react'

import { LangType } from '@/lib/lang/types'

import {
  formatSocialUrl,
  get_social_config
} from '@/utils/social-config'

import {
  getAdaptiveGlow,
  getAdaptiveGradient
} from '@/utils/styles-utils'

type RenderSocialLinkProps = {
  link: any
  themeColor: string
  lang: LangType

  /* UNIVERSAL MODE */
  editMode?: boolean

  /* ACTIONS */
  onDelete?: () => void
  onClick?: () => void

  /* OPTIONAL */
  draggable?: boolean
}

export function RenderSocialLink({
  link,
  themeColor,
  lang,

  editMode = false,

  onDelete,
  onClick,

  draggable = false
}: RenderSocialLinkProps) {

  const SOCIAL_CONFIG =
    get_social_config(lang)

  const config =
    SOCIAL_CONFIG[
      link.network as keyof typeof SOCIAL_CONFIG
    ]

  if (!config) return null

  const finalUrl = formatSocialUrl(
    link.network,
    link.handle,
    lang
  )

  const Wrapper =
    editMode ? 'div' : 'a'

  return (

    <Wrapper

      {...(!editMode
        ? {
            href: finalUrl,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        : {})}

      onClick={onClick}

      className={`
        relative
        group
        block
        rounded-[2rem]
        p-[1px]
        transition-all duration-300

        ${
          editMode
            ? `
              cursor-default
            `
            : `
              hover:scale-[1.02]
            `
        }
      `}

      style={{
        background:
          getAdaptiveGradient(themeColor)
      }}
    >

      <div
        className="
          relative
          flex items-center gap-5
          p-4

          border border-white/15
          rounded-[2rem]

          transition-all duration-300

          shadow-[0_8px_32px_rgba(0,0,0,0.12)]

          bg-white/10
          backdrop-blur-xl
        "
      >

        {/* DRAG HANDLE */}

        {editMode && draggable && (

          <div className="
            opacity-40
            hover:opacity-100
            transition-opacity
            cursor-grab
          ">

            <GripVertical
              size={18}
              className="text-white"
            />

          </div>

        )}

        {/* ICON */}

        <div
          className="
            rounded-2xl
            p-[1px]
            transition-all duration-300

            group-hover:scale-105
          "
          style={{
            background: `
              linear-gradient(
                135deg,
                ${themeColor}55,
                rgba(255,255,255,0.08)
              )
            `
          }}
        >

          <div className="
            w-12 h-12
            rounded-2xl

            flex items-center justify-center

            bg-white/10
            group-hover:bg-white/20

            transition-all duration-300

            p-2.5
            shadow-inner
          ">

            <Image
              src={`/social_assets/${config.folder}/glyph/digital/png/full.png`}
              alt={link.network}
              width={30}
              height={30}
              className="
                object-contain

                opacity-90
                group-hover:opacity-100
                group-hover:scale-110

                transition-all duration-300
              "
            />

          </div>

        </div>

        {/* CONTENT */}

        <div className="text-left min-w-0">

          <span className="
            block
            text-lg
            font-bold
            text-white
            truncate
          ">
            {link.network}
          </span>

          <span
            className="
              block
              text-[10px]
              font-black
              uppercase
              tracking-widest
            "
            style={{
              color:
                'rgba(255,255,255,0.6)'
            }}
          >

            {editMode
              ? (
                link.handle ||
                config.action
              )
              : config.action}

          </span>

        </div>

        {/* RIGHT ACTION */}

        <div className="ml-auto flex items-center gap-2">

          {!editMode && (

            <div className="
              opacity-0
              group-hover:opacity-40

              transition-all

              pr-2
              translate-x-2
              group-hover:translate-x-0
            ">

              <ExternalLink
                size={18}
                className="text-white"
              />

            </div>

          )}

          {editMode && onDelete && (

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="
                w-10 h-10
                rounded-xl

                flex items-center justify-center

                bg-red-500/15
                hover:bg-red-500

                text-red-300
                hover:text-white

                transition-all duration-300
              "
            >

              <Trash2 size={16} />

            </button>

          )}

        </div>

        {/* GLOW */}

        <div
          className="
            absolute inset-0
            rounded-[2rem]

            opacity-0
            group-hover:opacity-100

            transition-opacity duration-300

            pointer-events-none
          "
          style={{
            boxShadow: `
              0 0 25px
              ${getAdaptiveGlow(themeColor)}
            `
          }}
        />

      </div>

    </Wrapper>

  )
}

export default function RenderSocialLinks({
  themeColor,
  socialLinks,
  lang,

  editMode = false,

  onDeleteLink,
  draggable = false
}: {
  themeColor: string
  socialLinks: any[]
  lang: LangType

  editMode?: boolean

  onDeleteLink?: (index: number) => void

  draggable?: boolean
}) {

  return (

    <div className="
      space-y-4
      w-full
      px-1 md:px-0
    ">

      {socialLinks.length > 0 ? (

        socialLinks.map(
          (link: any, i: number) => (

            <RenderSocialLink
              key={i}

              link={link}

              themeColor={themeColor}

              lang={lang}

              editMode={editMode}

              draggable={draggable}

              onDelete={() =>
                onDeleteLink?.(i)
              }
            />

          )
        )

      ) : (

        <div className="
          py-14
          text-center

          rounded-[2rem]

          border border-dashed
          border-white/10

          bg-white/5
          backdrop-blur-xl
        ">

          <p className="
            text-sm
            italic
            text-white/40
            font-medium
          ">

            {lang === 'fr'
              ? 'Aucun lien ajouté'
              : 'No links added'}

          </p>

        </div>

      )}

    </div>

  )
}