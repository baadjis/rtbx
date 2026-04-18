/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

export default function Toolbar({ ctx }: any) {
  const { actions, selectedId } = ctx

  if (!selectedId) return null

  return (
    <div className="flex gap-2 justify-center flex-wrap">

      {/* 🎨 Text Color */}
      <input
        type="color"
        onChange={(e) =>
          actions.updateNode(selectedId, { color: e.target.value })
        }
        className="w-10 h-10 rounded"
      />

      {/* 🟦 Background */}
      <input
        type="color"
        onChange={(e) =>
          actions.updateNode(selectedId, { backgroundColor: e.target.value })
        }
        className="w-10 h-10 rounded"
      />

      {/* 🔠 Font Size */}
      <button
        onClick={() =>
          actions.updateNode(selectedId, { fontSize: 30 })
        }
        className="px-3 py-2 bg-gray-200 rounded-lg text-xs"
      >
        Big
      </button>

      <button
        onClick={() =>
          actions.updateNode(selectedId, { fontSize: 16 })
        }
        className="px-3 py-2 bg-gray-200 rounded-lg text-xs"
      >
        Small
      </button>

    </div>
  )
}