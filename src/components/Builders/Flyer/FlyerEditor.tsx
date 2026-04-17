
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export default function FlyerEditor({ elements, actions, t }: any) {

  const addText = () => {
    actions.addElement({
      type: "text",
      text: "New text"
    })
  }

  const addImage = () => {
    actions.addElement({
      type: "image",
      src: ""
    })
  }

  return (
    <div className="space-y-6">

      {/* TOOLS */}
      <div className="flex gap-2">
        <button onClick={addText} className="px-3 py-2 bg-gray-100 rounded-xl text-xs">
          {t.add_text}
        </button>

        <button onClick={addImage} className="px-3 py-2 bg-gray-100 rounded-xl text-xs">
          {t.add_image}
        </button>
      </div>

      {/* ELEMENTS LIST */}
      <div className="space-y-3">
        {elements.map((el: any) => (
          <div key={el.id} className="p-3 bg-gray-50 rounded-xl space-y-2">

            {el.type === "text" && (
              <input
                value={el.text}
                onChange={(e) =>
                  actions.updateElement(el.id, { text: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-xs"
              />
            )}

            {el.type === "image" && (
              <input
                placeholder="Image URL"
                value={el.src}
                onChange={(e) =>
                  actions.updateElement(el.id, { src: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-xs"
              />
            )}

            <button
              onClick={() => actions.removeElement(el.id)}
              className="text-red-500 text-xs"
            >
              {t.delete}
            </button>

          </div>
        ))}
      </div>

    </div>
  )
}

