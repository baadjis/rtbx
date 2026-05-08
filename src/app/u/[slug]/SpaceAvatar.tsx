'use client'

import Image from 'next/image';

export function SpaceAvatarOld({imageUrl,themeColor,displayName}:
    {imageUrl:string,themeColor:string,displayName:string}){
    return( <div className="w-28 h-28 mx-auto p-1 rounded-[2.8rem] shadow-2xl border-4 border-white/10" 
                     style={{ background: `linear-gradient(to tr, ${themeColor}, #9333ea)` }}>
                    <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative text-white">
                      {imageUrl ? (
                        <Image 
                          src={imageUrl}
                          alt="Identity" 
                          fill 
                          className="object-contain" 
                          unoptimized 
                        />
                      ) : (
                        <span className="text-4xl font-black uppercase">{displayName?.[0] || 'R'}</span>
                      )}
                    </div>
                </div>)
}


type Variant = "default" | "circle" | "diamond";
const variants = {
    default: {
      outer: "rounded-[2.8rem]",
      inner: "rounded-[2.5rem]"
    },

    circle: {
      outer: "rounded-full",
      inner: "rounded-full"
    },

    diamond: {
      outer: "rounded-[2rem] rotate-45",
      inner: "rounded-[1.7rem]"
    }
  };

export function SpaceAvatar({
  imageUrl,
  themeColor,
  displayName,
  variant = "default"
}: {
  imageUrl: string;
  themeColor: string;
  displayName: string;
  variant?: Variant;
}) {

  

  const current = variants[variant];

  return (
   <div
  className={`
    group
    w-30 h-30 mx-auto p-[2px]
    shadow-2xl
    border border-white/10
    transition-all duration-500
    hover:scale-[1.25]
    hover:z-20
    hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]
    ${current.outer}
  `}
  style={{
    background: `linear-gradient(135deg, ${themeColor}, #9333ea)`
  }}
>
  <div
    className={`
      w-full h-full
      flex items-center justify-center
      overflow-hidden
      relative
      bg-white/5
      backdrop-blur-md
      transition-all duration-500
      p-3
      group-hover:p-0
      ${current.inner}
    `}
  >
    {imageUrl ? (
      <Image
        src={imageUrl}
        alt="Identity"
        fill
        unoptimized
        className={`
          object-contain
          transition-all duration-500
          ${variant === "diamond" ? "-rotate-45" : ""}
        `}
      />
    ) : (
      <span
        className={`
          text-4xl font-black uppercase text-white
          ${variant === "diamond" ? "-rotate-45" : ""}
        `}
      >
        {displayName?.[0] || "R"}
      </span>
    )}
  </div>
</div>
  );
}