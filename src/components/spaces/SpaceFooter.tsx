/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'

import {
  Save,
  Eye,
  Plus,
  LogOut,
  Loader2,
  Check,
  Pencil
} from 'lucide-react'

import { BrandLogo } from '@/components/BrandLogo'

type FooterProps = {
  t: any

  /* UNIVERSAL */
  editMode?: boolean

  /* LINKS */
  publicUrl?: string
  homeUrl?: string

  /* ACTIONS */
  onSave?: () => void
  onAddLink?: () => void
  onExitEdit?: () => void

  /* STATES */
  loading?: boolean
  saved?: boolean
  hasChanges?: boolean
}

export default function Footer({
  t,

  editMode = false,

  publicUrl = '/',
  homeUrl = '/',

  onSave,
  onAddLink,
  onExitEdit,

  loading = false,
  saved = false,
  hasChanges = false
}: FooterProps) {

  /* ====================================================== */
  /* PUBLIC FOOTER */
  /* ====================================================== */

  if (!editMode) {

    return (

      <div className="
        pt-4 pb-24 md:pb-10
        space-y-4
        flex flex-col items-center
      ">

        <Link
          href={homeUrl}
          className="
            inline-flex flex-col items-start gap-2

            px-5 py-4

            rounded-[2rem]

            bg-white/10
            hover:bg-white/15

            border border-white/10

            backdrop-blur-xl

            transition-all duration-300

            hover:scale-[1.02]
            hover:shadow-lg

            no-underline
            max-w-full
          "
        >

          {/* LOGO */}

          <div className="
            flex items-center gap-3
          ">

            <div className="-mb-6">

              <BrandLogo />

            </div>

            <p className="
              text-sm
              font-bold
              text-white
              leading-none
              -translate-y-[1px]
            ">
              rtbx.space
            </p>

          </div>

          {/* CTA */}

          <p className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-white/50
            leading-tight
            text-center
          ">

            Your modern social space

          </p>

        </Link>

        {/* FOOTER TEXT */}

        <p className="
          text-[9px]
          font-black
          text-white/40
          uppercase
          tracking-[0.3em]
          text-center
          px-4
        ">

          {t.footer_text}

        </p>

      </div>

    )

  }

  /* ====================================================== */
  /* EDIT FOOTER */
  /* ====================================================== */

  return (

    <div className="
      fixed bottom-0 left-0 right-0
      z-50

      px-4 pb-4
      md:px-6 md:pb-6
    ">

      <div className="
        max-w-4xl mx-auto

        rounded-[2rem]

        border border-white/10

        bg-black/30
        backdrop-blur-2xl

        shadow-2xl
        shadow-black/30

        p-3 md:p-4
      ">

        <div className="
          flex items-center justify-between
          gap-3
          flex-wrap
        ">

          {/* LEFT */}

          <div className="
            flex items-center gap-2
            flex-wrap
          ">

            {/* EDIT BADGE */}

            <div className="
              hidden md:flex
              items-center gap-2

              px-4 py-2

              rounded-2xl

              bg-white/10
              border border-white/10
            ">

              <Pencil
                size={14}
                className="text-white/70"
              />

              <span className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-white/70
              ">

                {t.edit_mode}

              </span>

            </div>

            {/* PUBLIC VIEW */}

            <Link
              href={publicUrl}
              target="_blank"
              className="
                h-12 px-4

                rounded-2xl

                flex items-center gap-2

                bg-white/10
                hover:bg-white/15

                border border-white/10

                text-white
                no-underline

                transition-all duration-300
              "
            >

              <Eye size={16} />

              <span className="
                hidden sm:block
                text-sm font-bold
              ">

                {t.view_public || 'View'}

              </span>

            </Link>

            {/* ADD LINK */}

            <button
              onClick={onAddLink}
              className="
                h-12 px-4

                rounded-2xl

                flex items-center gap-2

                bg-white/10
                hover:bg-white/15

                border border-white/10

                text-white

                transition-all duration-300
              "
            >

              <Plus size={16} />

              <span className="
                hidden sm:block
                text-sm font-bold
              ">

                {t.add_link || 'Add Link'}

              </span>

            </button>

          </div>

          {/* RIGHT */}

          <div className="
            flex items-center gap-2
          ">

            {/* EXIT */}

            <button
              onClick={onExitEdit}
              className="
                h-12 px-4

                rounded-2xl

                flex items-center gap-2

                bg-red-500/15
                hover:bg-red-500

                border border-red-500/20

                text-red-200
                hover:text-white

                transition-all duration-300
              "
            >

              <LogOut size={16} />

              <span className="
                hidden sm:block
                text-sm font-bold
              ">

                {t.exit || 'Exit'}

              </span>

            </button>

            {/* SAVE */}

            <button
              onClick={onSave}
              disabled={loading || !hasChanges}
              className={`
                h-12 px-5

                rounded-2xl

                flex items-center gap-3

                font-black

                transition-all duration-300

                ${
                  hasChanges
                    ? `
                      bg-indigo-600
                      hover:bg-indigo-700

                      text-white

                      shadow-lg
                      shadow-indigo-500/30
                    `
                    : `
                      bg-white/10
                      text-white/40
                      cursor-not-allowed
                    `
                }
              `}
            >

              {loading ? (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              ) : saved ? (

                <Check size={18} />

              ) : (

                <Save size={18} />

              )}

              <span className="text-sm">

                {loading
                  ? (
                    t.saving ||
                    'Saving...'
                  )
                  : saved
                  ? (
                    t.saved ||
                    'Saved'
                  )
                  : (
                    t.save ||
                    'Save'
                  )
                }

              </span>

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}