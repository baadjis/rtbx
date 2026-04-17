
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

export default function Editor({
  ctx,
  tools = [],
  inspector: Inspector,
  renderer: Renderer
}: any) {

  const { elements, actions, t } = ctx
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = elements.find((el: any) => el.id === selectedId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* 🧰 TOOLS */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-gray-400">
          {t?.tools || 'Tools'}
        </h3>

        {tools.map((tool: any) => (
          <button
            key={tool.id}
            onClick={() => actions.addElement(tool.create())}
            className="w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* 🎨 CANVAS */}
      <div className="col-span-2 bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 min-h-[400px]">
        
        {Renderer ? (
          <Renderer
            elements={elements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        ) : (
          <div className="space-y-2">
            {elements.map((el: any) => (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`p-3 rounded-xl cursor-pointer border ${
                  selectedId === el.id
                    ? 'border-indigo-500'
                    : 'border-transparent'
                }`}
              >
                {el.type === 'text' && (
                  <p className="font-bold">{el.text || 'Text'}</p>
                )}

                {el.type === 'image' && (
                  <div className="bg-gray-200 h-20 flex items-center justify-center text-xs">
                    image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚙️ INSPECTOR */}
      <div className="col-span-3 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
        
        {selected ? (
          Inspector ? (
            <Inspector selected={selected} ctx={ctx} />
          ) : (
            <DefaultInspector selected={selected} ctx={ctx} />
          )
        ) : (
          <p className="text-xs text-gray-400">
            {t?.no_selection || 'No element selected'}
          </p>
        )}
      </div>

    </div>
  )
}

function DefaultInspector({ selected, ctx }: any) {
  const { actions } = ctx

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase text-gray-400">
        Default Inspector
      </p>

      {selected.type === 'text' && (
        <input
          value={selected.text}
          onChange={(e) =>
            actions.updateElement(selected.id, { text: e.target.value })
          }
          className="w-full p-2 rounded-lg border"
        />
      )}

      <button
        onClick={() => actions.removeElement(selected.id)}
        className="w-full p-2 bg-red-500 text-white rounded-lg text-xs"
      >
        Delete
      </button>
    </div>
  )
}

