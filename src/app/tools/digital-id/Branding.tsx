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
          onChange={(e) =>
            handleImageUpload(e, setAvatar)
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

<div className="flex flex-col h-full items-center justify-center">
      {/* THEME COLOR */}

      <div className="space-y-2">

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

        <div className="
           flex items-center gap-4
          p-5 rounded-[2rem]
          bg-gray-50 dark:bg-slate-800
         border border-gray-100 dark:border-slate-700
         flex-1 min-h-[220px]
        ">

          <input
            type="color"
            value={fgColor}
            onChange={(e) =>
              setFgColor(e.target.value)
            }
            className="
              w-16 h-16
              rounded-2xl
              border-none
              cursor-pointer
              bg-transparent
            "
          />

          <div>

            <p className="
              font-black text-sm
              dark:text-white
            ">
              {fgColor}
            </p>

            <p className="
              text-xs text-gray-400
            ">
              {t.theme_color_hint}
            </p>

          </div>

        </div>

      </div>

      {/* QR LOGO */}

     

    </div>

  </div>

  
    )
}