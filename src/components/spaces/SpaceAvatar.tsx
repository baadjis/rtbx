'use client'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'

type Variant = 'default' | 'circle' | 'diamond'

const variants = {
  default: { outer: 'rounded-[2.8rem]', inner: 'rounded-[2.5rem]' },
  circle: { outer: 'rounded-full', inner: 'rounded-full' },
  diamond: { outer: 'rounded-[2rem] rotate-45', inner: 'rounded-[1.7rem]' }
}

type SpaceAvatarProps = {
  imageUrl?: string | null
  themeColor?: string
  displayName?: string
  variant?: Variant
  /* EDIT MODE */
  editMode?: boolean
  editable?: boolean
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove?: () => void
  /* UI */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isUploading?: boolean   // ← Ajout léger pour le loading
}

const sizes = {
  sm: { wrapper: 'w-20 h-20', text: 'text-2xl' },
  md: { wrapper: 'w-28 h-28', text: 'text-4xl' },
  lg: { wrapper: 'w-36 h-36', text: 'text-5xl' },
  xl: { wrapper: 'w-44 h-44', text: 'text-6xl' }
}

export function SpaceAvatar({
  imageUrl,
  themeColor = '#4f46e5',
  displayName = 'R',
  variant = 'default',
  editMode = false,
  editable = false,
  onUpload,
  onRemove,
  size = 'md',
  isUploading = false
}: SpaceAvatarProps) {

  const current = variants[variant]
  const currentSize = sizes[size]

  return (
    <div className="relative inline-block group">
      {/* AVATAR */}
      <div
        className={`
          group
          w-30 h-30 mx-auto
          p-[4px]
          hover:p-[2px]
          shadow-2xl
          border border-white/10
          transition-all duration-500
          hover:scale-[1.30]
          hover:z-20
          hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]
          ${current.outer}
          ${currentSize.wrapper}
          ${!editMode ? `hover:scale-[1.08] hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]` : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${themeColor}, #9333ea)`
        }}
      >
        <div
          className={`
            relative
            w-full h-full
            flex items-center justify-center
            overflow-hidden
            bg-white/5
            backdrop-blur-md
            transition-all duration-500
            group-hover:w-[220px]
            group-hover:h-[140px]
            group-hover:rounded-3xl
            ${current.inner}
            ${!editMode ? `group-hover:bg-white/10` : ''}
          `}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Space Avatar"
              fill
              unoptimized
              className={`
                object-contain
                transition-all duration-500
                p-2
                group-hover:p-4
                ${variant === "diamond" ? "-rotate-45 group-hover:rotate-0" : ""}
                ${!editMode ? 'group-hover:scale-105' : ''}
              `}
            />
          ) : (
            <span
              className={`
                font-black
                uppercase
                text-white
                ${currentSize.text}
                ${variant === 'diamond' ? '-rotate-45' : ''}
              `}
            >
              {displayName?.[0] || 'R'}
            </span>
          )}

          {/* EDIT OVERLAY */}
          {editMode && editable && (
            <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Camera size={22} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {isUploading ? "Chargement..." : "Change"}
              </span>
            </div>
          )}

          {/* INPUT FILE */}
          {editMode && editable && onUpload && (
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* REMOVE BUTTON */}
      {editMode && editable && imageUrl && onRemove && (
        <button
          onClick={onRemove}
          className="
            absolute -top-2 -right-2
            w-9 h-9
            rounded-full
            bg-red-500
            text-white
            shadow-xl
            border-4 border-white dark:border-slate-950
            flex items-center justify-center
            hover:scale-110
            transition-all
          "
        >
          <X size={16} />
        </button>
      )}

      {/* EMPTY STATE HINT */}
      {editMode && editable && !imageUrl && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
          <Upload size={12} />
          Upload
        </div>
      )}
    </div>
  )
}