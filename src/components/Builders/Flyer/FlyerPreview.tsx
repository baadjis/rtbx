
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

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

        if (el.type === "image") {
          return el.src ? (
            <img
              key={el.id}
              src={el.src}
              className="w-full rounded-xl"
            />
          ) : (
            <div key={el.id} className="h-32 bg-gray-200 flex items-center justify-center text-xs">
              image
            </div>
          )
        }

        return null
      })}

    </div>
  )
}

