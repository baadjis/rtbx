
'use client'

export default function Toolbar({ ctx }: any) {
  const { actions } = ctx

  return (
    <div className="flex gap-2 justify-center">

      <button
        onClick={() =>
          actions.updateNode(ctx.selectedId, { backgroundColor: "#f00" })
        }
        className="px-3 py-2 bg-gray-200 rounded-lg text-xs"
      >
        Red
      </button>

      <button
        onClick={() =>
          actions.updateNode(ctx.selectedId, { fontSize: 30 })
        }
        className="px-3 py-2 bg-gray-200 rounded-lg text-xs"
      >
        Big Text
      </button>

    </div>
  )
}

