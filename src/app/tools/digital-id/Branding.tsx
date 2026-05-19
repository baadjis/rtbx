/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from "lucide-react";
import Image from "next/image";
type BrandingProps={
    avatar?:any

    setAvatar:any
    fgColor?:string
    setFgColor:any
    handleImageUpload:any
    t:any
}

export default function Branding({avatar,setAvatar,fgColor,setFgColor,handleImageUpload,t}:BrandingProps){

    return(




<div className="grid md:grid-cols-2 gap-6 items-stretch">
    {/* AVATAR */}

    <div className="space-y-3 flex flex-col h-full">

      <div className="flex items-center justify-between">

        <div>

          <label className="
            text-[10px]
            font-black
            text-gray-400
            uppercase
            tracking-widest
            ml-2
          ">
            {t.label_avatar}
          </label>

          <p className="
            text-[11px]
            text-gray-400
            ml-2 mt-1
          ">
            {t.avatar_hint}
          </p>

        </div>

        {avatar && (
          <button
            onClick={() => setAvatar(null)}
            className="
              text-red-500
              text-[10px]
              font-bold
              hover:underline
            "
          >
            {t.remove}
          </button>
        )}

      </div>

      <div className="
        relative
        flex-1 min-h-[220px]
        rounded-[2rem]
        overflow-hidden
        border-2 border-dashed
        border-gray-200 dark:border-slate-700
        bg-gray-50 dark:bg-slate-800
        hover:border-indigo-400
        transition-all
      ">

        {avatar ? (

          <Image
            src={avatar}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized
          />

        ) : (

          <div className="
            absolute inset-0
            flex flex-col items-center justify-center
            gap-3
            text-gray-400
          ">

            <Upload size={24} />

            <span className="text-xs font-bold">
              {t.upload_avatar}
            </span>

          </div>

        )}

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
          className="
            absolute inset-0
            opacity-0
            cursor-pointer
          "
        />

      </div>

    </div>

    {/* THEME + QR */}
<div className="space-y-3 flex flex-col h-full">

  {/* HEADER */}

  <div>

    <label className="
      text-[10px]
      font-black
      text-gray-400
      uppercase
      tracking-widest
      ml-2
    ">
      {t.label_theme_color}
    </label>

    <p className="
      text-[11px]
      text-gray-400
      ml-2 mt-1
    ">
      {t.theme_color_hint}
    </p>

  </div>

  {/* CARD */}

  <div className="
    flex-1 min-h-[220px]
    rounded-[2rem]
    bg-gray-50 dark:bg-slate-800
    border border-gray-100 dark:border-slate-700
    flex flex-col items-center justify-center
    p-8
    relative overflow-hidden
  ">

    {/* PREVIEW GLOW */}

    <div
      className="
        absolute top-0 right-0
        w-40 h-40 rounded-full
        blur-3xl opacity-20
      "
      style={{
        background: fgColor
      }}
    />

    {/* COLOR PICKER */}

    <input
      type="color"
      value={fgColor}
      onChange={(e) =>
        setFgColor(e.target.value)
      }
      className="
        relative z-10
        w-24 h-24
        rounded-[2rem]
        border-none
        cursor-pointer
        bg-transparent
      "
    />

    {/* VALUE */}

    <div className="relative z-10 mt-5 text-center">

      <p className="
        font-black
        text-base
        dark:text-white
      ">
        {fgColor}
      </p>

      <div className="
        mt-3 inline-flex items-center gap-2
        px-3 py-2 rounded-full
        bg-white dark:bg-slate-900
        border border-gray-200 dark:border-slate-700
      ">

        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: fgColor
          }}
        />

        <span className="
          text-[11px]
          font-bold
          text-gray-500
        ">
          {t.theme_preview_hint}
        </span>

      </div>

    </div>

  </div>

</div>

  </div>

  
    )
}