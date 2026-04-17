
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from "next/image"
export default function FlyerPreview({ elements }: any) {
  return (
    <div className="space-y-4">

      {elements.map((el: any) => {

        if (el.type === "text") {
          return (
            <p
              key={el.id}
              style={{
                fontSize: el.style?.fontSize,
                fontWeight: el.style?.fontWeight
              }}
              className="text-center"
            >
              {el.text}
            </p>
          )
        }

        if (el.type === "image") { return el.src ? ( <div key={el.id} className="relative w-full h-40"> 
        <Image src={el.src} alt="flyer image" 
        fill className="object-cover rounded-xl" /> 
        </div> ) : ( <div key={el.id} className="h-32 bg-gray-200 flex items-center justify-center text-xs"> image </div> ) }

        return null
      })}

    </div>
  )
}

